"use client";

import { AreaChart } from "@/components/AreaChart";
import { BarChart } from "@/components/BarChart"; // Import BarChart
import { Card } from "@/components/Card";
import { CategoryBar } from "@/components/CategoryBar";
import { Tooltip } from "@/components/Tooltip";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { Info } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
// Assuming API helpers are imported from a suitable path
import { getPerformanceStats, PerformanceStatsDto, getConsultationEvolution, MonthlyConsultationEvolutionDto, DailyConsultationStatsDto } from "@/api/dashboard"; 

// Define props interface
interface DashboardStatsProps {
    tenantId: string;
    doctorId: string; // This will be used as doctorProfileId
}

export default function DashboardStats({ tenantId, doctorId }: DashboardStatsProps) {
  const t = useTranslations("dashboard.dashboardStats");

  const [performanceStats, setPerformanceStats] = useState<PerformanceStatsDto | null>(null);
  const [evolutionData, setEvolutionData] = useState<DailyConsultationStatsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determine current month and year for API calls (e.g., current month)
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
  const currentYear = today.getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Performance Stats
        const performanceResponse = await getPerformanceStats(doctorId, currentMonth, currentYear);
        setPerformanceStats(performanceResponse.data);

        // Fetch Consultation Evolution
        const evolutionResponse = await getConsultationEvolution(doctorId, currentMonth, currentYear);
        setEvolutionData(evolutionResponse.data.days);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (doctorId) {
      fetchData();
    }
  }, [doctorId, currentMonth, currentYear]);


  // 1. Helper function to format the evolution data for AreaChart (Only TOTAL for now)
  const getAreaChartData = (data: DailyConsultationStatsDto[]) => {
    const totalCategory = t("categories.1");
    
    return data.map(day => ({
        date: day.date,
        [totalCategory]: day.total,
    }));
  };

  const chartData = getAreaChartData(evolutionData);

  // 2. Calculate the data for the new Bar Chart (Consultation Breakdown)
  const consultationBreakdownData = useMemo(() => {
    let localSum = 0;
    let inPersonSum = 0;
    let videoSum = 0;

    evolutionData.forEach(day => {
        localSum += day.localCount;
        inPersonSum += day.inPersonCount;
        videoSum += day.videoCount;
    });

    // Note: Assuming new translation keys for clarity, replace with actual keys if different.
    return [
        { type: t("evolution.breakdown.local") || "Local", count: localSum },
        { type: t("evolution.breakdown.inPerson") || "In-Person", count: inPersonSum },
        { type: t("evolution.breakdown.video") || "Video", count: videoSum },
    ];
  }, [evolutionData, t]);

  if (isLoading) {
    return (
        <>
            <h1 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-50">{t("title")}</h1>
            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">{t("subtitle")}</p>
            <Card className="mt-6 p-6">Loading dashboard statistics...</Card>
        </>
    );
  }
  
  // Destructure Performance Stats with safe fallbacks
  const performanceStatsData = performanceStats ?? {
 attendedPct: 0, missedPct: 0, attendedCount: 0, missedCount: 0,
 avgConsultationTime: "0min 0s", pctLess20Min: 0, pctMore20Min: 0
  };
  const { attendedPct, missedPct, attendedCount, missedCount, avgConsultationTime, pctLess20Min, pctMore20Min } = performanceStatsData;

  // The Area Chart will now use only the first category key for the total count.
  const areaChartCategories = [t("categories.1")]; 

  return (
    <>
      <h1 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-50">
        {t("title")}
      </h1>
      <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
        {t("subtitle")}
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* RDV honorés (Appointments Respected) - Dynamic */}
        <Card className="mt-6 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
            <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50">
              {t("appointments.respectTitle")}
            </h1>
            <Tooltip content={t("appointments.tooltip")} showArrow={false}>
              <Info width={18} className="text-gray-500 dark:text-gray-400" />
            </Tooltip>
          </div>
          <div className="p-4">
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
              {attendedPct.toFixed(1)}%
            </p>
            <p className="text-sm/6 text-gray-500 dark:text-gray-500">
              {t("appointments.rate")}
            </p>
            <CategoryBar
              values={[attendedPct, missedPct]}
              colors={["blue", "amber"]}
              showLabels={false}
              className="mt-6"
            />
            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between">
                <span>{t("appointments.honored")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {attendedPct.toFixed(1)}% ({attendedCount})
                </span>
              </li>
              <li className="flex justify-between">
                <span>{t("appointments.missed")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {missedPct.toFixed(1)}% ({missedCount})
                </span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Temps de consultation (Consultation Time) - Dynamic */}
        <Card className="mt-6 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
            <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50">
              {t("consultation.timeTitle")}
            </h1>
            <Tooltip content={t("consultation.tooltip")} showArrow={false}>
              <Info width={18} className="text-gray-500 dark:text-gray-400" />
            </Tooltip>
          </div>
          <div className="p-4">
            <p className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
              {avgConsultationTime}
            </p>
            <p className="text-sm/6 text-gray-500 dark:text-gray-500">
              {t("consultation.average")}
            </p>
            <CategoryBar
              values={[pctLess20Min, pctMore20Min]}
              colors={["blue", "gray"]}
              showLabels={false}
              className="mt-6"
            />
            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between">
                <span>{t("consultation.under20")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {pctLess20Min.toFixed(1)}%
                </span>
              </li>
              <li className="flex justify-between">
                <span>{t("consultation.over20")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {pctMore20Min.toFixed(1)}%
                </span>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Evolution - Dynamic */}
      <Card className="mt-6 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
          <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {t("evolution.title")}
          </h1>
          <Tooltip content={t("evolution.tooltip")} showArrow={false}>
            <Info width={18} className="text-gray-500 dark:text-gray-400" />
          </Tooltip>
        </div>
        <div className="p-4">
          {/* Area Chart (showing TOTAL only) */}
          <AreaChart
            data={chartData}
            index="date"
            categories={areaChartCategories}
            colors={["blue"]} // Only one color needed now
            fill="solid"
            valueFormatter={(v) => `${v}`}
            onValueChange={() => {}}
            tickGap={15}
            className="hidden sm:block"
          />
          <AreaChart
            data={chartData}
            index="date"
            categories={areaChartCategories}
            colors={["blue"]} // Only one color needed now
            fill="solid"
            valueFormatter={(v) => `${v}`}
            onValueChange={() => {}}
            showYAxis={false}
            startEndOnly={true}
            tickGap={15}
            className="sm:hidden"
          />

          {/* New Bar Chart (Breakdown) */}
          <div className="mt-8">
            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-50 mb-4">
              {t("evolution.breakdown.title") || "Consultation Type Breakdown"}
            </h5>
            <div dir="ltr">
              <BarChart
                data={consultationBreakdownData}
                index="type"
                categories={["count"]}
                colors={["amber"]}
                showLegend={false}
                layout="vertical"
                yAxisWidth={120}
                className="h-48"
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}