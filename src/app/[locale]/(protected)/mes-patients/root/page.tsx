"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPatientsByTenant } from "@/api/patients";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : null;
    const tenantId = parsed?.doctorProfile?.tenantId;

    if (!tenantId) {
      router.push("/mes-patients");
      return;
    }

    const fetchLatest = async () => {
      const { data: patients } = await getPatientsByTenant(tenantId);

      if (!patients || patients.length === 0) {
        router.push("/mes-patients");
        return;
      }

      const sorted = [...patients].sort(
        (a, b) => (b.createdAt ?? b.id).localeCompare(a.createdAt ?? a.id)
      );

      router.push(`/mes-patients/root/${sorted[0].id}`);
    };

    fetchLatest();
  }, [router]);

  return <div></div>;
};

export default Page;
