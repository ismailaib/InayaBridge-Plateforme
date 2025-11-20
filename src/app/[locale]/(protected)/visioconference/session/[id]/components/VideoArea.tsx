import { RefObject } from "react";
import RemoteVideo from "./RemoteVideo";
import LocalVideo from "./LocalVideo";
import WaitingIndicator from "./WaitingIndicator";
import IncomingCalls from "./IncomingCalls";

interface Offer {
  offererUserName: string;
  offer: any;
}

interface VideoAreaProps {
  remoteVideoRef: RefObject<HTMLVideoElement>;
  localVideoRef: RefObject<HTMLVideoElement>;
  isVideoOn: boolean;
  waiting: boolean;
  offers: Offer[];
  isInCall: boolean;
  onAnswerOffer: (offer: Offer) => void;
}

export default function VideoArea({
  remoteVideoRef,
  localVideoRef,
  isVideoOn,
  waiting,
  offers,
  isInCall,
  onAnswerOffer,
}: VideoAreaProps) {
  return (
    <div className="flex-1 relative bg-black">
      {/* Remote Video (Main) */}
      <RemoteVideo videoRef={remoteVideoRef} />

      {/* Local Video (Picture-in-Picture) */}
      <LocalVideo videoRef={localVideoRef} isVideoOn={isVideoOn} />

      {/* Status Messages */}
      <WaitingIndicator isWaiting={waiting} />

      {/* Incoming Calls */}
      <IncomingCalls
        offers={offers}
        isInCall={isInCall}
        onAnswerOffer={onAnswerOffer}
      />
    </div>
  );
}