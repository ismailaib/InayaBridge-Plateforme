"use client";

import { AreaChart } from "@/components/AreaChart";
import { Card } from "@/components/Card";
import { Tooltip } from "@/components/Tooltip";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { Info } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { getMonthlyRevenue, DailyRevenueDto } from "@/api/dashboard";

interface DoctorRevenueChartProps {
    doctorId: string;
    month: number; // 1–12
    year: number;
}

export default function DoctorRevenueChart({ doctorId, month, year }: DoctorRevenueChartProps) {
    const t = useTranslations("dashboard.doctorRevenueChart");

    const [revenueData, setRevenueData] = useState<DailyRevenueDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const today = useMemo(() => new Date(), []);

    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;

    useEffect(() => {
        const fetchRevenue = async () => {
            setIsLoading(true);
            try {
                const response = await getMonthlyRevenue(doctorId, month, year);
                setRevenueData(response.data.days ?? []);
            } catch (error) {
                console.error("Failed to fetch monthly revenue:", error);
                setRevenueData([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (doctorId && month && year) {
            fetchRevenue();
        }
    }, [doctorId, month, year]);

    const filteredData = useMemo(() => {
        if (!isCurrentMonth) return revenueData;

        const currentDay = today.getDate(); 

        return revenueData.filter((day) => {
            const dayNum = parseInt(day.date.split("-")[2], 10);
            return dayNum <= currentDay;
        });
    }, [revenueData, isCurrentMonth, today]);

    const chartData = useMemo(() => {
        const revenueLabel = t("chart.revenueLabel") || "Total Revenue";

        return filteredData.map((day) => ({
            date: day.date,
            [revenueLabel]: day.totalAmount,
        }));
    }, [filteredData, t]);

    const totalRevenue = useMemo(
        () => filteredData.reduce((sum, day) => sum + day.totalAmount, 0),
        [filteredData]
    );

    if (isLoading) {
        return (
            <Card className="mt-6 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
                    {t("title") || "Monthly Revenue Evolution"}
                </h2>
                <p className="text-sm text-gray-500">Loading revenue data...</p>
            </Card>
        );
    }

    const revenueCategory = [t("chart.revenueLabel") || "Total Revenue"];

    return (
        <Card className="mt-6 overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-900">
                <h1 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {t("title") || "Monthly Revenue Evolution"}
                    {isCurrentMonth && (
                        <span className="ml-2 text-xs text-gray-500">
                            (up to today)
                        </span>
                    )}
                </h1>
                <Tooltip content={t("tooltip")} showArrow={false}>
                    <Info width={18} className="text-gray-500 dark:text-gray-400" />
                </Tooltip>
            </div>

            <div className="p-4">
                <p className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                    {totalRevenue.toLocaleString(undefined, {
                        style: "currency",
                        currency: "MAD",
                        minimumFractionDigits: 0,
                    })}
                </p>
                <p className="text-sm/6 text-gray-500 dark:text-gray-500">
                    {isCurrentMonth
                        ? t("totalLabelCurrent") || "Revenue so far this month"
                        : t("totalLabel") || "Total Revenue for the month"}
                </p>

                <div className="mt-6">
                    <AreaChart
                        data={chartData}
                        index="date"
                        categories={revenueCategory}
                        colors={["money"]}
                        fill="solid"
                        valueFormatter={(v) =>
                            v.toLocaleString(undefined, {
                                style: "currency",
                                currency: "MAD",
                                minimumFractionDigits: 0,
                            })
                        }
                        onValueChange={() => {}}
                        tickGap={10}
                        className="h-60"
                    />
                </div>
            </div>
        </Card>
    );
}