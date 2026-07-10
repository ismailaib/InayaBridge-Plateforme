import { Settings, Copy, MoreVertical } from "lucide-react";

interface VideoCallHeaderProps {
  connectionStatus: string;
  showSettings: boolean;
  onToggleSettings: () => void;
  sessionId: string | string[];
  showCopySuccess: boolean;
  onCopyLink: () => void;
}

export default function VideoCallHeader({
  connectionStatus,
  showSettings,
  onToggleSettings,
  sessionId,
  showCopySuccess,
  onCopyLink,
}: VideoCallHeaderProps) {
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
    <div className="dark:bg-gray-900 bg-white dark:text-white text-gray-800 px-4 py-3 flex items-center justify-between border-b dark:border-gray-700 border-gray-300">
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
          onClick={onToggleSettings}
          className="p-2 dark:hover:bg-gray-700 hover:bg-gray-300 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={onCopyLink}
          className="p-2 dark:hover:bg-gray-700 hover:bg-gray-300 rounded-lg transition-colors relative"
          title="Copier le lien"
        >
          {showCopySuccess ? (
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
        <button className="p-2 dark:hover:bg-gray-700 hover:bg-gray-300 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}