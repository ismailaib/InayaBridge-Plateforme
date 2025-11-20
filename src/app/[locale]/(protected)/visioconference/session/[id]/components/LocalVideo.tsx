import { VideoOff } from "lucide-react";
import { RefObject } from "react";

interface LocalVideoProps {
  videoRef: RefObject<HTMLVideoElement>;
  isVideoOn: boolean;
}

export default function LocalVideo({ videoRef, isVideoOn }: LocalVideoProps) {
  return (
    <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
      <video
        ref={videoRef}
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
  );
}