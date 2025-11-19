"use client";

import { BarChart } from "@/components/BarChart";
import { Card } from "@/components/Card";
import { CategoryBar } from "@/components/CategoryBar";
import { Divider } from "@/components/Divider";
import { Tooltip } from "@/components/Tooltip";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { cx } from "@/lib/utils";
import {
  RiCheckDoubleFill,
  RiFileHistoryFill,
  RiTestTubeFill,
} from "@remixicon/react";
import { Info } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
// Assuming all API helpers are exported from this path
import { getDoctorFollowUpKpi, FollowUpKpiDto, getServiceDepartmentStats, ServiceDepartmentStatsDto } from "@/api/dashboard";

// Define the shape for the list items
interface AnalyticItem {
  name: string;
  value: number;
  icon: typeof RiFileHistoryFill;
  iconColor: string;
  tooltip: string;
}

// Define props interface to ensure type safety
interface DoctorAnalyticsSectionProps {
  tenantId: string;
  doctorId: string;
}

export default function DoctorAnalyticsSection({ tenantId, doctorId }: DoctorAnalyticsSectionProps) {
  const t = useTranslations("dashboard.doctorAnalytics");
  const [followUpKpi, setFollowUpKpi] = useState<FollowUpKpiDto | null>(null);
  const [serviceDepartmentStats, setServiceDepartmentStats] = useState<ServiceDepartmentStatsDto | null>(null);
  const [isLoadingKpi, setIsLoadingKpi] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // 1. Data Fetching Effect for FollowUp KPI
  useEffect(() => {
    const fetchKpi = async () => {
      setIsLoadingKpi(true);
      try {
        const response = await getDoctorFollowUpKpi(tenantId, doctorId);
        setFollowUpKpi(response.data);
      } catch (error) {
        console.error("Failed to fetch follow-up KPIs:", error);
        setFollowUpKpi({
          scheduledFollowUps: 0,
          totalFollowUps: 0,
          closedFollowUps: 0,
        } as FollowUpKpiDto);
      } finally {
        setIsLoadingKpi(false);
      }
    };

    fetchKpi();
  }, [tenantId, doctorId]); // Depend on real IDs

  // 2. Data Fetching Effect for Service/Department Stats
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        // Use the real tenantId and doctorId props
        const response = await getServiceDepartmentStats(tenantId, doctorId);
        setServiceDepartmentStats(response.data);
      } catch (error) {
        console.error("Failed to fetch service/department stats:", error);
        setServiceDepartmentStats({
          appointmentsPerService: {},
          appointmentsPerDepartment: {},
          summaryParagraph: t("summary.error"), // Use translation key for error
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [tenantId, doctorId, t]); // Depend on real IDs and translation hook

  // 3. Derive the list data from the fetched KPI
  const analyticData: AnalyticItem[] = useMemo(() => {
    if (!followUpKpi) {
      return [
        { name: t("items.followUp"), value: 0, icon: RiFileHistoryFill, iconColor: "text-indigo-500 dark:text-indigo-500", tooltip: t("tooltips.followUp") },
        { name: t("items.closed"), value: 0, icon: RiCheckDoubleFill, iconColor: "text-blue-500 dark:text-blue-500", tooltip: t("tooltips.closed") },
        { name: t("items.pending"), value: 0, icon: RiTestTubeFill, iconColor: "text-indigo-500 dark:text-indigo-500", tooltip: t("tooltips.pending") },
        { name: t("items.validated"), value: 0, icon: RiCheckDoubleFill, iconColor: "text-blue-500 dark:text-blue-500", tooltip: t("tooltips.validated") },
      ];
    }

    const followUp = followUpKpi.scheduledFollowUps;
    const closed = followUpKpi.closedFollowUps;

    // Placeholder values for pending/validated until API provides them explicitly
    const pending = 5;
    const validated = 10;

    return [
      {
        name: t("items.followUp"),
        value: followUp,
        icon: RiFileHistoryFill,
        iconColor: "text-indigo-500 dark:text-indigo-500",
        tooltip: t("tooltips.followUp"),
      },
      {
        name: t("items.closed"),
        value: closed,
        icon: RiCheckDoubleFill,
        iconColor: "text-blue-500 dark:text-blue-500",
        tooltip: t("tooltips.closed"),
      },
      {
        name: t("items.pending"),
        value: pending,
        icon: RiTestTubeFill,
        iconColor: "text-indigo-500 dark:text-indigo-500",
        tooltip: t("tooltips.pending"),
      },
      {
        name: t("items.validated"),
        value: validated,
        icon: RiCheckDoubleFill,
        iconColor: "text-blue-500 dark:text-blue-500",
        tooltip: t("tooltips.validated"),
      },
    ];
  }, [followUpKpi, t]);

  // Use values from the analytic data for simpler access
  const followUpValue = analyticData.find(item => item.name === t("items.followUp"))?.value || 0;
  const closedValue = analyticData.find(item => item.name === t("items.closed"))?.value || 0;
  const pendingValue = analyticData.find(item => item.name === t("items.pending"))?.value || 0;
  const validatedValue = analyticData.find(item => item.name === t("items.validated"))?.value || 0;

  // Total calculated for the Summary text
  const totalSummary = followUpValue + closedValue;

  // 4. Transform Service Stats for BarChart
  const serviceChartData = useMemo(() => {
    if (!serviceDepartmentStats) return [];
    return Object.entries(serviceDepartmentStats.appointmentsPerService).map(([name, count]) => ({
      service: name,
      Appointments: count,
    }));
  }, [serviceDepartmentStats]);

  // 5. Transform Department Stats for BarChart
  const departmentChartData = useMemo(() => {
    if (!serviceDepartmentStats) return [];
    return Object.entries(serviceDepartmentStats.appointmentsPerDepartment).map(([name, count]) => ({
      department: name,
      Appointments: count,
    }));
  }, [serviceDepartmentStats]);

  if (isLoadingKpi || isLoadingStats) {
    return <Card className="mt-6 p-6">Loading analytics...</Card>;
  }

  return (
    <>
      <Card className="mt-6 overflow-hidden p-0">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-900 dark:bg-[#090E1A] flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {t("overview.title")}
          </h3>
          <Tooltip content={t("overview.tooltip")} showArrow={false}>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <Info width={18} />
            </span>
          </Tooltip>
        </div>

        {/* Dynamic Category Bars */}
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          {/* Category Bar 1: Follow Up vs Closed (Dynamic) */}
          <div>
            <CategoryBar
              values={[followUpValue, closedValue]}
              colors={["cyan", "blue"]}
              showLabels={false}
            />
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-50">
              <span className="font-semibold">{followUpValue}</span>{" "}
              {t("overview.followUpPlanned")}
            </p>
          </div>
          {/* Category Bar 2: Pending vs Validated (Dynamic) */}
          <div>
            <CategoryBar
              values={[pendingValue, validatedValue]}
              colors={["cyan", "blue"]}
              showLabels={false}
            />
            <p className="mt-2 text-sm text-gray-900 dark:text-gray-50">
              <span className="font-semibold">{pendingValue}</span>{" "}
              {t("overview.pendingDiagnostics")}
            </p>
          </div>
        </div>

        {/* Dynamic List Items */}
        <ul className="grid grid-cols-2 gap-px border-t border-gray-200 bg-gray-200 md:grid-cols-4 dark:border-gray-900 dark:bg-gray-900">
          {analyticData.map((item) => (
            <Tooltip key={item.name} content={item.tooltip} showArrow={false}>
              <li className="flex flex-col items-center justify-center bg-white p-3 dark:bg-[#090E1A] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                <div className="flex items-center space-x-1">
                  <item.icon
                    className={cx(item.iconColor, "size-5")}
                    aria-hidden={true}
                  />
                  <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {item.value}
                  </span>
                </div>
                <span className="text-sm text-gray-900 dark:text-gray-50">
                  {item.name}
                </span>
              </li>
            </Tooltip>
          ))}
        </ul>
      </Card>

      <Divider className="my-10">{t("advancedStats")}</Divider>

      <div >

        {/* Dynamic Appointments Stats (Replacing Diseases Chart) */}
        {/* <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900 dark:text-gray-50">
            Appointments Statistics
          </h4>
          <Tooltip content={t("diseases.tooltip")} showArrow={false}>
            <Info width={18} className="text-gray-500 dark:text-gray-400" />
          </Tooltip>
        </div> */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <h5 className="mt-6 text-sm font-medium text-gray-900 dark:text-gray-50">
              Appointments by Service
            </h5>
            <div dir="ltr">
              <BarChart
                data={serviceChartData}
                index="service"
                categories={["Appointments"]}
                colors={["amber"]}
                showLegend={false}
                layout="vertical"
                yAxisWidth={120}
                className="mt-4 h-48"
              />
            </div>
          </Card>
          <Card>
            <h5 className="mt-8 text-sm font-medium text-gray-900 dark:text-gray-50">
              Appointments by Department
            </h5>
            <div dir="ltr">
              <BarChart
                data={departmentChartData}
                index="department"
                categories={["Appointments"]}
                colors={["cyan"]}
                showLegend={false}
                layout="vertical"
                yAxisWidth={120}
                className="mt-4 h-48"
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}