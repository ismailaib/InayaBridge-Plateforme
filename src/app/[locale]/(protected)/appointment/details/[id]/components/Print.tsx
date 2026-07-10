'use client'

import { getAppointmentById, type Appointment } from '@/api/appointments'
import { getEmployees, type Employee } from '@/api/employees'
import { getFlowInstanceByAppointment, getTemplateById } from '@/api/flow'
import { getPatientById, type TenantPatient } from '@/api/patients'
import { Button } from '@/components/Button'
import html2pdf from 'html2pdf.js'
import { Loader2, Printer, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PrintData {
  appointment: Appointment
  patient: TenantPatient
  doctor: Employee | undefined
  sections: Array<{
    title: string
    fields: Array<{
      name: string
      label: string
      type?: string
    }>
  }>
  parsedMedicalData: Record<string, any>
}

export default function Print({
  appointmentId,
  tenantId
}: {
  appointmentId: string
  tenantId: string
}) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PrintData | null>(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch appointment
      const appointmentRes = await getAppointmentById(appointmentId)
      const appointment = appointmentRes.data

      // Fetch patient
      const patientRes = await getPatientById(appointment.patientProfileId)
      const patient = patientRes.data

      // Fetch employees to get doctor info
      const employeesRes = await getEmployees(tenantId)
      const employees = employeesRes.data
      const doctor = employees.find(e => e.doctorId === appointment.doctorProfileId)

      // Fetch flow instance and template
      let sections: PrintData['sections'] = []
      let parsedMedicalData: Record<string, any> = {}

      try {
        const flowRes = await getFlowInstanceByAppointment(appointmentId)
        const flow = flowRes.data

        if (flow?.templateId) {
          const templateRes = await getTemplateById(flow.templateId)
          const template = templateRes.data

          if (template.schema) {
            const parsedSchema = JSON.parse(template.schema)
            sections = parsedSchema.sections || []
          }

          if (flow.data) {
            parsedMedicalData = JSON.parse(flow.data)
          }
        }
      } catch (flowError) {
        // Flow data is optional, continue without it
        console.warn('No flow data available for this appointment')
      }

      setData({ appointment, patient, doctor, sections, parsedMedicalData })
    } catch (err) {
      console.error('Error fetching print data:', err)
      setError('Impossible de charger les données. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchData()
    }
  }, [open])

  const handlePrint = () => {
    const element = document.querySelector('.print-container')
    if (element) {
      html2pdf()
        .set({
          margin: 1,
          filename: 'compte-rendu-consultation.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
          jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
        })
        //@ts-ignore
        .from(element)
        .save()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString // Already in HH:mm format
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmé',
      CANCELLED: 'Annulé',
      COMPLETED: 'Terminé',
      IN_PROGRESS: 'En cours',
      ARRIVED: 'Arrivé'
    }
    return labels[status] || status
  }

  const getConsultationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      LOCAL: 'Sur place',
      IN_PERSON: 'En personne',
      VIDEO: 'Visioconférence'
    }
    return labels[type] || type
  }

  const appointmentUrl = `${window.location.origin}/appointment/details/${appointmentId}`

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Printer className="w-4 h-4 mr-2" />
        Imprimer
      </Button>

      {open && (
        <div className="fixed inset-0 dark:bg-gray-900 z-50 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Chargement des données...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-screen p-8">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={() => setOpen(false)}>Fermer</Button>
            </div>
          ) : data ? (
            <div className="min-h-screen bg-white">
              {/* Print Styles */}
              <style jsx global>{`
                @media print {
                  .no-print {
                    display: none !important;
                  }
                  @page {
                    margin: 1cm;
                    size: A4;
                  }
                  body {
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                  }
                  /* Compact print layout */
                  .print-container {
                    padding: 0.5cm !important;
                    font-size: 9pt !important;
                  }
                  .print-title {
                    font-size: 16pt !important;
                    margin-bottom: 0.3cm !important;
                  }
                  .print-section {
                    margin-bottom: 0.4cm !important;
                    padding: 0.3cm !important;
                    page-break-inside: avoid;
                  }
                  .print-section-title {
                    font-size: 11pt !important;
                    margin-bottom: 0.2cm !important;
                  }
                  .print-grid {
                    gap: 0.2cm !important;
                  }
                  .print-label {
                    font-size: 8pt !important;
                    margin-bottom: 0.05cm !important;
                  }
                  .print-value {
                    font-size: 9pt !important;
                  }
                  .print-table td {
                    padding: 0.15cm !important;
                    font-size: 8pt !important;
                  }
                  .print-medical-section {
                    margin-bottom: 0.3cm !important;
                  }
                  .print-medical-title {
                    padding: 0.15cm 0.3cm !important;
                    font-size: 10pt !important;
                    margin-bottom: 0.15cm !important;
                  }
                  .print-notes {
                    padding: 0.3cm !important;
                    font-size: 8pt !important;
                  }
                  .print-footer {
                    margin-top: 0.4cm !important;
                    padding-top: 0.3cm !important;
                    font-size: 7pt !important;
                  }
                  .page-break-before {
                    page-break-before: always !important;
                  }
                }
              `}</style>

              {/* Toolbar - Hidden on print */}
              <div className="no-print sticky top-0 bg-white border-b shadow-sm z-10">
                <div className="max-w-5xl mx-auto px-8 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Aperçu avant impression</h2>
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Fermer
                    </Button>
                    <Button onClick={handlePrint} variant="primary">
                      <Printer className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </Button>
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div className="max-w-5xl mx-auto px-8 py-12 print-container">
                {/* Header */}
                <div className="text-center mb-12 print-title">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Compte Rendu de Consultation
                  </h1>
                  <p className="text-gray-600">
                    Document généré le {formatDate(new Date().toISOString())}
                  </p>
                </div>

                {/* Patient Information */}
                <div className="mb-8 print-section">
                  <div className="bg-gray-50 border-l-4 border-blue-600 p-6 rounded-r">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 print-section-title">
                      Informations du Patient
                    </h2>
                    <div className="grid grid-cols-2 gap-4 print-grid">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 print-label">Nom complet</p>
                        <p className="font-medium text-gray-900 print-value">
                          {data.patient.firstName} {data.patient.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 print-label">CIN</p>
                        <p className="font-medium text-gray-900 print-value">{data.patient.cin}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 print-label">Téléphone</p>
                        <p className="font-medium text-gray-900 print-value">
                          {data.patient.phone || 'Non renseigné'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 print-label">Email</p>
                        <p className="font-medium text-gray-900 print-value">
                          {data.patient.email || 'Non renseigné'}
                        </p>
                      </div>
                      {data.patient.dateOfBirth && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1 print-label">Date de naissance</p>
                          <p className="font-medium text-gray-900 print-value">
                            {formatDate(data.patient.dateOfBirth)}
                          </p>
                        </div>
                      )}
                      {data.patient.address && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600 mb-1 print-label">Adresse</p>
                          <p className="font-medium text-gray-900 print-value">{data.patient.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Doctor Information */}
                {data.doctor && (
                  <div className="mb-8 print-section">
                    <div className="bg-gray-50 border-l-4 border-green-600 p-6 rounded-r">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 print-section-title">
                        Médecin Traitant
                      </h2>
                      <div className="grid grid-cols-2 gap-4 print-grid">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 print-label">Nom</p>
                          <p className="font-medium text-gray-900 print-value">
                            Dr. {data.doctor.firstName} {data.doctor.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1 print-label">Email</p>
                          <p className="font-medium text-gray-900 print-value">
                            {data.doctor.email || 'Non renseigné'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appointment Details */}
                <div className="mb-8 print-section">
                  <div className="bg-gray-50 border-l-4 border-purple-600 p-6 rounded-r">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 print-section-title">
                      Détails du Rendez-vous
                    </h2>
                    <div className="grid grid-cols-2 gap-4 print-grid">
                      <div>
                        <p className="text-sm text-gray-600 mb-1 print-label">Date</p>
                        <p className="font-medium text-gray-900 print-value">
                          {formatDate(data.appointment.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 print-label">Horaire</p>
                        <p className="font-medium text-gray-900 print-value">
                          {formatTime(data.appointment.startTime)}
                          {data.appointment.endTime && ` - ${formatTime(data.appointment.endTime)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 print-label">Statut</p>
                        <p className="font-medium text-gray-900 print-value">
                          {getStatusLabel(data.appointment.status)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1 print-label">Type de consultation</p>
                        <p className="font-medium text-gray-900 print-value">
                          {getConsultationTypeLabel(data.appointment.consultationType)}
                        </p>
                      </div>
                      {data.appointment.motif && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600 mb-1 print-label">Motif de consultation</p>
                          <p className="font-medium text-gray-900 print-value">{data.appointment.motif}</p>
                        </div>
                      )}
                      {data.appointment.location && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600 mb-1 print-label">Lieu</p>
                          <p className="font-medium text-gray-900 print-value">{data.appointment.location}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Medical Data */}
                {data.sections.length > 0 && (
                  <div className="mb-8 page-break-before">
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b-2  print-section-title">
                      Données Médicales
                    </h2>
                    {data.sections.slice(1).map((section, idx) => (
                      <div key={idx} className="mb-6 print-medical-section">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gray-100 px-4 py-2 rounded print-medical-title">
                          {section.title}
                        </h3>
                        <table className="w-full border-collapse border border-gray-300 print-table">
                          <tbody>
                            {section.fields.map((field, fieldIdx) => {
                              const value = data.parsedMedicalData[field.name]
                              return (
                                <tr key={fieldIdx} className="border-b border-gray-300">
                                  <td className="p-3 bg-gray-50 font-medium text-gray-700 w-2/5 border-r border-gray-300">
                                    {field.label}
                                  </td>
                                  <td className="p-3 text-gray-900">
                                    {value !== undefined && value !== null && value !== ''
                                      ? String(value)
                                      : '—'}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes and Summary */}
                {data.appointment.notes && (
                  <div className="mb-8 print-section">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300 print-section-title">
                      Notes et Observations
                    </h2>
                    <div className="bg-gray-50 p-6 rounded border border-gray-200 print-notes">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {data.appointment.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-8 border-t-2 border-gray-300 print-footer">
                  <div className="flex justify-between items-end text-sm text-gray-600">
                    <div>
                      <p>Document confidentiel</p>
                      <p>À usage médical uniquement</p>
                    </div>
                    {data.doctor && (
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">Signature du médecin</p>
                        <div className="mt-8 border-t border-gray-400 pt-2">
                          Dr. {data.doctor.firstName} {data.doctor.lastName}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  )
}