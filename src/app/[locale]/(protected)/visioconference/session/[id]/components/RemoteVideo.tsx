import { RefObject } from "react";

interface RemoteVideoProps {
  videoRef: RefObject<HTMLVideoElement>;
}

export default function RemoteVideo({ videoRef }: RemoteVideoProps) {
  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      autoPlay
      playsInline
    />
  );
}