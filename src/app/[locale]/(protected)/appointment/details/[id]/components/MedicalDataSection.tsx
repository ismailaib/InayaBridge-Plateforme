// src/app/appointments/[id]/components/MedicalDataSection.tsx
import { FlowInstanceDto } from '@/api/flow';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';
import { ArrowLeft, ArrowRight, Bot, FileText, Printer } from 'lucide-react';
import { useState } from 'react';
import { Section } from '../../../types/appointmentFlow';
import { formatDate, formatTime } from '../utils/appointmentUtils';
import { SectionDisplay } from './SectionDisplay';
import { Button } from '@/components/Button';

interface MedicalDataSectionProps {
    flowInstance: FlowInstanceDto | null;
    sections: Section[];
    parsedData: Record<string, any>;
}

export const MedicalDataSection = ({
    flowInstance,
    sections,
    parsedData
}: MedicalDataSectionProps) => {
    if (!flowInstance) {
        return (
            <Card>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                        Aucun formulaire médical
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                        Aucun formulaire n&apos;a été associé à ce rendez-vous.
                    </p>
                </div>
            </Card>
        );
    }

    const hasAnyData = sections.some((section: Section) =>
        section.fields.some((field: { name: string | number; }) => {
            const value = parsedData[field.name];
            return value !== undefined && value !== null && value !== '';
        })
    );

    return (
        <>
            <div className="mb-6 flex flex-row items-center justify-between">
                <div className='flex flex-col'>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        Données médicales
                    </h2>
                    {flowInstance.startTime && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Consultation {flowInstance.endTime ? 'réalisée' : 'commencée'} le{' '}
                            {formatDate(flowInstance.startTime)} à {formatTime(flowInstance.startTime)}
                            {flowInstance.endTime && (
                                <> et terminée à {formatTime(flowInstance.endTime)}</>
                            )}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary">
                        <Bot className="w-4 h-4 mr-2" />
                        Analyse AI
                    </Button>
                    <Button variant="secondary" className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-tool-case-icon lucide-tool-case"><path d="M10 15h4" /><path d="m14.817 10.995-.971-1.45 1.034-1.232a2 2 0 0 0-2.025-3.238l-1.82.364L9.91 3.885a2 2 0 0 0-3.625.748L6.141 6.55l-1.725.426a2 2 0 0 0-.19 3.756l.657.27" /><path d="m18.822 10.995 2.26-5.38a1 1 0 0 0-.557-1.318L16.954 2.9a1 1 0 0 0-1.281.533l-.924 2.122" /><path d="M4 12.006A1 1 0 0 1 4.994 11H19a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /></svg>
                        Diagnostics Suite
                    </Button>
                </div>

            </div>

            {hasAnyData ? (
                sections.length > 0 ? (
                    <MedicalDataCarousel sections={sections} parsedData={parsedData} />
                ) : null
            ) : (
                <Card>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                            Aucune donnée médicale
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                            Aucune information n&apos;a été enregistrée pour cette consultation.
                        </p>
                    </div>
                </Card>
            )}
        </>
    );
};

const MedicalDataCarousel = ({ sections, parsedData }: { sections: Section[]; parsedData: Record<string, any> }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? sections.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === sections.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="relative">
            <Card className="flex items-center justify-between rounded-b-none">
                <Button
                    onClick={handlePrev}
                    variant="light"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </Button>
                <Button variant="light" className="text-md font-semibold text-gray-900 dark:text-gray-100">
                    {sections[currentIndex].title}
                </Button>
                <Button
                    onClick={handleNext}
                    variant="light"
                >
                    <ArrowRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </Button>
            </Card>
            <SectionDisplay
                key={sections[currentIndex].title}
                section={sections[currentIndex]}
                data={parsedData}
                index={0}
            />
        </div>
    );
};