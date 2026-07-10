"use client";

import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Phone,
    PhoneOff,
    Volume2,
    VolumeX,
    UserPlus,
    Airplay,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

const peerConfig = {
    iceServers: [
        { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
    ],
};

export default function PatientVisioPage() {
    const { sessionId } = useParams();

    const localVid = useRef<HTMLVideoElement | null>(null);
    const remoteVid = useRef<HTMLVideoElement | null>(null);
    const peerRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);

    const [socket, setSocket] = useState<Socket>();
    const [waiting, setWaiting] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);
    const [isInCall, setIsInCall] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");

    const didOfferRef = useRef(false); // CHANGED: Use ref instead of state
    const [offers, setOffers] = useState<any[]>([]);

    const [patientName, setPatientName] = useState("");
    const [patientCin, setPatientCin] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const userNameRef = useRef("");

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
        if (!isAuthenticated) return;

        userNameRef.current = `${patientName}-${patientCin}`;

        const s = io("https://localhost:8181/", {
            auth: { userName: userNameRef.current, password: "x" },
            query: { sessionId }, // CRITICAL: sessionId sent here
        });
        setSocket(s);

        s.on("connect", () => {
            console.log("Patient socket connected");
            setConnectionStatus("connected");
        });

        s.on("disconnect", () => {
            console.log("Patient socket disconnected");
            setConnectionStatus("disconnected");
        });

        s.on("availableOffers", (o: any[]) => {
            console.log("Available offers:", o);
            setOffers(o);
        });

        s.on("newOfferAwaiting", (o: any[]) => {
            console.log("New offer awaiting:", o);
            setOffers((prev) => [...prev, ...o]);
        });

        s.on("answerResponse", async (obj) => {
            console.log("Answer response:", obj);
            await addAnswer(obj);
        });

        s.on("receivedIceCandidateFromServer", (c) => {
            console.log("Received ICE candidate");
            addNewIceCandidate(c);
        });

        return () => {
            s.disconnect();
            peerRef.current?.close();
        };
    }, [isAuthenticated, patientName, patientCin, sessionId]);

    const fetchMedia = async () => {
        if (localStreamRef.current) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            localStreamRef.current = stream;
            if (localVid.current) localVid.current.srcObject = stream;
            setConnectionStatus("media-ready");
            console.log("Patient media fetched");
        } catch (error) {
            console.error("Patient media error:", error);
            setConnectionStatus("media-error");
        }
    };

    const createPeer = async (offerObj?: any) => {
        try {
            peerRef.current?.close();
        } catch (e) { }

        peerRef.current = new RTCPeerConnection(peerConfig);
        console.log("Patient peer connection created");

        remoteStreamRef.current = new MediaStream();
        if (remoteVid.current)
            remoteVid.current.srcObject = remoteStreamRef.current;

        localStreamRef.current
            ?.getTracks()
            .forEach((t) => {
                console.log("Patient adding local track:", t.kind);
                peerRef.current?.addTrack(t, localStreamRef.current!);
            });

        peerRef.current.onicecandidate = (e) => {
            if (e.candidate && socket) {
                console.log("Patient sending ICE candidate");
                socket.emit("sendIceCandidateToSignalingServer", {
                    iceCandidate: e.candidate,
                    iceUserName: userNameRef.current,
                    didIOffer: didOfferRef.current, // Use ref
                });
            }
        };

        peerRef.current.ontrack = (e) => {
            console.log("Patient received track:", e.track.kind);
            if (e.streams && e.streams[0]) {
                e.streams[0]
                    .getTracks()
                    .forEach((t) => remoteStreamRef.current?.addTrack(t));
            }
        };

        peerRef.current.onconnectionstatechange = () => {
            const s = peerRef.current?.connectionState;
            console.log("Patient connection state:", s);
            if (s === "connected") {
                setIsInCall(true);
                setWaiting(false);
            }
            if (s === "disconnected" || s === "failed") {
                setIsInCall(false);
            }
        };

        if (offerObj && offerObj.offer) {
            console.log("Patient setting remote description");
            await peerRef.current.setRemoteDescription(offerObj.offer);
        }
    };

    const callPeer = async () => {
        console.log("Patient initiating call");
        setWaiting(true);
        try {
            await fetchMedia();
            await createPeer();
            const offer = await peerRef.current!.createOffer();
            await peerRef.current!.setLocalDescription(offer);
            didOfferRef.current = true; // Set BEFORE emitting
            socket?.emit("newOffer", offer);
            console.log("Patient offer sent");
        } catch (err) {
            console.error("Patient call error:", err);
            setWaiting(false);
        }
    };

    const answerOffer = async (offerObj: any) => {
        console.log("Patient answering offer");
        setWaiting(true);
        try {
            await fetchMedia();
            await createPeer(offerObj);
            const answer = await peerRef.current!.createAnswer();
            await peerRef.current!.setLocalDescription(answer);
            offerObj.answer = answer;

            // FIXED: Use the helper function
            console.log("Patient sending answer");
            const ics = await emitWithAck("newAnswer", offerObj);
            console.log("Patient received ICE candidates:", ics);

            if (Array.isArray(ics)) {
                ics.forEach((c: any) => peerRef.current?.addIceCandidate(c));
            }

            setWaiting(false);
            setOffers((o) =>
                o.filter((of) => of.offererUserName !== offerObj.offererUserName),
            );
        } catch (err) {
            console.error("Patient answer error:", err);
            setWaiting(false);
        }
    };

    const addAnswer = async (offerObj: any) => {
        try {
            console.log("Patient adding answer");
            await peerRef.current?.setRemoteDescription(offerObj.answer);
            setWaiting(false);
        } catch (err) {
            console.error("Patient addAnswer error:", err);
        }
    };

    const addNewIceCandidate = (c: any) => {
        try {
            if (peerRef.current && c) {
                peerRef.current.addIceCandidate(c);
                console.log("Patient ICE candidate added");
            }
        } catch (err) {
            console.warn("Patient ICE error:", err);
        }
    };

    const hangup = () => {
        console.log("Patient hanging up");
        peerRef.current?.close();
        peerRef.current = null;
        remoteStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        didOfferRef.current = false;
        setWaiting(false);
        setIsInCall(false);
        setConnectionStatus("disconnected");
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const t = localStreamRef.current.getVideoTracks()[0];
            if (t) {
                t.enabled = !t.enabled;
                setIsVideoOn(t.enabled);
            }
        }
    };

    const toggleAudio = () => {
        if (localStreamRef.current) {
            const t = localStreamRef.current.getAudioTracks()[0];
            if (t) {
                t.enabled = !t.enabled;
                setIsAudioOn(t.enabled);
            }
        }
    };

    if (!isAuthenticated)
        return (
            <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
                <Card className="rounded-xl w-100 p-6">
                    <h2 className="text-xl font-semibold text-center">Rejoindre la consultation</h2>
                    <p className="text-center text-sm text-gray-400 mt-2">
                        Entrez vos informations pour que le médecin puisse vous identifier.
                    </p>
                    <div className="mt-4 flex flex-col gap-4">
                        <Input
                            type="text"
                            placeholder="Nom complet"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                        />
                        <Input
                            type="text"
                            placeholder="CIN"
                            value={patientCin}
                            onChange={(e) => setPatientCin(e.target.value)}
                        />
                        <Button
                            onClick={() =>
                                patientName.trim() && patientCin.trim()
                                    ? setIsAuthenticated(true)
                                    : null
                            }
                            className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Airplay width={18} className="mr-2" />
                            Rejoindre
                        </Button>
                    </div>

                </Card>
            </div>
        );

    return (
        <div className="h-screen bg-black flex flex-col relative text-white">
            <video
                ref={remoteVid}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
            />
            <div className="absolute top-4 right-4 w-40 h-28 bg-gray-800 rounded overflow-hidden border border-gray-700">
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

            {/* Incoming Calls */}
            {offers.length > 0 && !isInCall && (
                <div className="absolute top-4 left-4 space-y-2">
                    {offers.map((offer, i) => (
                        <div
                            key={i}
                            className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <UserPlus className="w-5 h-5" />
                                <span className="font-medium">
                                    Le Docteur vous appelle
                                </span>
                                <Button
                                    onClick={() => answerOffer(offer)}
                                >
                                    Répondre
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {waiting && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 px-6 py-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Connecting...</span>
                    </div>
                </div>
            )}

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-gray-950 px-6 py-3 rounded-xl">
                <Button
                    onClick={toggleAudio}
                    className={`p-4 rounded-full`}
                    variant={`${isAudioOn ? "light" : "destructive"}`}
                >
                    {isAudioOn ? <Mic /> : <MicOff />}
                </Button>

                <Button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full`}
                    variant={`${isVideoOn ? "light" : "destructive"}`}
                >
                    {isVideoOn ? <Video /> : <VideoOff />}
                </Button>

                {!isInCall && !waiting ? (
                    <Button onClick={callPeer} className="p-4 rounded-full" variant="primary">
                        <Phone />
                    </Button>
                ) : (
                    <Button onClick={hangup} className="p-4 rounded-full" variant="destructive">
                        <PhoneOff />
                    </Button>
                )}

                <Button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`p-4 rounded-full ${isSpeakerOn ? "bg-gray-700" : "bg-red-600"}`}
                    variant={`${isSpeakerOn ? "light" : "destructive"}`}
                >
                    {isSpeakerOn ? <Volume2 /> : <VolumeX />}
                </Button>
            </div>
        </div >
    );
}