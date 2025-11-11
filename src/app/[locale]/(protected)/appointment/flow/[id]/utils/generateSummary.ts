import { appointmentFlowSchema } from '../schema/appointmentFlowSchema';

export function generateSummary(formData: Record<string, any>): string {
  let summary = 'Appointment Summary:\n\n';

  appointmentFlowSchema.forEach((step) => {
    summary += `${step.title}:\n`;
    step.sections.forEach((section: { title: any; fields: any[]; }) => {
      summary += `  ${section.title}:\n`;
      section.fields.forEach((field) => {
        const value = formData[field.name];
        if (value !== undefined && value !== '') {
          summary += `    ${field.label}: ${value}\n`;
        }
      });
    });
    summary += '\n';
  });

  return summary;
}