import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';
import { Label } from '@/components/Label';
import { Camera, CheckCircle, MoveRight, Upload } from 'lucide-react';
import CameraConnection from './CameraConnection';
import HeartFailureForm from './HeartFailureForm';

interface InputSelectionStepProps {
  selectedTool: string;
  inputType: string;
  onInputTypeSelect: (type: string) => void;
  onBack: () => void;
  onNext: () => void;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  cameraStatus: string;
  formData: Record<string, string>;
  onFormChange: (field: string, value: string) => void;
  patientId?: string;
}

export default function InputSelectionStep({ patientId, selectedTool, inputType, onInputTypeSelect, onBack, onNext, file, onFileSelect, cameraStatus, formData, onFormChange }: InputSelectionStepProps) {
  const isImageTool = selectedTool === 'derm' || selectedTool === 'oph';
  const isHeartFailure = selectedTool === 'hf';
  const isFileTool = ['ms', 'cxr', 'bta'].includes(selectedTool);

  const isFormValid = () => {
    if (!isHeartFailure) return true;
    const required = ['age', 'sex', 'chestPain', 'restingBP', 'cholesterol', 'fastingBS', 'restingECG', 'maxHR', 'exerciseAngina', 'oldpeak', 'stSlope'];
    return required.every(field => formData[field] !== '' && formData[field] !== null && formData[field] !== undefined);
  };

  const pId = (patientId as any)?.patientId ?? patientId;

  console.log('patientId patientId :', pId);

  return (
    <>
      <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-80 md:border-r min-h-full">
        <div className="flex-1 grow">
          <div className="border-t border-gray-200 p-6 dark:border-gray-900 md:border-none">
            <div className="flex items-center space-x-3">
              <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                <Upload className="size-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">Input Selection</h3>
                <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">Configure data source</p>
              </div>
            </div>

            <Divider />

            <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
              {isImageTool && 'Choose to upload an image or connect to Inayabridge camera for real-time analysis.'}
              {isHeartFailure && 'Enter patient clinical parameters for cardiovascular risk assessment.'}
              {isFileTool && 'Upload medical imaging files or standard images for AI analysis.'}
            </p>

            {inputType && !isHeartFailure && (
              <>
                <h4 className="mt-4 text-sm font-medium">Selected Input</h4>
                <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                  {inputType === 'upload' && 'File upload mode'}
                  {inputType === 'camera' && 'Inayabridge camera connection'}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-between border-t border-gray-200 p-6 dark:border-gray-900">
          <Button variant="secondary" onClick={onBack}>Back</Button>
          <Button
            className='w-full flex flex-row items-center gap-2'
            onClick={onNext}
            disabled={isHeartFailure ? !isFormValid() : (!inputType || (inputType === 'upload' && !file))}
          >
            Next <MoveRight width={18} />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6 md:px-6 md:pb-20 md:pt-6">
        {isHeartFailure ? (
          <HeartFailureForm patientId={pId || ''} />
        ) : (
          <div>
            <Label className="font-medium text-base">Input Method</Label>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {isImageTool ? 'Select your preferred input method' : 'Choose how to provide medical imaging data'}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card
                className={`cursor-pointer p-6 dark:bg-gray-950 hover:dark:bg-gray-900 transition-all duration-300 ${inputType === 'upload' ? 'ring-2 ring-blue-500 dark:bg-gray-900 dark:border-gray-800' : ''
                  }`}
                onClick={() => onInputTypeSelect('upload')}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                    <Upload className="size-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-50">Upload File</span>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {isFileTool ? 'Images or NIfTI files' : 'Import from device'}
                    </p>
                  </div>
                </div>
              </Card>

              {isImageTool && (
                <Card
                  className={`cursor-pointer p-6 dark:bg-gray-950 hover:dark:bg-gray-900 transition-all duration-300 ${inputType === 'camera' ? 'ring-2 ring-blue-500 dark:bg-gray-900 dark:border-gray-800' : ''
                    }`}
                  onClick={() => onInputTypeSelect('camera')}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                      <Camera className="size-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-50">Inayabridge Camera</span>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Connect live camera feed</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {inputType === 'upload' && (
              <div className="mt-6">
                <Label className="font-medium">
                  {isFileTool ? 'Upload Image or NIfTI File (.nii.gz)' : 'Upload Image File'}
                </Label>
                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isFileTool ? 'PNG, JPG, JPEG, or NIfTI (.nii.gz) - max 50MB' : 'PNG, JPG, JPEG (max 10MB)'}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept={isFileTool ? 'image/*,.nii.gz' : 'image/*'}
                      onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
                    />
                  </label>
                  {file && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="size-4 text-green-500" />
                      <span>{file.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {inputType === 'camera' && (
              <CameraConnection status={cameraStatus} />
            )}
          </div>
        )}
      </div>
    </>
  );
}