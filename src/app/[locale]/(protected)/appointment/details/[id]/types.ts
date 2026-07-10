
// src/app/appointments/[id]/types.ts
export interface Section {
    id?: string;
    title: string;
    fields: Field[];
}

export interface Field {
    name: string;
    label: string;
    type: "text" | "textarea" | "number" | "select" | "checkbox" | "radio" | "date" | "email";
    placeholder?: string;
    section?: string;
    min?: number;
    max?: number;
}