"use client";

import {
  getLatestMeasurement,
  getMeasurementsByPatient,
  Measurement,
  requestMeasurement,
} from "@/api/measurements";
import { AreaChart } from "@/components/AreaChart";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Activity, Heart, MonitorX, ScanHeart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "../Card";

interface Props {
  patientId: string;
}

export default function HeartFailureForm({ patientId }: Props) {
  const [latest, setLatest] = useState<Measurement | null>(null);
  const [history, setHistory] = useState<Measurement[]>([]);
  const [monitoring, setMonitoring] = useState(false);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const progressRef = useRef<number | null>(null);
  const DURATION = 30;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchLatest = async () => {
    const res = await getLatestMeasurement(patientId);
    const newMeasurement = res.data;
    setLatest(newMeasurement);

    setHistory((prev) => {
      const newList = [newMeasurement, ...prev.filter(m => m.id !== newMeasurement.id)];
      return newList.slice(0, 20);
    });
  };

  const fetchHistory = async () => {
    const res = await getMeasurementsByPatient(patientId);
    setHistory(res.data.slice(0, 20));
  };

  const startMonitor = async () => {
    await requestMeasurement(patientId);
    setMonitoring(true);
    setProgress(0);

    intervalRef.current = window.setInterval(fetchLatest, 1500);

    let seconds = 0;
    progressRef.current = window.setInterval(() => {
      seconds += 0.1;
      setProgress((seconds / DURATION) * 100);
      if (seconds >= DURATION) stopMonitor();
    }, 100);
  };

  const stopMonitor = () => {
    setMonitoring(false);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (progressRef.current) window.clearInterval(progressRef.current);
    setProgress(0);
  };

  const latestValue = latest || history[0] || null;

  const heartRateDuration = latestValue ? `${60 / latestValue.heartRate}s` : '1s';

  const chartData = history
    .slice()
    .reverse()
    .map(m => ({
      date: new Date(m.createdAt).toLocaleTimeString(),
      HeartRate: m.heartRate,
      SpO2: m.spo2,
    }));

  return (
    <div className="relative">
      {monitoring && (
        <>
          <div
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              animation: `pulse ${heartRateDuration} cubic-bezier(0.4, 0, 0.6, 1) infinite`
            }}
          />

          <div
            className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-40"
            style={{
              background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.2) 0%, transparent 100%)',
              animation: `pulse ${heartRateDuration} cubic-bezier(0.4, 0, 0.6, 1) infinite`
            }}
          />

          <div
            className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-40"
            style={{
              background: 'linear-gradient(to top, rgba(239, 68, 68, 0.2) 0%, transparent 100%)',
              animation: `pulse ${heartRateDuration} cubic-bezier(0.4, 0, 0.6, 1) infinite`
            }}
          />

          <div
            className="fixed top-0 bottom-0 left-0 w-32 pointer-events-none z-40"
            style={{
              background: 'linear-gradient(to right, rgba(239, 68, 68, 0.2) 0%, transparent 100%)',
              animation: `pulse ${heartRateDuration} cubic-bezier(0.4, 0, 0.6, 1) infinite`
            }}
          />

          <div
            className="fixed top-0 bottom-0 right-0 w-32 pointer-events-none z-40"
            style={{
              background: 'linear-gradient(to left, rgba(239, 68, 68, 0.2) 0%, transparent 100%)',
              animation: `pulse ${heartRateDuration} cubic-bezier(0.4, 0, 0.6, 1) infinite`
            }}
          />
        </>
      )}

      <div className="space-y-6 relative z-10">
        <div>
          <Label className="font-medium text-base">Live Heart Monitoring</Label>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Streaming real-time heart rate and SpO2 from device
          </p>
        </div>

        <Card className="p-4">
          <div className="text-center space-y-2">
            <div className="flex justify-center items-center gap-2 text-4xl font-bold">
              <Heart
                className="w-6 h-6 text-red-500"
                style={monitoring ? {
                  animation: `pulse ${heartRateDuration} cubic-bezier(0.4, 0, 0.6, 1) infinite`
                } : {}}
              />
              {latestValue ? `${latestValue.heartRate.toFixed(2)} bpm` : "—"}
            </div>
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mt-1">
              <Activity
                className="w-5 h-5 text-sky-400"
                style={monitoring ? {
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                } : {}}
              />
              {latestValue ? `SpO2: ${latestValue.spo2}%` : "Idle"}
            </div>

            {monitoring && (
              <div className="mt-3 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              onClick={monitoring ? stopMonitor : startMonitor}
              className="w-full"
            >

              {monitoring ? <MonitorX width={18} className="mr-2" /> : <ScanHeart width={18} className="mr-2" />}
              {monitoring ? "Stop Monitor" : "Start Monitor"}
            </Button>
          </div>
        </Card>

        {history.length > 0 && (
          <Card className="mt-6">
            <Label className="font-medium text-base">Latest Measurements</Label>
            <AreaChart
              className="h-80"
              data={chartData}
              index="date"
              categories={["HeartRate", "SpO2"]}
              colors={["red", "sky"]}
              valueFormatter={(v: number) => v.toFixed(2)}
            />
          </Card>
        )}
      </div>
    </div>
  );
}