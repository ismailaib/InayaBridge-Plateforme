"use client";

import {
  Camera,
  Mic,
  MicOff,
  Monitor,
  MoreVertical,
  Phone,
  PhoneOff,
  Settings,
  Share,
  UserPlus,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Socket, io } from "socket.io-client";

import { useEffect, useRef, useState } from "react";

const peerConfig = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  ],
};

export default function VideoCall() {
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
  const [showSettings, setShowSettings] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  // Socket and WebRTC
  const [socket, setSocket] = useState<Socket>();
  const [didOffer, setDidOffer] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const userName = useRef(`User-${Math.floor(Math.random() * 1000)}`).current;

  useEffect(() => {
    const s = io("https://localhost:8181/", {
      auth: { userName, password: "x" },
    });
    setSocket(s);
    s.on("connect", () => setConnectionStatus("connected"));
    s.on("disconnect", () => setConnectionStatus("disconnected"));
    s.on("availableOffers", (o: any[]) => setOffers(o));
    s.on("newOfferAwaiting", (o: any[]) =>
      setOffers((prev) => [...prev, ...o]),
    );
    s.on("answerResponse", async (obj) => await addAnswer(obj));
    s.on("receivedIceCandidateFromServer", addNewIceCandidate);
    return () => {
      s.disconnect();
      peerRef.current?.close();
    };
  }, []);

  const fetchMedia = async () => {
    if (localStreamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: isAudioOn,
      });
      localStreamRef.current = stream;
      if (localVid.current) localVid.current.srcObject = stream;
      setConnectionStatus("media-ready");
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setConnectionStatus("media-error");
    }
  };

  const createPeer = async (offerObj?: any) => {
    peerRef.current = new RTCPeerConnection(peerConfig);
    remoteStreamRef.current = new MediaStream();
    if (remoteVid.current)
      remoteVid.current.srcObject = remoteStreamRef.current;
    localStreamRef.current
      ?.getTracks()
      .forEach((t) => peerRef.current?.addTrack(t, localStreamRef.current!));

    peerRef.current.onicecandidate = (e) => {
      if (e.candidate)
        socket?.emit("sendIceCandidateToSignalingServer", {
          iceCandidate: e.candidate,
          iceUserName: userName,
          didIOffer: didOffer,
        });
    };

    peerRef.current.ontrack = (e) =>
      e.streams[0]
        .getTracks()
        .forEach((t) => remoteStreamRef.current?.addTrack(t));
    peerRef.current.onconnectionstatechange = () => {
      const state = peerRef.current?.connectionState;
      if (state === "connected") setIsInCall(true);
      if (state === "disconnected" || state === "failed") setIsInCall(false);
    };

    if (offerObj) await peerRef.current.setRemoteDescription(offerObj.offer);
  };

  const callPeer = async () => {
    setWaiting(true);
    setConnectionStatus("calling");
    await fetchMedia();
    await createPeer();
    const offer = await peerRef.current!.createOffer();
    await peerRef.current!.setLocalDescription(offer);
    setDidOffer(true);
    socket?.emit("newOffer", offer);
  };

  const answerOffer = async (offerObj: any) => {
    setConnectionStatus("answering");
    await fetchMedia();
    await createPeer(offerObj);
    const answer = await peerRef.current!.createAnswer();
    await peerRef.current!.setLocalDescription(answer);
    offerObj.answer = answer;
    const ics = await socket?.emitWithAck("newAnswer", offerObj);
    ics?.forEach((c: any) => peerRef.current?.addIceCandidate(c));
    setWaiting(false);
    setOffers((o) =>
      o.filter((of) => of.offererUserName !== offerObj.offererUserName),
    );
  };

  const addAnswer = async (offerObj: any) => {
    await peerRef.current?.setRemoteDescription(offerObj.answer);
    setWaiting(false);
    setConnectionStatus("connected");
  };

  const addNewIceCandidate = (c: any) => peerRef.current?.addIceCandidate(c);

  const hangup = () => {
    peerRef.current?.close();
    peerRef.current = null;
    remoteStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setWaiting(false);
    setIsInCall(false);
    setConnectionStatus("disconnected");
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const testMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone test successful");
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Microphone test failed:", error);
    }
  };

  const testCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Camera test successful");
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Camera test failed:", error);
    }
  };

  const testSpeakers = () => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyDy/LFdCkFKH3J8NyOPwoUXbPq66hWFApGnt/yvmw",
    );
    audio.play().catch((e) => console.log("Speaker test failed:", e));
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-blue-500";
      case "calling":
      case "answering":
        return "bg-yellow-500";
      case "media-error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "calling":
        return "Calling...";
      case "answering":
        return "Answering...";
      case "media-ready":
        return "Ready";
      case "media-error":
        return "Media Error";
      default:
        return "Disconnected";
    }
  };

  return (
    <div className="h-screen dark:bg-gray-900 bg-white dark:text-white text-gray-800 flex flex-col">
      {/* Header */}
      <div className="dark:bg-gray-900 bg-white dark:text-white text-gray-800  px-4 py-3 flex items-center justify-between border-b dark:border-gray-700 border-gray-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            <span className="text-sm text-gray-900 dark:text-gray-300">
              {getStatusText()}
            </span>
          </div>
          <span className="text-lg font-semibold">Visio Conférence</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 dark:hover:bg-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 dark:hover:bg-gray-700 hover:bg-gray-300 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="dark:bg-gray-900 bg-gray-100 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={testMicrophone}
              className="px-3 py-2 bg-[#3b82f6]/80 hover:bg-[#3b82f6] rounded-lg text-sm transition-colors flex items-center gap-2 dark:text-gray-900 text-white"
            >
              <Mic className="w-4 h-4" />
              Test Micro
            </button>
            <button
              onClick={testCamera}
              className="px-3 py-2 bg-[#3b82f6]/80 hover:bg-[#3b82f6] rounded-lg text-sm transition-colors flex items-center gap-2 dark:text-gray-900 text-white"
            >
              <Camera className="w-4 h-4" />
              Test Caméra
            </button>
            <button
              onClick={testSpeakers}
              className="px-3 py-2 bg-[#3b82f6]/80 hover:bg-[#3b82f6] rounded-lg text-sm transition-colors flex items-center gap-2 dark:text-gray-900 text-white"
            >
              <Volume2 className="w-4 h-4" />
              Test Haut-parleurs
            </button>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Area */}
        <div className="flex-1 relative bg-black">
          {/* Remote Video (Main) */}
          <video
            ref={remoteVid}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
            <video
              ref={localVid}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {!isVideoOn && (
              <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Status Messages */}
          {waiting && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 px-6 py-3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Waiting for answer...</span>
              </div>
            </div>
          )}

          {/* Incoming Calls */}
          {offers.length > 0 && (
            <div className="absolute top-4 left-4 space-y-2">
              {offers.map((offer, i) => (
                <div
                  key={i}
                  className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-5 h-5" />
                    <span className="font-medium">
                      {offer.offererUserName} is calling
                    </span>
                    <button
                      onClick={() => answerOffer(offer)}
                      className="ml-auto px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Answer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="absolute left-[56.5%] bottom-8 -translate-x-1/2 z-20 rounded-xl dark:bg-gray-950 bg-gray-100 px-6 py-4 flex items-center justify-center gap-4 border-t dark:border-gray-800 border-gray-400 shadow-lg">
          {/* Audio Controls */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioOn
                ? "bg-gray-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            }`}
            title={isAudioOn ? "Couper le micro" : "Activer le micro"}
          >
            {isAudioOn ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </button>

          {/* Video Controls */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoOn
                ? "bg-gray-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            }`}
            title={isVideoOn ? "Couper la vidéo" : "Activer la vidéo"}
          >
            {isVideoOn ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </button>

          {/* Speaker Controls */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-3 rounded-full transition-colors ${
              isSpeakerOn
                ? "bg-gray-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            }`}
            title={isSpeakerOn ? "Couper le son" : "Activer le son"}
          >
            {isSpeakerOn ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          {/* Screen Share */}
          <button
            className="p-3 bg-gray-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Partager l'écran"
          >
            <Share className="w-5 h-5" />
          </button>

          {/* Call/Hangup */}
          {!isInCall && !waiting ? (
            <button
              onClick={callPeer}
              className="p-4  text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-full transition-colors"
              title="Démarrer l'appel"
            >
              <Phone className="w-6 h-6" />
            </button>
          ) : isInCall || waiting ? (
            <button
              onClick={hangup}
              className="p-4 text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-full transition-colors"
              title="Raccrocher"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          ) : (
            <button
              className="p-4 bg-gray-300 dark:bg-gray-300 rounded-full cursor-not-allowed opacity-50"
              disabled
              title="En attente d'un participant"
            >
              <Phone className="w-6 h-6" />
            </button>
          )}

          {/* More Options */}
          <button
            className="p-3 bg-gray-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Plus d'options"
          >
            <Monitor className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
