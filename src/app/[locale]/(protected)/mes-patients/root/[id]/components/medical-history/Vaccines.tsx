"use client";

import VaccinesTable from "./VaccinesTable";

export default function Vaccines({ patientId }: { patientId: string }) {

  return (
    <div className="space-y-6">
      <VaccinesTable patientId={patientId} />
    </div>
  );
}
