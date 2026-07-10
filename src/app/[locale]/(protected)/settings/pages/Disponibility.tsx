"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Checkbox } from "@/components/Checkbox";
import { Plus, Trash2 } from "lucide-react";
import {
  getAvailabilitySlotsByDoctor,
  updateAvailabilitySlot,
} from "@/api/disponibility";
import { showToast } from "../../dashboard/hooks/utils";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider";
import { getDirection } from "@/lib/i18n/i18n";

interface TimeSlot {
  from: string;
  to: string;
}

interface AvailabilitySlot {
  id?: string;
  dayOfWeek: string;
  active: boolean;
  timeSlots: TimeSlot[];
}

const MAX_SLOTS_PER_DAY = 4;

const Disponibility = () => {
  const t = useTranslations("settings.disponibility");
  const { locale } = useTranslationsContext();
  const dir = getDirection(locale);

  const [schedule, setSchedule] = useState<AvailabilitySlot[]>([]);
  const [originalSchedule, setOriginalSchedule] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApplyToAll, setShowApplyToAll] = useState<number | null>(null);

  const doctorProfileId =
    JSON.parse(localStorage.getItem("user") || "{}")?.doctorProfile?.id || null;

  /* ---------------- Fetch Availability ---------------- */
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!doctorProfileId) return;
      try {
        const res = await getAvailabilitySlotsByDoctor(doctorProfileId);
        if (res.data && res.data.length > 0) {
          setSchedule(res.data);
          setOriginalSchedule(JSON.parse(JSON.stringify(res.data)));
        } else {
          const defaultSchedule = [
            { dayOfWeek: "MONDAY", active: true, timeSlots: [{ from: "07:00", to: "19:00" }] },
            { dayOfWeek: "TUESDAY", active: true, timeSlots: [{ from: "07:00", to: "19:00" }] },
            { dayOfWeek: "WEDNESDAY", active: true, timeSlots: [{ from: "07:00", to: "19:00" }] },
            { dayOfWeek: "THURSDAY", active: true, timeSlots: [{ from: "07:00", to: "19:00" }] },
            { dayOfWeek: "FRIDAY", active: true, timeSlots: [{ from: "07:00", to: "19:00" }] },
            { dayOfWeek: "SATURDAY", active: true, timeSlots: [{ from: "07:00", to: "19:00" }] },
            { dayOfWeek: "SUNDAY", active: true, timeSlots: [{ from: "07:00", to: "19:00" }] },
          ];
          setSchedule(defaultSchedule);
          setOriginalSchedule(JSON.parse(JSON.stringify(defaultSchedule)));
        }
      } catch (err) {
        console.error("❌ Error fetching availability:", err);
        showToast("error", t("errorTitle"), t("errorLoad"));
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [doctorProfileId]);

  /* ---------------- Helpers ---------------- */
  const getModifiedDays = () => {
    return schedule.filter((slot, index) => {
      const original = originalSchedule[index];
      if (!original) return true;
      const activeChanged = slot.active !== original.active;
      const timeSlotsChanged =
        JSON.stringify(slot.timeSlots) !== JSON.stringify(original.timeSlots);
      return activeChanged || timeSlotsChanged;
    });
  };

  const handleToggle = (index: number) => {
    const updated = [...schedule];
    updated[index].active = !updated[index].active;
    setSchedule(updated);
    setShowApplyToAll(index);
  };

  const handleTimeSlotChange = (
    dayIndex: number,
    slotIndex: number,
    field: "from" | "to",
    value: string
  ) => {
    const updated = [...schedule];
    if (!updated[dayIndex].timeSlots[slotIndex]) {
      updated[dayIndex].timeSlots[slotIndex] = { from: "", to: "" };
    }
    updated[dayIndex].timeSlots[slotIndex][field] = value;
    setSchedule(updated);
    setShowApplyToAll(dayIndex);
  };

  const addTimeSlot = (dayIndex: number) => {
    const updated = [...schedule];
    const slots = updated[dayIndex].timeSlots;

    if (slots.length >= MAX_SLOTS_PER_DAY) {
      showToast("error", t("errorTitle"), t("errorMaxSlots", { count: MAX_SLOTS_PER_DAY }));
      return;
    }

    const lastSlot = slots[slots.length - 1];
    updated[dayIndex].timeSlots.push({
      from: lastSlot?.to || "07:00",
      to: "19:00",
    });
    setSchedule(updated);
    setShowApplyToAll(dayIndex);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updated = [...schedule];
    if (updated[dayIndex].timeSlots.length > 1) {
      updated[dayIndex].timeSlots.splice(slotIndex, 1);
      setSchedule(updated);
      setShowApplyToAll(dayIndex);
    } else {
      showToast("error", t("errorTitle"), t("errorAtLeastOneSlot"));
    }
  };

  const applyToAllDays = (sourceDayIndex: number) => {
    const sourceDay = schedule[sourceDayIndex];
    const updated = schedule.map((day) => ({
      ...day,
      active: sourceDay.active,
      timeSlots: JSON.parse(JSON.stringify(sourceDay.timeSlots)),
    }));
    setSchedule(updated);
    setShowApplyToAll(null);
    showToast("success", t("successTitle"), t("successApplied"));
  };

  const handleUpdate = async () => {
    if (!doctorProfileId) return;
    const modifiedDays = getModifiedDays();
    if (modifiedDays.length === 0) {
      showToast("success", t("infoTitle"), t("noChanges"));
      return;
    }

    try {
      setSaving(true);
      for (const slot of modifiedDays) {
        await updateAvailabilitySlot(doctorProfileId, slot.dayOfWeek, {
          active: slot.active,
          timeSlots: slot.timeSlots,
        });
      }
      setOriginalSchedule(JSON.parse(JSON.stringify(schedule)));
      showToast("success", t("successTitle"), t("successUpdated", { count: modifiedDays.length }));
    } catch (err) {
      console.error("❌ Error updating schedule:", err);
      showToast("error", t("errorTitle"), t("errorSave"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-gray-500">{t("loading")}</p>
      </Card>
    );
  }

  const modifiedCount = getModifiedDays().length;

  return (
    <div className="pt-4" dir={dir}>
      <div className="pt-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-50">{t("title")}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          {t("description")}{" "}
          {modifiedCount > 0 && (
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              ({modifiedCount} {t("unsavedChanges")})
            </span>
          )}
        </p>
      </div>

      <Card className="mt-6 p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center font-semibold text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
          <div className="md:col-span-3">{t("availability")}</div>
          <div className="md:col-span-3">{t("from")}</div>
          <div className="md:col-span-3">{t("to")}</div>
          <div className="md:col-span-3 text-right pr-3">{t("actions")}</div>
        </div>

        <div className="space-y-4">
          {schedule.map((slot, dayIndex) => (
            <div key={slot.dayOfWeek}>
              {slot.timeSlots.map((timeSlot, slotIndex) => (
                <div
                  key={`${slot.dayOfWeek}-${slotIndex}`}
                  className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3 mb-3"
                >
                  <div className="md:col-span-3 flex items-center gap-2">
                    {slotIndex === 0 ? (
                      <>
                        <Checkbox
                          checked={slot.active}
                          onCheckedChange={() => handleToggle(dayIndex)}
                          id={`day-${slot.dayOfWeek}`}
                        />
                        <Label
                          htmlFor={`day-${slot.dayOfWeek}`}
                          className={`font-medium ${
                            slot.active
                              ? "text-gray-900 dark:text-gray-50"
                              : "text-gray-400"
                          }`}
                        >
                          {t(slot.dayOfWeek.toLowerCase())}
                        </Label>
                        {showApplyToAll === dayIndex && (
                          <button
                            onClick={() => applyToAllDays(dayIndex)}
                            className="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {t("applyToAll")}
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="pl-8"></div>
                    )}
                  </div>

                  <div className="md:col-span-3">
                    <Input
                      type="time"
                      value={timeSlot.from}
                      onChange={(e) =>
                        handleTimeSlotChange(dayIndex, slotIndex, "from", e.target.value)
                      }
                      disabled={!slot.active}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Input
                      type="time"
                      value={timeSlot.to}
                      onChange={(e) =>
                        handleTimeSlotChange(dayIndex, slotIndex, "to", e.target.value)
                      }
                      disabled={!slot.active}
                    />
                  </div>

                  <div className="md:col-span-3 flex justify-end gap-2">
                    {slotIndex === 0 && (
                      <Button
                        variant="secondary"
                        disabled={!slot.active}
                        onClick={() => addTimeSlot(dayIndex)}
                      >
                        <Plus className="h-4 w-4" />
                        {t("timeslot")}
                      </Button>
                    )}
                    {slot.timeSlots.length > 1 && (
                      <Button
                        variant="ghost"
                        disabled={!slot.active}
                        onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={saving || modifiedCount === 0}
          >
            {saving ? t("saving") : t("update")}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Disponibility;
