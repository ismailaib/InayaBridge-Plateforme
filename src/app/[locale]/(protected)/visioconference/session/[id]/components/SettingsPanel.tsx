import { Mic, Camera, Volume2 } from "lucide-react";

interface SettingsPanelProps {
  onTestMicrophone: () => void;
  onTestCamera: () => void;
  onTestSpeakers: () => void;
}

export default function SettingsPanel({
  onTestMicrophone,
  onTestCamera,
  onTestSpeakers,
}: SettingsPanelProps) {
  return (
    <div className="dark:bg-gray-900 bg-gray-100 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onTestMicrophone}
          className="px-3 py-2 bg-[#3b82f6]/80 hover:bg-[#3b82f6] rounded-lg text-sm transition-colors flex items-center gap-2 text-white"
        >
          <Mic className="w-4 h-4" />
          Test Micro
        </button>
        <button
          onClick={onTestCamera}
          className="px-3 py-2 bg-[#3b82f6]/80 hover:bg-[#3b82f6] rounded-lg text-sm transition-colors flex items-center gap-2 text-white"
        >
          <Camera className="w-4 h-4" />
          Test Caméra
        </button>
        <button
          onClick={onTestSpeakers}
          className="px-3 py-2 bg-[#3b82f6]/80 hover:bg-[#3b82f6] rounded-lg text-sm transition-colors flex items-center gap-2 text-white"
        >
          <Volume2 className="w-4 h-4" />
          Test Haut-parleurs
        </button>
      </div>
    </div>
  );
}