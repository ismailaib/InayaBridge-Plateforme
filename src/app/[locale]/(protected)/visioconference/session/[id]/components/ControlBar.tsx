import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Share,
  Phone,
  PhoneOff,
  Monitor,
} from "lucide-react";

interface ControlBarProps {
  isAudioOn: boolean;
  isVideoOn: boolean;
  isSpeakerOn: boolean;
  isInCall: boolean;
  waiting: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleSpeaker: () => void;
  onCallPeer: () => void;
  onHangup: () => void;
}

export default function ControlBar({
  isAudioOn,
  isVideoOn,
  isSpeakerOn,
  isInCall,
  waiting,
  onToggleAudio,
  onToggleVideo,
  onToggleSpeaker,
  onCallPeer,
  onHangup,
}: ControlBarProps) {
  return (
    <div className="absolute left-[56.5%] bottom-8 -translate-x-1/2 z-20 rounded-xl dark:bg-gray-950 bg-gray-100 px-6 py-4 flex items-center justify-center gap-4 border-t dark:border-gray-800 border-gray-400 shadow-lg">
      <button
        onClick={onToggleAudio}
        className={`p-3 rounded-full transition-colors ${
          isAudioOn
            ? "bg-gray-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
        }`}
        title={isAudioOn ? "Couper le micro" : "Activer le micro"}
      >
        {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>

      <button
        onClick={onToggleVideo}
        className={`p-3 rounded-full transition-colors ${
          isVideoOn
            ? "bg-gray-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
        }`}
        title={isVideoOn ? "Couper la vidéo" : "Activer la vidéo"}
      >
        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
      </button>

      <button
        onClick={onToggleSpeaker}
        className={`p-3 rounded-full transition-colors ${
          isSpeakerOn
            ? "bg-gray-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            : "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
        }`}
        title={isSpeakerOn ? "Couper le son" : "Activer le son"}
      >
        {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      <button
        className="p-3 bg-gray-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
        title="Partager l'écran"
      >
        <Share className="w-5 h-5" />
      </button>

      {!isInCall && !waiting ? (
        <button
          onClick={onCallPeer}
          className="p-4 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-full transition-colors"
          title="Démarrer l'appel"
        >
          <Phone className="w-6 h-6" />
        </button>
      ) : isInCall || waiting ? (
        <button
          onClick={onHangup}
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

      <button
        className="p-3 bg-gray-300 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
        title="Plus d'options"
      >
        <Monitor className="w-5 h-5" />
      </button>
    </div>
  );
}