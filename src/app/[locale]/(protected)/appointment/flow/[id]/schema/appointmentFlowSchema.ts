import { Step } from "../../../types/appointmentFlow";

export const appointmentFlowSchema: Step[] = [
  {
    id: "complaints",
    title: "Complaints",
    description: "Details about the patient's current complaints",
    sections: [
      {
        title: "Chief Complaint",
        fields: [
          {
            name: "chiefComplaint",
            label: "Chief Complaint",
            type: "textarea",
            placeholder: "Describe the main issue...",
          },
          { name: "onsetDate", label: "Onset Date", type: "date" },
          {
            name: "duration",
            label: "Duration",
            type: "text",
            placeholder: "e.g., 3 days",
          },
          { name: "painLocation", label: "Pain Location", type: "text" },
          {
            name: "painSeverity",
            label: "Pain Severity",
            type: "number",
            min: 1,
            max: 10,
          },
          {
            name: "associatedSymptoms",
            label: "Associated Symptoms",
            type: "textarea",
            placeholder: "Comma-separated symptoms",
          },
          {
            name: "aggravatingFactors",
            label: "Aggravating Factors",
            type: "textarea",
            placeholder: "Comma-separated factors",
          },
          {
            name: "alleviatingFactors",
            label: "Alleviating Factors",
            type: "textarea",
            placeholder: "Comma-separated factors",
          },
          { name: "notes", label: "Notes", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "medical-background",
    title: "Medical Background",
    description: "Patient's medical history and background",
    sections: [
      {
        title: "History",
        fields: [
          {
            name: "pastDiseases",
            label: "Past Diseases",
            type: "textarea",
            placeholder: "Comma-separated",
          },
          {
            name: "surgeries",
            label: "Surgeries",
            type: "textarea",
            placeholder: "name,date,notes; name,date,notes",
          },
          {
            name: "chronicConditions",
            label: "Chronic Conditions",
            type: "textarea",
            placeholder: "Comma-separated",
          },
          {
            name: "hospitalizations",
            label: "Hospitalizations",
            type: "textarea",
            placeholder: "reason,date,hospital; ...",
          },
          {
            name: "familyHistory",
            label: "Family History",
            type: "textarea",
            placeholder: "Comma-separated",
          },
        ],
      },
      {
        title: "Social History",
        fields: [
          { name: "smoking", label: "Smoking", type: "checkbox" },
          { name: "alcohol", label: "Alcohol", type: "checkbox" },
          { name: "drugs", label: "Drugs", type: "checkbox" },
          { name: "diet", label: "Diet", type: "text" },
          { name: "exercise", label: "Exercise", type: "text" },
        ],
      },
      {
        title: "Medications and Allergies",
        fields: [
          {
            name: "medications",
            label: "Medications",
            type: "textarea",
            placeholder: "name,dosage,frequency; ...",
          },
          {
            name: "allergies",
            label: "Allergies",
            type: "textarea",
            placeholder: "type,allergen,reaction; ...",
          },
          {
            name: "immunizationsHistory",
            label: "Immunizations History",
            type: "textarea",
          },
          { name: "travelHistory", label: "Travel History", type: "textarea" },
          {
            name: "mentalHealthHistory",
            label: "Mental Health History",
            type: "textarea",
          },
        ],
      },
      {
        title: "Review of Systems",
        fields: [
          {
            name: "reviewOfSystemsConstitutional",
            label: "Constitutional",
            type: "text",
          },
          { name: "reviewOfSystemsEyes", label: "Eyes", type: "text" },
        ],
      },
    ],
  },
  {
    id: "vital-signs",
    title: "Vital Signs",
    description: "Record patient's vital signs",
    sections: [
      {
        title: "Vitals",
        fields: [
          { name: "weight", label: "Weight (kg)", type: "number" },
          { name: "height", label: "Height (cm)", type: "number" },
          { name: "bmi", label: "BMI", type: "number", disabled: true },
          {
            name: "bloodPressureSystolic",
            label: "Systolic BP",
            type: "number",
          },
          {
            name: "bloodPressureDiastolic",
            label: "Diastolic BP",
            type: "number",
          },
          { name: "heartRate", label: "Heart Rate", type: "number" },
          {
            name: "respiratoryRate",
            label: "Respiratory Rate",
            type: "number",
          },
          { name: "temperature", label: "Temperature (°C)", type: "number" },
          {
            name: "oxygenSaturation",
            label: "Oxygen Saturation (%)",
            type: "number",
          },
          { name: "pulse", label: "Pulse", type: "number" },
          {
            name: "painScore",
            label: "Pain Score",
            type: "number",
            min: 1,
            max: 10,
          },
          {
            name: "bloodGlucose",
            label: "Blood Glucose (mg/dL)",
            type: "number",
          },
          {
            name: "headCircumference",
            label: "Head Circumference (cm)",
            type: "number",
          },
        ],
      },
    ],
  },
  {
    id: "physical-examination",
    title: "Physical Examination",
    description: "Findings from physical exam",
    sections: [
      {
        title: "Examination",
        fields: [
          {
            name: "generalAppearance",
            label: "General Appearance",
            type: "textarea",
          },
          { name: "heent", label: "HEENT", type: "textarea" },
          { name: "cardiovascular", label: "Cardiovascular", type: "textarea" },
          { name: "respiratory", label: "Respiratory", type: "textarea" },
          {
            name: "gastrointestinal",
            label: "Gastrointestinal",
            type: "textarea",
          },
          { name: "genitourinary", label: "Genitourinary", type: "textarea" },
          {
            name: "gynecologyObstetrics",
            label: "Gynecology/Obstetrics",
            type: "textarea",
          },
          {
            name: "musculoskeletal",
            label: "Musculoskeletal",
            type: "textarea",
          },
          { name: "neurological", label: "Neurological", type: "textarea" },
          { name: "skin", label: "Skin", type: "textarea" },
          { name: "others", label: "Others", type: "textarea" },
          { name: "mentalStatus", label: "Mental Status", type: "textarea" },
          { name: "lymphNodes", label: "Lymph Nodes", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "diagnosis-records",
    title: "Diagnosis Records",
    description: "Record diagnoses",
    sections: [
      {
        title: "Diagnosis",
        fields: [
          {
            name: "diagnosisType",
            label: "Diagnosis Type",
            type: "select",
            options: ["Initial", "Follow-up", "Final"],
          },
          { name: "icdCode", label: "ICD Code", type: "text" },
          { name: "icdDescription", label: "ICD Description", type: "text" },
          { name: "comment", label: "Comment", type: "textarea" },
          { name: "diagnosisDate", label: "Diagnosis Date", type: "date" },
          {
            name: "differentialDiagnoses",
            label: "Differential Diagnoses",
            type: "textarea",
          },
          {
            name: "certaintyLevel",
            label: "Certainty Level",
            type: "select",
            options: ["Probable", "Possible", "Confirmed"],
          },
        ],
      },
    ],
  },
  {
    id: "procedures",
    title: "Procedures",
    description: "Details of procedures performed",
    sections: [
      {
        title: "Procedure",
        fields: [
          { name: "procedureName", label: "Procedure Name", type: "text" },
          { name: "performedBy", label: "Performed By", type: "text" },
          { name: "date", label: "Date", type: "date" },
          { name: "comment", label: "Comment", type: "textarea" },
          { name: "success", label: "Success", type: "checkbox" },
          { name: "anesthesiaType", label: "Anesthesia Type", type: "text" },
          { name: "complications", label: "Complications", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "prescriptions",
    title: "Prescriptions",
    description: "Prescribed medications",
    sections: [
      {
        title: "Prescription",
        fields: [
          { name: "medicationName", label: "Medication Name", type: "text" },
          {
            name: "route",
            label: "Route",
            type: "select",
            options: ["Oral", "IV", "IM", "Topical", "Sublingual"],
          },
          { name: "dosage", label: "Dosage", type: "number" },
          {
            name: "dosageUnit",
            label: "Dosage Unit",
            type: "select",
            options: ["mg", "ml", "g"],
          },
          {
            name: "frequency",
            label: "Frequency",
            type: "select",
            options: ["Once daily", "Twice daily", "Every 8h"],
          },
          { name: "duration", label: "Duration", type: "number" },
          {
            name: "durationUnit",
            label: "Duration Unit",
            type: "select",
            options: ["Days", "Weeks", "Months"],
          },
          {
            name: "foodRelation",
            label: "Food Relation",
            type: "select",
            options: ["Before", "After", "With food"],
          },
          { name: "instructions", label: "Instructions", type: "textarea" },
          { name: "refills", label: "Refills", type: "number" },
          {
            name: "genericAllowed",
            label: "Generic Allowed",
            type: "checkbox",
          },
        ],
      },
    ],
  },
  {
    id: "analyses",
    title: "Analyses (Lab Tests)",
    description: "Ordered lab tests",
    sections: [
      {
        title: "Test",
        fields: [
          { name: "testName", label: "Test Name", type: "text" },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: ["Blood", "Urine", "Imaging"],
          },
          { name: "isBillable", label: "Is Billable", type: "checkbox" },
          { name: "price", label: "Price", type: "number" },
          { name: "comment", label: "Comment", type: "textarea" },
          { name: "result", label: "Result", type: "textarea" },
          { name: "orderedBy", label: "Ordered By", type: "text" },
          { name: "resultDate", label: "Result Date", type: "date" },
          { name: "referenceRange", label: "Reference Range", type: "text" },
        ],
      },
    ],
  },
  {
    id: "vaccinations",
    title: "Vaccinations",
    description: "Vaccination records",
    sections: [
      {
        title: "Vaccine",
        fields: [
          { name: "vaccineName", label: "Vaccine Name", type: "text" },
          {
            name: "dateAdministered",
            label: "Date Administered",
            type: "date",
          },
          { name: "nextDoseDate", label: "Next Dose Date", type: "date" },
          { name: "batchNumber", label: "Batch Number", type: "text" },
          {
            name: "site",
            label: "Site",
            type: "text",
            placeholder: "e.g., left arm",
          },
          {
            name: "reactionObserved",
            label: "Reaction Observed",
            type: "textarea",
          },
          { name: "notes", label: "Notes", type: "textarea" },
          { name: "manufacturer", label: "Manufacturer", type: "text" },
          { name: "doseNumber", label: "Dose Number", type: "number" },
        ],
      },
    ],
  },
  {
    id: "services-provided",
    title: "Services Provided",
    description: "Services rendered during the appointment",
    sections: [
      {
        title: "Service",
        fields: [
          { name: "serviceName", label: "Service Name", type: "text" },
          { name: "serviceId", label: "Service ID", type: "text" },
          { name: "price", label: "Price", type: "number" },
          { name: "quantity", label: "Quantity", type: "number" },
          { name: "comment", label: "Comment", type: "textarea" },
          { name: "providerId", label: "Provider ID", type: "text" },
        ],
      },
    ],
  },
  {
    id: "resume",
    title: "Résumé (Summary)",
    description: "Summary and recommendations",
    sections: [
      {
        title: "Summary",
        fields: [
          {
            name: "autoSummary",
            label: "Auto Summary",
            type: "textarea",
            disabled: true,
          },
          { name: "doctorNotes", label: "Doctor Notes", type: "textarea" },
          {
            name: "recommendations",
            label: "Recommendations",
            type: "textarea",
          },
          {
            name: "followUpAdvice",
            label: "Follow-up Advice",
            type: "textarea",
          },
          {
            name: "attachments",
            label: "Attachments",
            type: "textarea",
            placeholder: "File paths or descriptions",
          },
          {
            name: "generalComments",
            label: "General Comments",
            type: "textarea",
          },
          {
            name: "followUpRequired",
            label: "Follow-up Required",
            type: "checkbox",
          },
          { name: "followUpDate", label: "Follow-up Date", type: "date" },
          {
            name: "referrals",
            label: "Referrals",
            type: "textarea",
            placeholder: "specialist,reason,date; ...",
          },
        ],
      },
    ],
  },
  {
    id: "billing",
    title: "Billing",
    description: "Billing and payment details",
    sections: [
      {
        title: "Billing Info",
        fields: [
          {
            name: "baseConsultationPrice",
            label: "Base Consultation Price",
            type: "number",
          },
          {
            name: "additionalServicesTotal",
            label: "Additional Services Total",
            type: "number",
          },
          { name: "discount", label: "Discount", type: "number" },
          { name: "tax", label: "Tax", type: "number" },
          {
            name: "finalAmount",
            label: "Final Amount",
            type: "number",
            disabled: true,
          },
          {
            name: "paymentMethod",
            label: "Payment Method",
            type: "select",
            options: ["Cash", "Card", "Transfer", "Insurance"],
          },
          { name: "isPaid", label: "Is Paid", type: "checkbox" },
          { name: "invoiceNumber", label: "Invoice Number", type: "text" },
          {
            name: "insuranceProvider",
            label: "Insurance Provider",
            type: "text",
          },
          {
            name: "insurancePolicyNumber",
            label: "Policy Number",
            type: "text",
          },
          {
            name: "insuranceCoverageAmount",
            label: "Coverage Amount",
            type: "number",
          },
          { name: "paymentDate", label: "Payment Date", type: "date" },
        ],
      },
    ],
  },
  {
    id: "printing-closure",
    title: "Printing & Clôture",
    description: "Finalize and print documents",
    sections: [
      {
        title: "Printing Options",
        fields: [
          {
            name: "printPrescription",
            label: "Print Prescription",
            type: "checkbox",
          },
          { name: "printSummary", label: "Print Summary", type: "checkbox" },
          { name: "printInvoice", label: "Print Invoice", type: "checkbox" },
          {
            name: "completedAt",
            label: "Completed At",
            type: "text",
            disabled: true,
          },
          { name: "locked", label: "Locked", type: "checkbox" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: ["COMPLETED", "CANCELLED", "IN_PROGRESS"],
          },
          { name: "signatureDoctor", label: "Doctor Signature", type: "text" },
          {
            name: "signaturePatient",
            label: "Patient Signature",
            type: "text",
          },
        ],
      },
    ],
  },
];
