"use client";

import { Divider } from "@/components/Divider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import useTranslations from "@/lib/i18n/useTranslations";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import { DashboardModal } from "./components/DashboardModal";
import Kpis from "./components/Kpis";
import Reporting from "./components/Reporting";
import SalleAttente from "./components/SalleAttente";
import Statistics from "./components/Statistics";
import Banner from "./components/onboarding/Banner";
import LoadingState from "@/components/custom/LoadingState";
import DoctorRevenueChart from "./components/DoctorRevenueChart";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [user , setUser] = useState<any>(null);

  const t = useTranslations("common");
  const d = useTranslations("signup");

  // --- Load user from localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setTenantId(parsedUser?.doctorProfile?.tenantId ?? null);
          setDoctorId(parsedUser?.doctorProfile?.id ?? null);
          setUser(parsedUser);
        } catch (err) {
          console.error("Failed to parse user from localStorage:", err);
        }
      }
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  // --- Month & Year Selects ---
  const monthSelect = [
    { label: t("months.1"), value: "janvier" },
    { label: t("months.2"), value: "février" },
    { label: t("months.3"), value: "mars" },
    { label: t("months.4"), value: "avril" },
    { label: t("months.5"), value: "mai" },
    { label: t("months.6"), value: "juin" },
    { label: t("months.7"), value: "juillet" },
    { label: t("months.8"), value: "août" },
    { label: t("months.9"), value: "septembre" },
    { label: t("months.10"), value: "octobre" },
    { label: t("months.11"), value: "novembre" },
    { label: t("months.12"), value: "décembre" },
  ];

  const currentYear = new Date().getFullYear();
  const yearSelect = Array.from({ length: 6 }, (_, i) => {
    const year = (currentYear - i).toString();
    return { label: year, value: year };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 lg:p-8"
    >
      {/* Header */}
      <header>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {d("doctor.title")} {user.firstName + " " + user.lastName}
            </h2>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:items-end">
            <DashboardModal />
            <div className="w-[150px]">
              <Select defaultValue={monthSelect[new Date().getMonth()].value}>
                <SelectTrigger id="month" className="mt-2">
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  {monthSelect.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[150px]">
              <Select defaultValue={new Date().getFullYear().toString()}>
                <SelectTrigger id="year" className="mt-2">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {yearSelect.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <Divider />

      <motion.div initial="hidden" animate="visible" custom={0}>
        <Banner />
      </motion.div>

      <Divider />

      {/* Main Content */}
      <main className="space-y-8">
        <motion.div initial="hidden" animate="visible" custom={1}>
          {/* Pass tenantId and doctorId to Kpis */}
          <Kpis tenantId={tenantId ?? ""} doctorId={doctorId ?? ""} user={user}/>
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={2}>
          <Statistics tenantId={tenantId ?? ""} doctorId={doctorId ?? ""} /> 
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={3}>
          <Reporting tenantId={tenantId ?? ""} doctorId={doctorId ?? ""} />
        </motion.div>

        <motion.div initial="hidden" animate="visible" custom={4}>
          <DoctorRevenueChart doctorId={doctorId ?? ""} month={11} year={2025}/>
        </motion.div>
      </main>
    </motion.div>
  );
}
