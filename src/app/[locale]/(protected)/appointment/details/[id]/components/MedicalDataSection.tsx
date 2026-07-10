import { FlowInstanceDto } from '@/api/flow';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import DiagnosticsSuiteModal from '@/components/DiagnosticsSuiteModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { ArrowLeft, ArrowRight, Bot, FileChartPie, FileText } from 'lucide-react';
import { useState } from 'react';
import { Section } from '../../../types/appointmentFlow';
import { formatDate, formatTime } from '../utils/appointmentUtils';
import { AIAnalyse } from './AIAnalyse';
import { SectionDisplay } from './SectionDisplay';
import StatisticsReports from './StatisticsReports';

interface MedicalDataSectionProps {
    flowInstance: FlowInstanceDto | null;
    sections: Section[];
    parsedData: Record<string, any>;
    timeStatus: string;
    onDataUpdate?: () => void;
}



export const MedicalDataSection = ({
    flowInstance,
    sections,
    parsedData,
    timeStatus,
    onDataUpdate,
}: MedicalDataSectionProps) => {
    const [localParsedData, setLocalParsedData] = useState(parsedData);

    const handleDataUpdate = (updatedData: Record<string, any>) => {
        setLocalParsedData(updatedData);
        if (onDataUpdate) {
            onDataUpdate();
        }
    };

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
            const value = localParsedData[field.name];
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
                    <div className='flex flex-row items-center'>
                        {flowInstance.startTime && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Consultation {flowInstance.endTime ? 'réalisée' : 'commencée'} le{' '}
                                {formatDate(flowInstance.startTime)} à {formatTime(flowInstance.startTime)}
                                {flowInstance.endTime && (
                                    <> et terminée à {formatTime(flowInstance.endTime)}</>
                                )}
                            </p>
                        )}
                        <span className="mx-2 text-gray-500">•</span>
                        {timeStatus && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {timeStatus}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2"> 
                    <DiagnosticsSuiteModal patientId={flowInstance.patientId || ''} />
                </div>
            </div>
            <Tabs defaultValue="tab1">
                <TabsList variant="solid">
                    <TabsTrigger value="tab1" className="gap-1.5">
                        <FileText className="w-4 h-4" />
                        Détails du rendez-vous
                    </TabsTrigger>
                    <TabsTrigger value="tab2" className="gap-1.5">
                        <FileChartPie className="w-4 h-4" />
                        Diagnostics & Reports
                    </TabsTrigger>
                    <TabsTrigger value="tab3" className="gap-1.5">
                        <Bot className="w-4 h-4" />
                        Analyse AI
                    </TabsTrigger>
                </TabsList>
                <div className="mt-4">
                    <TabsContent value="tab1">
                        {hasAnyData ? (
                            sections.length > 0 ? (
                                <MedicalDataCarousel
                                    sections={sections}
                                    parsedData={localParsedData}
                                    flowInstanceId={flowInstance.id}
                                    onDataUpdate={handleDataUpdate}
                                />
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
                    </TabsContent>
                    <TabsContent value="tab2">
                        <StatisticsReports />
                    </TabsContent>
                    <TabsContent value="tab3">
                        <AIAnalyse />
                    </TabsContent>
                </div>
            </Tabs>
        </>
    );
};

const MedicalDataCarousel = ({
    sections,
    parsedData,
    flowInstanceId,
    onDataUpdate
}: {
    sections: Section[];
    parsedData: Record<string, any>;
    flowInstanceId: string;
    onDataUpdate: (updatedData: Record<string, any>) => void;
}) => {
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
                allData={parsedData}
                index={0}
                flowInstanceId={flowInstanceId}
                onDataUpdate={onDataUpdate}
            />
        </div>
    );
};