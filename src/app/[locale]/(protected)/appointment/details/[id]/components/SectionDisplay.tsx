// src/app/appointments/[id]/components/SectionDisplay.tsx
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';
import { Section } from '../types';
import FormField from '../../../flow/[id]/components/FormField';

interface SectionDisplayProps {
    section: Section;
    data: Record<string, any>;
    index?: number;
}

export const SectionDisplay = ({ section, data, index = 0 }: SectionDisplayProps) => {
    const hasData = section.fields.some(field => {
        const value = data[field.name];
        return value !== undefined && value !== null && value !== '';
    });

    if (!hasData) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 0.5 , ease: 'easeInOut'}}
            exit={{ opacity: 0 }}
        >
            <Card className='rounded-t-none border-t-0'>
                <div className="mt-4 space-y-4">
                    {section.fields.map((field) => (
                        <FormField
                            key={field.name}
                            field={field}
                            value={data[field.name]}
                            onChange={() => {}}
                            isCompleted={true}
                        />
                    ))}
                </div>
            </Card>
        </motion.div>
    );
};