import { UserPlus } from "lucide-react";

interface Offer {
  offererUserName: string;
  offer: any;
}

interface IncomingCallsProps {
  offers: Offer[];
  isInCall: boolean;
  onAnswerOffer: (offer: Offer) => void;
}

export default function IncomingCalls({
  offers,
  isInCall,
  onAnswerOffer,
}: IncomingCallsProps) {
  if (offers.length === 0 || isInCall) return null;

  return (
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
              onClick={() => onAnswerOffer(offer)}
              className="ml-auto px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Answer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}