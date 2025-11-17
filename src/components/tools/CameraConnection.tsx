import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

interface CameraConnectionProps {
  status: string;
}

export default function CameraConnection({ status }: CameraConnectionProps) {
  return (
    <div className="mt-6">
      <Card className="p-8 dark:bg-gray-950">
        <div className="flex flex-col items-center text-center gap-4">
          {status === 'connecting' && (
            <>
              <Loader2 className="size-12 text-blue-500 animate-spin" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">Connecting to Inayabridge</h3>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Establishing secure connection with camera device...</p>
              </div>
            </>
          )}
          {status === 'connected' && (
            <>
              <CheckCircle className="size-12 text-green-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">Camera Connected</h3>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Inayabridge camera is ready for capture</p>
              </div>
            </>
          )}
          {status === 'error' && (
            <>
              <AlertCircle className="size-12 text-red-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">Connection Failed</h3>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Unable to connect to Inayabridge camera</p>
              </div>
              <Button variant="secondary">Retry Connection</Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}