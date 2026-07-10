"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import VideoCallHeader from "./components/VideoCallHeader";
import SettingsPanel from "./components/SettingsPanel";
import VideoArea from "./components/VideoArea";
import ControlBar from "./components/ControlBar";
import { useWebRTC } from "./components/useWebRTC";
import { testMicrophone, testCamera, testSpeakers } from "./components/DeviceTests";

export default function VideoCall() {
  const { id } = useParams();
  const [showSettings, setShowSettings] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const {
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
  } = useWebRTC(id);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(
      `http://localhost:3000/patient/visioconference/session/${id}`,
    );
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  return (
    <div className="h-screen dark:bg-gray-900 bg-white dark:text-white text-gray-800 flex flex-col">
      {/* Header */}
      <VideoCallHeader
        connectionStatus={connectionStatus}
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(!showSettings)}
        sessionId={id}
        showCopySuccess={showCopySuccess}
        onCopyLink={handleCopyLink}
      />

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          onTestMicrophone={testMicrophone}
          onTestCamera={testCamera}
          onTestSpeakers={testSpeakers}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Area */}
        <VideoArea
          remoteVideoRef={remoteVid as React.RefObject<HTMLVideoElement>}
          localVideoRef={localVid as React.RefObject<HTMLVideoElement>}
          isVideoOn={isVideoOn}
          waiting={waiting}
          offers={offers}
          isInCall={isInCall}
          onAnswerOffer={answerOffer}
        />

        {/* Control Bar */}
        <ControlBar
          isAudioOn={isAudioOn}
          isVideoOn={isVideoOn}
          isSpeakerOn={isSpeakerOn}
          isInCall={isInCall}
          waiting={waiting}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onToggleSpeaker={toggleSpeaker}
          onCallPeer={callPeer}
          onHangup={hangup}
        />
      </div>
    </div>
  );
}