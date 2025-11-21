"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Tooltip } from "@/components/Tooltip";
import { DonutChart } from "@/components/DonutChart";
import useTranslations from "@/lib/i18n/useTranslations";
import { BookmarkX, CheckCheck, Info, Pin } from "lucide-react";
import * as dashboardApi from "@/api/dashboard";
import { getnotifications } from "@/api/Notifications";

type KpiKey =
  | "todayAppointments"
  | "waitingPatients"
  | "finishedConsultations"
  | "newPatients"
  | "videoConsultations"
  | "csatScore";

interface UrgentStatsData {
  name: string;
  amount: number;
}

interface DoctorAppointmentsData {
  name: string;
  amount: number;
}

export default function DoctorKPIBlock({ 
  tenantId, 
  doctorId, 
  user 
}: { 
  tenantId: string; 
  doctorId?: string; 
  user?: any 
}) {
  const t = useTranslations("dashboard.kpis");

  const [kpiValues, setKpiValues] = useState<Record<KpiKey, string>>({
    todayAppointments: "0",
    waitingPatients: "0",
    finishedConsultations: "0",
    newPatients: "0",
    videoConsultations: "0",
    csatScore: "0 / 5",
  });

  const [urgentStatsData, setUrgentStatsData] = useState<UrgentStatsData[]>([]);
  const [doctorAppointmentsData, setDoctorAppointmentsData] = useState<DoctorAppointmentsData[]>([]);
  const [isLoadingUrgent, setIsLoadingUrgent] = useState(true);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const res = await dashboardApi.getDoctorKpi(tenantId, doctorId);
        const data = res.data;
        setKpiValues({
          todayAppointments: data.todayAppointments?.toString() ?? "0",
          waitingPatients: data.waitingPatients?.toString() ?? "0",
          finishedConsultations: data.completed7days?.toString() ?? "0",
          newPatients: data.newPatientsMonth?.toString() ?? "0",
          videoConsultations: data.videoConsultations?.toString() ?? "0",
          csatScore: `${data.csat ?? 0} / 5`,
        });
      } catch (err) {
        console.error("Error fetching KPIs:", err);
      }
    };

    const fetchUrgentStats = async () => {
      setIsLoadingUrgent(true);
      try {
        const res = await dashboardApi.getUrgentStats(tenantId);
        const data = res.data;
        setUrgentStatsData([
          {
            name: "Urgent",
            amount: data.urgent || 0,
          },
          {
            name: "Non Urgent",
            amount: data.nonUrgent || 0,
          },
        ]);
      } catch (err) {
        console.error("Error fetching urgent stats:", err);
        setUrgentStatsData([]);
      } finally {
        setIsLoadingUrgent(false);
      }
    };

    const fetchDoctorAppointments = async () => {
      setIsLoadingDoctors(true);
      try {
        const res = await dashboardApi.getDoctorAppointmentsStats(tenantId);
        const data = res.data;
        setDoctorAppointmentsData(
          data.map((doctor: any) => ({
            name: doctor.doctorName,
            amount: doctor.appointmentCount,
          }))
        );
      } catch (err) {
        console.error("Error fetching doctor appointments:", err);
        setDoctorAppointmentsData([]);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchKpis();
    fetchUrgentStats();
    fetchDoctorAppointments();
  }, [tenantId, doctorId, user]);

  const KPI_COLUMNS: KpiKey[][] = [
    ["todayAppointments", "waitingPatients", "finishedConsultations"],
    ["newPatients", "videoConsultations", "csatScore"],
  ];

  const kpiData = KPI_COLUMNS.map((column) =>
    column.map((key) => ({
      key,
      title: t(`cards.${key}.title`),
      value: kpiValues[key],
      tooltip: t(`cards.${key}.tooltip`),
    }))
  );

  return (
    <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-8">
      {/* KPI Card */}
      <Card className="h-full lg:col-span-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900 dark:text-gray-50">
            {t("cardsSection.title")}
          </p>
          <Tooltip content={t("cardsSection.tooltip")} showArrow={false}>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <Info width={18} />
            </span>
          </Tooltip>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {kpiData.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col space-y-6">
              {column.map((kpi) => (
                <Tooltip key={kpi.key} content={kpi.tooltip} showArrow={false}>
                  <div className="flex flex-col justify-start">
                    <dt className="text-start text-sm text-gray-500 dark:text-gray-500">
                      {kpi.title}
                    </dt>
                    <div className="flex items-center gap-4">
                      <dd className="mt-1 text-start text-2xl font-semibold text-gray-900 dark:text-gray-50">
                        {kpi.value}
                      </dd>
                      <div className="flex flex-row items-center gap-0.5">
                        <div className="w-1.5 h-6 bg-blue-500 dark:bg-blue-800 rounded-lg"></div>
                        <div className="w-1.5 h-6 bg-blue-500 dark:bg-blue-800 rounded-lg"></div>
                        <div className="w-1.5 h-6 bg-yellow-200 dark:bg-yellow-600 rounded-lg"></div>
                        <div className="w-1.5 h-6 bg-blue-200/20 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              ))}
            </div>
          ))}
        </dl>
      </Card>

      {/* Statistics Charts Card */}
      <Card className="h-full lg:col-span-4">
        <div className="flex items-center justify-between mb-6">
          <p className="font-semibold text-gray-900 dark:text-gray-50">
            Statistiques des Rendez-vous
          </p>
          <Tooltip content="Vue d'ensemble des rendez-vous urgents et par médecin" showArrow={false}>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <Info width={18} />
            </span>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Urgent Stats Chart */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Rendez-vous Urgents
            </p>
            {isLoadingUrgent ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-sm text-gray-500">Chargement...</p>
              </div>
            ) : urgentStatsData.length > 0 && urgentStatsData.some(d => d.amount > 0) ? (
              <DonutChart
                data={urgentStatsData}
                variant="donut"
                category="name"
                value="amount"
                valueFormatter={(number: number) =>
                  `${Intl.NumberFormat("fr-FR").format(number).toString()}`
                }
                colors={["red", "blue"]}
              />
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucune donnée disponible
                </p>
              </div>
            )}
          </div>

          {/* Doctor Appointments Chart */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Rendez-vous par Médecin
            </p>
            {isLoadingDoctors ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-sm text-gray-500">Chargement...</p>
              </div>
            ) : doctorAppointmentsData.length > 0 ? (
              <DonutChart
                data={doctorAppointmentsData}
                variant="pie"
                category="name"
                value="amount"
                valueFormatter={(number: number) =>
                  `${Intl.NumberFormat("fr-FR").format(number).toString()}`
                }
              />
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucune donnée disponible
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}