'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog';
import ToolSelectionStep from './tools/ToolSelectionStep';
import InputSelectionStep from './tools/InputSelectionStep';
import ProcessingStep from './tools/ProcessingStep';
import { X } from 'lucide-react';

export default function DiagnosticsSuiteModal() {
  const [step, setStep] = useState(1);
  const [selectedTool, setSelectedTool] = useState('');
  const [inputType, setInputType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [cameraStatus, setCameraStatus] = useState('connecting');
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    chestPain: '',
    restingBP: '',
    cholesterol: '',
    fastingBS: '',
    restingECG: '',
    maxHR: '',
    exerciseAngina: '',
    oldpeak: '',
    stSlope: ''
  });

  const handleInputTypeSelect = (type: string) => {
    setInputType(type);
    if (type === 'camera') {
      setCameraStatus('connecting');
      setTimeout(() => setCameraStatus('connected'), 2000);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setStep(1);
    setSelectedTool('');
    setInputType('');
    setFile(null);
    setCameraStatus('connecting');
    setFormData({
      age: '',
      sex: '',
      chestPain: '',
      restingBP: '',
      cholesterol: '',
      fastingBS: '',
      restingECG: '',
      maxHR: '',
      exerciseAngina: '',
      oldpeak: '',
      stSlope: ''
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='secondary' className='flex flex-row items-center gap-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 15h4" />
            <path d="m14.817 10.995-.971-1.45 1.034-1.232a2 2 0 0 0-2.025-3.238l-1.82.364L9.91 3.885a2 2 0 0 0-3.625.748L6.141 6.55l-1.725.426a2 2 0 0 0-.19 3.756l.657.27" />
            <path d="m18.822 10.995 2.26-5.38a1 1 0 0 0-.557-1.318L16.954 2.9a1 1 0 0 0-1.281.533l-.924 2.122" />
            <path d="M4 12.006A1 1 0 0 1 4.994 11H19a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
          </svg>
          Diagnostics Suite
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-5xl min-h-[90vh] flex flex-col">
        <DialogClose asChild>
          <Button
            className="absolute right-3 top-3 !text-gray-400 hover:text-gray-500 dark:!text-gray-600 hover:dark:text-gray-500 z-50"
            variant="ghost"
            onClick={handleReset}
          >
            <X width={18} />
          </Button>
        </DialogClose>

        <DialogHeader className="border-b border-gray-200 px-6 py-4 pb-6 dark:border-gray-900">
          <DialogTitle className="text-base">
            Diagnostics Suite
            <span className="ml-3 text-xs font-normal text-gray-500">
              Step {step} of 3
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col-reverse md:flex-row overflow-auto">
          {step === 1 && (
            <ToolSelectionStep
              selectedTool={selectedTool}
              onToolSelect={setSelectedTool}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <InputSelectionStep
              selectedTool={selectedTool}
              inputType={inputType}
              onInputTypeSelect={handleInputTypeSelect}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
              file={file}
              onFileSelect={setFile}
              cameraStatus={cameraStatus}
              formData={formData}
              onFormChange={handleFormChange}
            />
          )}

          {step === 3 && (
            <ProcessingStep
              selectedTool={selectedTool}
              onBack={handleReset}
              onClose={handleReset}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}