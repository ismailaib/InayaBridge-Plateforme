"use client";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Checkbox } from "@/components/Checkbox";
import { Divider } from "@/components/Divider";
import { Input } from "@/components/Input";
import { useEffect, useState } from "react";

import { getSocialHistoryByPatient, saveSocialHistory, SocialHistoryDTO } from "@/api/medic/SocialHistory";
import { showToast } from "@/app/[locale]/(protected)/dashboard/hooks/utils";
import LoadingState from "@/components/custom/LoadingState";

export default function SocialHistory({ patientId }: { patientId: string }) {
  const [data, setData] = useState<SocialHistoryDTO>({
    smoking: false,
    alcohol: false,
    drugs: false,
    diet: "",
    exercise: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing social history
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: res } = await getSocialHistoryByPatient(patientId);
      setData({
        smoking: res.smoking,
        alcohol: res.alcohol,
        drugs: res.drugs,
        diet: res.diet || "",
        exercise: res.exercise || "",
      });
    } catch (err) {
      console.error("Failed to fetch social history:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (patientId) fetchData();
  }, [patientId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSocialHistory(patientId, data);
      await fetchData();
      showToast("success", "Succès", "Social history saved successfully")
    } catch (err) {
      console.error("Failed to save social history:", err);
    }
    setSaving(false);
  };

  if (loading) return <LoadingState />;

  return (
    <Card className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">Social History</h3>
      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <Checkbox
            checked={data.smoking}
            onCheckedChange={(v) => setData((p) => ({ ...p, smoking: v as boolean }))}
          />
          <span>Smoking</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <Checkbox
            checked={data.alcohol}
            onCheckedChange={(v) => setData((p) => ({ ...p, alcohol: v as boolean }))}
          />
          <span>Alcohol</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <Checkbox
            checked={data.drugs}
            onCheckedChange={(v) => setData((p) => ({ ...p, drugs: v as boolean }))}
          />
          <span>Drugs</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Diet</label>
          <Input
            value={data.diet}
            onChange={(e) => setData((p) => ({ ...p, diet: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Exercise</label>
          <Input
            value={data.exercise}
            onChange={(e) => setData((p) => ({ ...p, exercise: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </Card>
  );
}
