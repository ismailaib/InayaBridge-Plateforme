'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Checkbox } from '@/components/Checkbox';
import { Plus, Trash2 } from 'lucide-react';
import {
  getAvailabilitySlotsByDoctor,
  updateAvailabilitySlot,
} from '@/api/availability';
import { showToast } from '../../dashboard/hooks/utils';

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

const Disponibility = () => {
  const [schedule, setSchedule] = useState<AvailabilitySlot[]>([]);
  const [originalSchedule, setOriginalSchedule] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApplyToAll, setShowApplyToAll] = useState<number | null>(null);

  const doctorProfileId =
    JSON.parse(localStorage.getItem('user') || '{}')?.doctorProfile?.id || null;

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
            { dayOfWeek: 'MONDAY', active: true, timeSlots: [{ from: '07:00', to: '19:00' }] },
            { dayOfWeek: 'TUESDAY', active: true, timeSlots: [{ from: '07:00', to: '19:00' }] },
            { dayOfWeek: 'WEDNESDAY', active: true, timeSlots: [{ from: '07:00', to: '19:00' }] },
            { dayOfWeek: 'THURSDAY', active: true, timeSlots: [{ from: '07:00', to: '19:00' }] },
            { dayOfWeek: 'FRIDAY', active: true, timeSlots: [{ from: '07:00', to: '19:00' }] },
            { dayOfWeek: 'SATURDAY', active: true, timeSlots: [{ from: '07:00', to: '19:00' }] },
            { dayOfWeek: 'SUNDAY', active: true, timeSlots: [{ from: '07:00', to: '19:00' }] },
          ];
          setSchedule(defaultSchedule);
          setOriginalSchedule(JSON.parse(JSON.stringify(defaultSchedule)));
        }
      } catch (err) {
        console.error('❌ Error fetching availability:', err);
        showToast('error', 'Error', 'Failed to load availability schedule');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [doctorProfileId]);

  /* ---------------- Helper: Detect Changed Days ---------------- */
  const getModifiedDays = () => {
    return schedule.filter((slot, index) => {
      const original = originalSchedule[index];
      if (!original) return true;

      const activeChanged = slot.active !== original.active;
      const timeSlotsChanged = JSON.stringify(slot.timeSlots) !== JSON.stringify(original.timeSlots);
      
      return activeChanged || timeSlotsChanged;
    });
  };

  /* ---------------- Handle Local Changes ---------------- */

  const handleToggle = (index: number) => {
    const updated = [...schedule];
    updated[index].active = !updated[index].active;
    setSchedule(updated);
    setShowApplyToAll(index);
  };

  const handleTimeSlotChange = (
    dayIndex: number,
    slotIndex: number,
    field: 'from' | 'to',
    value: string
  ) => {
    const updated = [...schedule];
    if (!updated[dayIndex].timeSlots[slotIndex]) {
      updated[dayIndex].timeSlots[slotIndex] = { from: '', to: '' };
    }
    updated[dayIndex].timeSlots[slotIndex][field] = value;
    setSchedule(updated);
    setShowApplyToAll(dayIndex);
  };

  const addTimeSlot = (dayIndex: number) => {
    const updated = [...schedule];
    const lastSlot = updated[dayIndex].timeSlots[updated[dayIndex].timeSlots.length - 1];
    const newFrom = lastSlot?.to || '07:00';
    const newTo = '19:00';
    
    updated[dayIndex].timeSlots.push({ from: newFrom, to: newTo });
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
      showToast('error', 'Error', 'At least one time slot is required');
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
    showToast('success', 'Applied', 'Schedule applied to all days');
  };

  /* ---------------- Save Changes (Only Modified Days) ---------------- */
  const handleUpdate = async () => {
    if (!doctorProfileId) return;

    const modifiedDays = getModifiedDays();

    if (modifiedDays.length === 0) {
      showToast('success', 'Info', 'No changes to save');
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

      // Update original schedule after successful save
      setOriginalSchedule(JSON.parse(JSON.stringify(schedule)));
      
      showToast(
        'success',
        'Success',
        `Updated ${modifiedDays.length} day${modifiedDays.length > 1 ? 's' : ''}`
      );
    } catch (err) {
      console.error('❌ Error updating schedule:', err);
      showToast('error', 'Error', 'Failed to update schedule');
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-gray-500">Loading availability...</p>
      </Card>
    );
  }

  const modifiedCount = getModifiedDays().length;

  return (
    <div className="pt-4">
      <div className="pt-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-50">
          Default Schedule
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          Set your weekly availability. {modifiedCount > 0 && (
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              ({modifiedCount} unsaved change{modifiedCount > 1 ? 's' : ''})
            </span>
          )}
        </p>
      </div>

      <Card className="mt-8 p-6 overflow-x-auto">
        {/* Table Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center font-semibold text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
          <div className="md:col-span-3">Availability</div>
          <div className="md:col-span-3">From</div>
          <div className="md:col-span-3">To</div>
          <div className="md:col-span-3 text-right pr-3">Actions</div>
        </div>

        {/* Rows */}
        <div className="space-y-4">
          {schedule.map((slot, dayIndex) => (
            <div key={slot.dayOfWeek}>
              {slot.timeSlots.map((timeSlot, slotIndex) => (
                <div
                  key={`${slot.dayOfWeek}-${slotIndex}`}
                  className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3 mb-3"
                >
                  {/* Day Checkbox - Only show on first slot */}
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
                              ? 'text-gray-900 dark:text-gray-50'
                              : 'text-gray-400'
                          }`}
                        >
                          {slot.dayOfWeek.charAt(0) + slot.dayOfWeek.slice(1).toLowerCase()}
                        </Label>
                        {showApplyToAll === dayIndex && (
                          <button
                            onClick={() => applyToAllDays(dayIndex)}
                            className="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Apply to all days
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="pl-8"></div>
                    )}
                  </div>

                  {/* From Time */}
                  <div className="md:col-span-3">
                    <Input
                      type="time"
                      value={timeSlot.from}
                      onChange={(e) =>
                        handleTimeSlotChange(dayIndex, slotIndex, 'from', e.target.value)
                      }
                      disabled={!slot.active}
                      className="w-full"
                    />
                  </div>

                  {/* To Time */}
                  <div className="md:col-span-3">
                    <Input
                      type="time"
                      value={timeSlot.to}
                      onChange={(e) =>
                        handleTimeSlotChange(dayIndex, slotIndex, 'to', e.target.value)
                      }
                      disabled={!slot.active}
                      className="w-full"
                    />
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-3 flex justify-end gap-2">
                    {slotIndex === 0 && (
                      <Button
                        variant="secondary"
                        className="flex items-center gap-1 px-3"
                        disabled={!slot.active}
                        onClick={() => addTimeSlot(dayIndex)}
                      >
                        <Plus className="h-4 w-4" />
                        Timeslot
                      </Button>
                    )}
                    {slot.timeSlots.length > 1 && (
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-2"
                        disabled={!slot.active}
                        onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Update Button */}
        <div className="flex justify-end mt-6">
          <Button
            variant="primary"
            onClick={handleUpdate}
            className="px-8 py-2 text-sm font-medium"
            disabled={saving || modifiedCount === 0}
          >
            {saving ? 'Saving...' : 'UPDATE'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Disponibility;