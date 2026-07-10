interface WaitingIndicatorProps {
  isWaiting: boolean;
}

export default function WaitingIndicator({ isWaiting }: WaitingIndicatorProps) {
  if (!isWaiting) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 px-6 py-3 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        <span>Waiting for answer...</span>
      </div>
    </div>
  );
}