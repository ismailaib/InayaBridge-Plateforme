"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Tooltip } from "@/components/Tooltip";
import { BookmarkX, CheckCheck, Info, Pin } from "lucide-react";
import * as dashboardApi from "@/api/dashboard";

interface KpiItem {
  title: string;
  value: string | number;
  tooltip: string;
}

export default function DoctorKPIBlock({ tenantId, doctorId }: { tenantId: string; doctorId?: string }) {
  const [kpiData, setKpiData] = useState<KpiItem[][]>([
    [
      { title: "Rendez-vous aujourd’hui", value: 0, tooltip: "Nombre total de rendez-vous programmés aujourd’hui." },
      { title: "Patients en attente", value: 0, tooltip: "Patients actuellement en salle d’attente ou non encore pris en charge." },
      { title: "Consultations terminées (7j)", value: 0, tooltip: "Total des consultations terminées durant les 7 derniers jours." },
    ],
    [
      { title: "Nouveaux patients (mois)", value: 0, tooltip: "Nombre de nouveaux patients enregistrés ce mois-ci." },
      { title: "Consultations vidéo effectuées", value: 0, tooltip: "Nombre total de consultations effectuées via vidéoconférence." },
      { title: "Satisfaction patient (CSAT)", value: "0 / 5", tooltip: "Score moyen de satisfaction des patients (Customer Satisfaction Score)." },
    ],
  ]);

  const [topMedicalAlerts, setTopMedicalAlerts] = useState<dashboardApi.AlertDto[]>([]);

  useEffect(() => {
    // Fetch KPIs
    const fetchKpi = async () => {
      try {
        const res = await dashboardApi.getDoctorKpi(tenantId, doctorId);
        const data = res.data;
        setKpiData([
          [
            { title: "Rendez-vous aujourd’hui", value: data.todayAppointments ?? 0, tooltip: "Nombre total de rendez-vous programmés aujourd’hui." },
            { title: "Patients en attente", value: data.waitingPatients ?? 0, tooltip: "Patients actuellement en salle d’attente ou non encore pris en charge." },
            { title: "Consultations terminées (7j)", value: data.completed7days ?? 0, tooltip: "Total des consultations terminées durant les 7 derniers jours." },
          ],
          [
            { title: "Nouveaux patients (mois)", value: data.newPatientsMonth ?? 0, tooltip: "Nombre de nouveaux patients enregistrés ce mois-ci." },
            { title: "Consultations vidéo effectuées", value: data.videoConsultations ?? 0, tooltip: "Nombre total de consultations effectuées via vidéoconférence." },
            { title: "Satisfaction patient (CSAT)", value: `${data.csat ?? 0} / 5`, tooltip: "Score moyen de satisfaction des patients (Customer Satisfaction Score)." },
          ],
        ]);
      } catch (error) {
        console.error("Error fetching KPIs:", error);
        // Defaults already set to 0
      }
    };

    // Fetch alerts
    const fetchAlerts = async () => {
      try {
        const res = await dashboardApi.getDoctorAlerts(tenantId, doctorId);
        setTopMedicalAlerts(res.data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        setTopMedicalAlerts([]); // empty if error
      }
    };

    fetchKpi();
    fetchAlerts();
  }, [tenantId, doctorId]);

  return (
    <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-8">
      {/* KPI Card */}
      <Card className="h-full lg:col-span-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900 dark:text-gray-50">
            Statistiques de la semaine
          </p>
          <Tooltip content="Ces statistiques représentent les données clés de la semaine." showArrow={false}>
            <span className="text-sm text-gray-500 dark:text-gray-400"><Info width={18} /></span>
          </Tooltip>
        </div>
        <dl className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {kpiData.map((column, i) => (
            <div key={i} className="flex flex-col space-y-6">
              {column.map((kpi, index) => (
                <Tooltip key={index} content={kpi.tooltip} showArrow={false}>
                  <div className="flex flex-col justify-start">
                    <dt className="text-start text-sm text-gray-500 dark:text-gray-500">{kpi.title}</dt>
                    <div className="flex items-center gap-4">
                      <dd className="mt-1 text-start text-2xl font-semibold text-gray-900 dark:text-gray-50">{kpi.value}</dd>
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

      {/* Alerts Card */}
      <Card className="h-full lg:col-span-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900 dark:text-gray-50">
            Alertes principales
          </p>
          <Tooltip content="Ces alertes représentent les messages isUrgents nécessitant une attention immédiate." showArrow={false}>
            <span className="text-sm text-gray-500 dark:text-gray-400"><Info width={18} /></span>
          </Tooltip>
        </div>
        <ol className="mt-4 divide-y divide-gray-200 dark:divide-gray-800/20">
          {topMedicalAlerts.length > 0 ? (
            topMedicalAlerts.map((issue, index) => (
              <li key={index} className={`flex cursor-pointer items-center justify-between px-2 py-2 transition-all duration-300 hover:bg-gray-50 hover:dark:bg-gray-800`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {issue.category}
                    <p className="text-sm tabular-nums text-gray-600 dark:text-gray-400">{new Date(issue.date).toLocaleString()}</p>
                  </span>
                </div>
                {issue.closed ? (
                  <Tooltip content="Alerte Cloturée" showArrow={false}>
                    <CheckCheck width={18} className="cursor-pointer text-blue-500" />
                  </Tooltip>
                ) : (
                  <div className="items-top flex justify-end gap-2">
                    <Tooltip content="Clotuer l'alerte" showArrow={false}>
                      <BookmarkX width={18} className="cursor-pointer text-red-500" />
                    </Tooltip>
                    <Tooltip content="Épingler l'alerte" showArrow={false}>
                      <Pin width={18} className="cursor-pointer text-blue-500" />
                    </Tooltip>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="px-2 py-2 text-gray-500 dark:text-gray-400 text-sm">Aucune alerte</li>
          )}
        </ol>
      </Card>
    </div>
  );
}
