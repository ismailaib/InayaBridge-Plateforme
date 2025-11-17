import { Brain, Scan, Activity, FileScan, MoveRight, Goal, View, Target, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import {
  Dialog,
  DialogClose,
  DialogContent,
} from '@/components/Dialog';
import { Divider } from '@/components/Divider';
import { Label } from '@/components/Label';
import { useState } from 'react';
import Image from 'next/image';

interface ToolSelectionStepProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onNext: () => void;
}

export default function ToolSelectionStep({ selectedTool, onToolSelect, onNext }: ToolSelectionStepProps) {
  const [shownImage, setShownImage] = useState<string | null>(null);

  // const openImage = (toolValue: string) => {
  //   setShownImage(toolValue);
  // };

  const aiTools = [
    {
      value: 'derm',
      label: 'Dermatology AI',
      icon: Goal,
      short: 'Real-time skin disease analysis',
      desc: 'Advanced dermatological assessment using deep learning algorithms to detect and classify skin conditions from uploaded photos or live camera feeds with high accuracy and confidence scoring.',
      image: '/images/tool-derm.png'
    },
    {
      value: 'oph',
      label: 'Ophthalmology AI',
      icon: View,
      short: 'Comprehensive eye disease detection',
      desc: 'Automated analysis of fundus and anterior segment imagery to identify cataracts, glaucoma indicators, diabetic retinopathy, and other ocular pathologies with clinical-grade precision.',
      image: '/images/tool-oph.png'
    },
    {
      value: 'glaucoma',
      label: 'Glaucoma Detection',
      icon: Target,
      short: 'Automated glaucoma screening',
      desc: 'Utilizes deep learning to analyze retinal fundus images for early signs of glaucoma, assessing the optic nerve head and surrounding structures to provide a risk score.',
      image: '/images/tool-oph.png'
    },
    {
      value: 'hf',
      label: 'Heart Failure Prediction',
      icon: Activity,
      short: 'Cardiovascular risk assessment',
      desc: 'Predictive analytics engine that evaluates patient clinical parameters to calculate heart failure probability, enabling proactive intervention and informed treatment decisions.',
      image: '/images/tool-hf.png'
    },
    {
      value: 'ms',
      label: 'FLAMeS MS Segmentation',
      icon: FileScan,
      short: 'Multiple sclerosis lesion mapping',
      desc: 'State-of-the-art segmentation of MS lesions from FLAIR MRI sequences, providing quantitative metrics for disease progression monitoring and treatment response evaluation.',
      image: '/images/tool-ms.png'
    },
    {
      value: 'cxr',
      label: 'Chest X-ray HybridGNet',
      icon: Scan,
      short: 'Thoracic pathology detection',
      desc: 'Hybrid deep learning architecture for automated detection and segmentation of pulmonary abnormalities in chest radiographs, accelerating diagnostic workflow and clinical decision-making.',
      image: '/images/tool-cxr.png'
    },
    {
      value: 'bta',
      label: 'Brain Tumor Analysis',
      icon: Brain,
      short: 'Neuro-oncological imaging analysis',
      desc: 'Comprehensive brain tumor detection and segmentation from MRI scans, generating detailed volumetric measurements, tumor classification, and prognostic indicators for treatment planning.',
      image: '/images/tool-bta.png'
    }
  ];

  const active = aiTools.find(t => t.value === selectedTool);
  const activeImage = shownImage ? aiTools.find(t => t.value === shownImage) : null;

  return (
    <div className="flex h-full w-full flex-col-reverse md:flex-row">
      <div className="flex flex-col justify-between border-gray-200 dark:border-gray-900 md:w-80 md:border-r min-h-full">
        <div className="flex-1 grow overflow-y-auto">
          <div className="border-t border-gray-200 p-6 dark:border-gray-900 md:border-none">
            <div className="flex items-center space-x-3">
              <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 15h4" />
                  <path d="m14.817 10.995-.971-1.45 1.034-1.232a2 2 0 0 0-2.025-3.238l-1.82.364L9.91 3.885a2 2 0 0 0-3.625.748L6.141 6.55l-1.725.426a2 2 0 0 0-.19 3.756l.657.27" />
                  <path d="m18.822 10.995 2.26-5.38a1 1 0 0 0-.557-1.318L16.954 2.9a1 1 0 0 0-1.281.533l-.924 2.122" />
                  <path d="M4 12.006A1 1 0 0 1 4.994 11H19a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">AI Diagnostics Suite</h3>
                <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">Medical imaging intelligence</p>
              </div>
            </div>

            <Divider />

            <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
              Select from our suite of specialized AI diagnostic tools for advanced medical image analysis and clinical predictions.
            </p>

            {active && (
              <>
                <h4 className="mt-4 text-sm font-medium">Description</h4>
                <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
                  {active.desc}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-between border-t border-gray-200 p-6 dark:border-gray-900">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            className='w-full flex flex-row items-center gap-2'
            onClick={onNext}
            disabled={!selectedTool}
          >
            Next <MoveRight width={18} />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6 md:px-6 md:pb-20 md:pt-6 overflow-y-auto">
        <div>
          <Label className="font-medium text-base">Select Diagnostic Tool</Label>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Choose the AI analysis module for your diagnostic needs</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-1">
            {aiTools.map((tool) => (
              <Card
                key={tool.value}
                className={`p-4 dark:bg-gray-950 hover:dark:bg-gray-900 transition-all duration-300 cursor-pointer ${selectedTool === tool.value ? 'ring-2 ring-blue-500 dark:bg-gray-900 dark:border-gray-800' : ''
                  }`}
                onClick={() => onToolSelect(tool.value)}
              >
                <div className="flex items-start gap-3">
                  <div className="inline-flex shrink-0 items-center justify-center rounded bg-gray-100 p-3 dark:bg-gray-800">
                    <tool.icon className="size-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-50">{tool.label}</span>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{tool.short}</p>
                  </div>
                  {/* <button className="p-1">
                    <HelpCircle className="size-5 text-gray-500" />
                  </button> */}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {activeImage && (
        <Dialog open={!!shownImage} onOpenChange={() => setShownImage(null)}>
          <DialogContent className="p-0 sm:max-w-5xl max-h-[90vh] overflow-hidden">
            <div className=" flex items-center justify-center relative w-full h-[80vh]">
              <Image
                src={activeImage.image}
                alt={activeImage.label}
                width={325}
                height={325}
                className="object-contain"
              />
            </div>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <Button variant="ghost">
                <X width={18} />
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}