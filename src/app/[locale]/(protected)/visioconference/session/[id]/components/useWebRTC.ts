import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

const peerConfig: RTCConfiguration = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  ],
};

export const useWebRTC = (sessionId: string | string[]) => {
  const localVid = useRef<HTMLVideoElement | null>(null);
  const remoteVid = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // UI State
  const [waiting, setWaiting] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  // Socket and WebRTC
  const [socket, setSocket] = useState<Socket | null>(null);
  const didOfferRef = useRef(false);
  const [offers, setOffers] = useState<any[]>([]);
  const userName = useRef(`User-${Math.floor(Math.random() * 1000)}`).current;

  // Helper: emit with ack
  const emitWithAck = async (event: string, ...args: any[]): Promise<any> => {
    if (!socket) return null;
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Acknowledgment timeout'));
      }, 5000);

      socket.emit(event, ...args, (response: any) => {
        clearTimeout(timeout);
        resolve(response);
      });
    });
  };

  useEffect(() => {
    const s = io("https://localhost:8181/", {
      auth: { userName, password: "x" },
      query: { sessionId },
      transports: ["websocket"],
    });

    setSocket(s);

    const onConnect = () => {
      console.log("Socket connected");
      setConnectionStatus("connected");
    };
    
    const onDisconnect = () => {
      console.log("Socket disconnected");
      setConnectionStatus("disconnected");
    };
    
    const onAvailable = (o: any[]) => {
      console.log("Available offers:", o);
      setOffers(o || []);
    };
    
    const onNewOffer = (o: any[]) => {
      console.log("New offer awaiting:", o);
      setOffers((prev) => [...prev, ...o]);
    };
    
    const onAnswer = async (obj: any) => {
      console.log("Answer response received:", obj);
      try {
        await addAnswer(obj);
      } catch (err) {
        console.error("addAnswer failed", err);
      }
    };
    
    const onIce = (c: any) => {
      console.log("Received ICE candidate:", c);
      addNewIceCandidate(c);
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("availableOffers", onAvailable);
    s.on("newOfferAwaiting", onNewOffer);
    s.on("answerResponse", onAnswer);
    s.on("receivedIceCandidateFromServer", onIce);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("availableOffers", onAvailable);
      s.off("newOfferAwaiting", onNewOffer);
      s.off("answerResponse", onAnswer);
      s.off("receivedIceCandidateFromServer", onIce);

      try {
        s.disconnect();
      } catch (e) {
        console.error("Disconnect error:", e);
      }

      try {
        peerRef.current?.close();
      } catch (e) {}
      peerRef.current = null;

      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((t) => t.stop());
        remoteStreamRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, [sessionId, userName]);

  const fetchMedia = async () => {
    if (localStreamRef.current) {
      const v = localStreamRef.current.getVideoTracks()[0];
      const a = localStreamRef.current.getAudioTracks()[0];
      if (v) v.enabled = isVideoOn;
      if (a) a.enabled = isAudioOn;
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: isAudioOn,
      });

      localStreamRef.current = stream;
      if (localVid.current) localVid.current.srcObject = stream;
      setConnectionStatus("media-ready");
      console.log("Media fetched successfully");
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setConnectionStatus("media-error");
      throw error;
    }
  };

  const createPeer = async (offerObj?: any) => {
    try {
      peerRef.current?.close();
    } catch (e) {}
    
    peerRef.current = new RTCPeerConnection(peerConfig);
    console.log("Peer connection created");

    remoteStreamRef.current = new MediaStream();
    if (remoteVid.current) remoteVid.current.srcObject = remoteStreamRef.current;

    localStreamRef.current
      ?.getTracks()
      .forEach((t) => {
        console.log("Adding local track:", t.kind);
        peerRef.current?.addTrack(t, localStreamRef.current!);
      });

    peerRef.current.onicecandidate = (e) => {
      if (e.candidate && socket) {
        console.log("Sending ICE candidate");
        socket.emit("sendIceCandidateToSignalingServer", {
          iceCandidate: e.candidate,
          iceUserName: userName,
          didIOffer: didOfferRef.current,
        });
      }
    };

    peerRef.current.ontrack = (e) => {
      console.log("Received remote track:", e.track.kind);
      try {
        const incomingStreams = e.streams;
        if (incomingStreams && incomingStreams.length) {
          incomingStreams[0]
            .getTracks()
            .forEach((t) => remoteStreamRef.current?.addTrack(t));
        } else {
          if (e.track) remoteStreamRef.current?.addTrack(e.track);
        }
      } catch (err) {
        console.warn("ontrack handler error", err);
      }
    };

    peerRef.current.onconnectionstatechange = () => {
      const state = peerRef.current?.connectionState;
      console.log("Connection state changed:", state);
      if (state === "connected") {
        setIsInCall(true);
        setWaiting(false);
        setConnectionStatus("connected");
      } else if (state === "disconnected" || state === "failed" || state === "closed") {
        setIsInCall(false);
        setConnectionStatus("disconnected");
      }
    };

    if (offerObj && offerObj.offer) {
      try {
        console.log("Setting remote description from offer");
        await peerRef.current.setRemoteDescription(offerObj.offer);
      } catch (err) {
        console.error("setRemoteDescription failed", err);
      }
    }
  };

  const callPeer = async () => {
    console.log("Initiating call...");
    setWaiting(true);
    setConnectionStatus("calling");
    try {
      await fetchMedia();
      await createPeer();
      
      const offer = await peerRef.current!.createOffer();
      console.log("Offer created:", offer);
      
      await peerRef.current!.setLocalDescription(offer);
      didOfferRef.current = true;
      
      console.log("Emitting newOffer to server");
      socket?.emit("newOffer", offer);
    } catch (err) {
      console.error("callPeer error", err);
      setWaiting(false);
      setConnectionStatus("disconnected");
    }
  };

  const answerOffer = async (offerObj: any) => {
    console.log("Answering offer from:", offerObj.offererUserName);
    setConnectionStatus("answering");
    setWaiting(true);
    try {
      await fetchMedia();
      await createPeer(offerObj);
      
      const answer = await peerRef.current!.createAnswer();
      console.log("Answer created:", answer);
      
      await peerRef.current!.setLocalDescription(answer);
      
      offerObj.answer = answer;
      
      console.log("Sending answer to server...");
      const ackCandidates = await emitWithAck("newAnswer", offerObj);
      console.log("Received ICE candidates:", ackCandidates);
      
      if (Array.isArray(ackCandidates)) {
        ackCandidates.forEach((c: any) => {
          try {
            peerRef.current?.addIceCandidate(c);
            console.log("Added ICE candidate from ack");
          } catch (e) {
            console.warn("addIceCandidate failed", e);
          }
        });
      }
      setWaiting(false);

      setOffers((o) =>
        o.filter((of) => of.offererUserName !== offerObj.offererUserName),
      );
    } catch (err) {
      console.error("answerOffer error", err);
      setWaiting(false);
      setConnectionStatus("disconnected");
    }
  };

  const addAnswer = async (offerObj: any) => {
    try {
      console.log("Adding answer to peer connection");
      await peerRef.current?.setRemoteDescription(offerObj.answer);
      setWaiting(false);
      setConnectionStatus("connected");
    } catch (err) {
      console.error("addAnswer error", err);
    }
  };

  const addNewIceCandidate = (c: any) => {
    try {
      if (peerRef.current && c) {
        peerRef.current.addIceCandidate(c);
        console.log("ICE candidate added");
      }
    } catch (err) {
      console.warn("addNewIceCandidate error", err);
    }
  };

  const hangup = () => {
    console.log("Hanging up...");
    try {
      peerRef.current?.close();
    } catch (e) {}
    peerRef.current = null;

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((t) => t.stop());
      remoteStreamRef.current = null;
      if (remoteVid.current) remoteVid.current.srcObject = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      if (localVid.current) localVid.current.srcObject = null;
    }

    didOfferRef.current = false;
    setWaiting(false);
    setIsInCall(false);
    setConnectionStatus("disconnected");
  };

  const toggleVideo = async () => {
    if (!localStreamRef.current) {
      setIsVideoOn((v) => !v);
      return;
    }
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    } else {
      setIsVideoOn((v) => !v);
    }
  };

  const toggleAudio = async () => {
    if (!localStreamRef.current) {
      setIsAudioOn((v) => !v);
      return;
    }
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioOn(audioTrack.enabled);
    } else {
      setIsAudioOn((v) => !v);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  return {
    localVid,
    remoteVid,
    waiting,
    isVideoOn,
    isAudioOn,
    isSpeakerOn,
    isInCall,
    connectionStatus,
    offers,
    callPeer,
    answerOffer,
    hangup,
    toggleVideo,
    toggleAudio,
    toggleSpeaker,
  };
};