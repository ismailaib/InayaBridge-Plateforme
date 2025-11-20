"use client";

import { AreaChart } from "@/components/AreaChart";
import { BarChart } from "@/components/BarChart";
import { Card } from "@/components/Card";
import { CategoryBar } from "@/components/CategoryBar";
import { Tooltip } from "@/components/Tooltip";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { Info } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import {
  getPerformanceStats,
  PerformanceStatsDto,
  getConsultationEvolution,
  DailyConsultationStatsDto,
} from "@/api/dashboard";

interface DashboardStatsProps {
  tenantId: string;
  doctorId: string;
}

export default function DashboardStats({ tenantId, doctorId }: DashboardStatsProps) {
  const t = useTranslations("dashboard.dashboardStats");

  const [performanceStats, setPerformanceStats] = useState<PerformanceStatsDto | null>(null);
  const [evolutionData, setEvolutionData] = useState<DailyConsultationStatsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fixed current date (as per your context)
  const today = useMemo(() => new Date(2025, 10, 19), []); // November 19, 2025 (month is 0-indexed)
  const currentMonth = today.getMonth() + 1; // 11
  const currentYear = today.getFullYear();   // 2025

  const isCurrentMonth = useMemo(
    () => currentMonth === today.getMonth() + 1 && currentYear === today.getFullYear(),
    [today]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [perfRes, evolRes] = await Promise.all([
          getPerformanceStats(doctorId, currentMonth, currentYear),
          getConsultationEvolution(doctorId, currentMonth, currentYear),
        ]);

        setPerformanceStats(perfRes.data);
        setEvolutionData(evolRes.data.days ?? []);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setEvolutionData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (doctorId) fetchData();
  }, [doctorId]);

  // Filter evolution data: only up to today if it's the current month
  const filteredEvolutionData = useMemo(() => {
    if (!isCurrentMonth || evolutionData.length === 0) return evolutionData;

    const todayDay = today.getDate(); // 19

    return evolutionData.filter((day) => {
      const dayNum = parseInt(day.date.split("-")[2], 10); // assuming YYYY-MM-DD
      return dayNum <= todayDay;
    });
  }, [evolutionData, isCurrentMonth, today]);

  // AreaChart data (only total consultations)
  const chartData = useMemo(() => {
    const totalLabel = t("categories.1") || "Total Consultations";

    return filteredEvolutionData.map((day) => ({
      date: day.date,
      [totalLabel]: day.total,
    }));
  }, [filteredEvolutionData, t]);

  // BarChart breakdown (local / in-person / video) – based on filtered data
  const consultationBreakdownData = useMemo(() => {
    const sums = filteredEvolutionData.reduce(
      (acc, day) => {
        acc.local += day.localCount;
        acc.inPerson += day.inPersonCount;
        acc.video += day.videoCount;
        return acc;
      },
      { local: 0, inPerson: 0, video: 0 }
    );

    return [
      { type: t("evolution.breakdown.local") || "Local", count: sums.local },
      { type: t("evolution.breakdown.inPerson") || "In-Person", count: sums.inPerson },
      { type: t("evolution.breakdown.video") || "Video", count: sums.video },
    ];
  }, [filteredEvolutionData, t]);

  const totalConsultationsThisMonth = filteredEvolutionData.reduce((sum, day) => sum + day.total, 0);

  if (isLoading) {
    return (
      <>
        <h1 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-50">{t("title")}</h1>
        <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">{t("subtitle")}</p>
        <Card className="mt-6 p-6">Loading dashboard statistics...</Card>
      </>
    );
  }

  const {
    attendedPct = 0,
    missedPct = 0,
    attendedCount = 0,
    missedCount = 0,
    avgConsultationTime = "0min 0s",
    pctLess20Min = 0,
    pctMore20Min = 0,
  } = performanceStats ?? {};

  const areaChartCategories = [t("categories.1") || "Total Consultations"];

  return (
    <>
      <h1 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-50">
        {t("title")}
      </h1>
      <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
        {t("subtitle")}
        {isCurrentMonth && (
          <span className="ml-2 text-xs italic"> (up to Nov 19)</span>
        )}
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Appointments Respect Rate */}
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
            <CategoryBar values={[attendedPct, missedPct]} colors={["blue", "amber"]} showLabels={false} className="mt-6" />
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

        {/* Consultation Time */}
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
            <CategoryBar values={[pctLess20Min, pctMore20Min]} colors={["blue", "gray"]} showLabels={false} className="mt-6" />
            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between">
                <span>{t("consultation.under20")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{pctLess20Min.toFixed(1)}%</span>
              </li>
              <li className="flex justify-between">
                <span>{t("consultation.over20")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{pctMore20Min.toFixed(1)}%</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Evolution Card */}
      <Card className="mt-6 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
          <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {t("evolution.title")}
            {isCurrentMonth && <span className="ml-2 text-xs text-gray-500">(up to today)</span>}
          </h1>
          <Tooltip content={t("evolution.tooltip")} showArrow={false}>
            <Info width={18} className="text-gray-500 dark:text-gray-400" />
          </Tooltip>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              {totalConsultationsThisMonth}
            </p>
            <p className="text-sm text-gray-500">
              {isCurrentMonth
                ? t("evolution.totalSoFar") || "Consultations so far this month"
                : t("evolution.total") || "Total consultations this month"}
            </p>
          </div>

          {/* Area Chart – Total Evolution */}
          <AreaChart
            data={chartData}
            index="date"
            categories={areaChartCategories}
            colors={["blue"]}
            fill="solid"
            valueFormatter={(v) => `${v}`}
            onValueChange={() => {}}
            tickGap={15}
            className="hidden sm:block h-64"
          />
          <AreaChart
            data={chartData}
            index="date"
            categories={areaChartCategories}
            colors={["blue"]}
            fill="solid"
            valueFormatter={(v) => `${v}`}
            showYAxis={false}
            startEndOnly={true}
            tickGap={15}
            className="sm:hidden h-64"
          />

          {/* Breakdown Bar Chart */}
          <div className="mt-10">
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