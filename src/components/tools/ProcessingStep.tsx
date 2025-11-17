import { useState, useEffect } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';

interface ProcessingStepProps {
  selectedTool: string; // Not used in code, but kept for props consistency
  onBack: () => void;
  onClose: () => void;
}

export default function ProcessingStep({ onBack, onClose }: ProcessingStepProps) {
  const [processing, setProcessing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setProcessing(false);
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-80 md:border-r min-h-full">
        <div className="flex-1 grow">
          <div className="border-t border-gray-200 p-6 dark:border-gray-900 md:border-none">
            <div className="flex items-center space-x-3">
              <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                {processing ? (
                  <Loader2 className="size-5 text-gray-700 dark:text-gray-300 animate-spin" />
                ) : (
                  <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {processing ? 'Processing' : 'Analysis Complete'}
                </h3>
                <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                  {processing ? 'AI analysis in progress' : 'Results ready'}
                </p>
              </div>
            </div>

            <Divider />

            <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
              {processing 
                ? 'Our AI models are analyzing your medical data. This may take a few moments.'
                : 'Analysis completed successfully. Review the diagnostic findings below.'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-between border-t border-gray-200 p-6 dark:border-gray-900">
          {processing ? (
            <Button variant="secondary" disabled>Processing...</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={onBack}>New Analysis</Button>
              <Button className='w-full' onClick={onClose}>Close</Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6 md:px-6 md:pb-20 md:pt-6">
        {processing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="size-16 text-blue-500 animate-spin mb-6" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">Analyzing Medical Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Please wait while our AI processes your input</p>
            <div className="w-full max-w-md">
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">{progress}% Complete</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="size-6 text-green-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">Diagnostic Results</h3>
            </div>

            <div className="space-y-4">
              <Card className="p-6 dark:bg-gray-950">
                <h4 className="text-sm font-medium mb-3">Primary Finding</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Detection Confidence</span>
                  <span className="text-sm font-medium text-green-600">94.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.7%' }} />
                </div>
              </Card>

              <Card className="p-6 dark:bg-gray-950">
                <h4 className="text-sm font-medium mb-3">Analysis Summary</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  The AI analysis has identified key diagnostic markers consistent with the input data. 
                  Detailed metrics and recommendations are available in the full report.
                </p>
              </Card>

              <Card className="p-6 dark:bg-gray-950">
                <h4 className="text-sm font-medium mb-3">Recommended Actions</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Review findings with qualified medical professional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Consider additional diagnostic testing if indicated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Export report for medical records</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
}