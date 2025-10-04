'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Checkbox } from '@/components/Checkbox';
import { Plus } from 'lucide-react';

const Disponibility = () => {
  const [schedule, setSchedule] = useState([
    { day: 'Monday', enabled: true, from: '07:00', to: '19:00' },
    { day: 'Tuesday', enabled: true, from: '07:00', to: '19:00' },
    { day: 'Wednesday', enabled: true, from: '07:00', to: '19:00' },
    { day: 'Thursday', enabled: true, from: '07:00', to: '19:00' },
    { day: 'Friday', enabled: true, from: '07:00', to: '19:00' },
    { day: 'Saturday', enabled: true, from: '07:00', to: '19:00' },
    { day: 'Sunday', enabled: true, from: '07:00', to: '19:00' },
  ]);

  const handleToggle = (index: number) => {
    const updated = [...schedule];
    updated[index].enabled = !updated[index].enabled;
    setSchedule(updated);
  };

  const handleChange = (
    index: number,
    field: 'from' | 'to',
    value: string
  ) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleUpdate = () => {
    console.log('Schedule saved:', schedule);
    alert('Schedule updated!');
  };

  return (
    <div className="pt-4">

      <div className='pt-4'>
        <h2 className="font-semibold text-gray-900 dark:text-gray-50">
          Default Schedule
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
           Set your weekly availability.
        </p>
      </div>

      <Card className="mt-6 p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center font-semibold text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
          <div className="md:col-span-3">Availability</div>
          <div className="md:col-span-3">From</div>
          <div className="md:col-span-3">To</div>
          <div className="md:col-span-3 text-right pr-3">Actions</div>
        </div>

        <div className="space-y-4">
          {schedule.map((slot, index) => (
            <div
              key={slot.day}
              className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3"
            >
              {/* Day Checkbox */}
              <div className="md:col-span-3 flex items-center gap-2">
                <Checkbox
                  checked={slot.enabled}
                  onCheckedChange={() => handleToggle(index)}
                  id={`day-${slot.day}`}
                />
                <Label
                  htmlFor={`day-${slot.day}`}
                  className={`font-medium ${slot.enabled
                      ? 'text-gray-900 dark:text-gray-50'
                      : 'text-gray-400'
                    }`}
                >
                  {slot.day}
                </Label>
              </div>

              {/* From Time */}
              <div className="md:col-span-3">
                <Input
                  type="time"
                  value={slot.from}
                  onChange={(e) => handleChange(index, 'from', e.target.value)}
                  disabled={!slot.enabled}
                  className="w-full"
                />
              </div>

              {/* To Time */}
              <div className="md:col-span-3">
                <Input
                  type="time"
                  value={slot.to}
                  onChange={(e) => handleChange(index, 'to', e.target.value)}
                  disabled={!slot.enabled}
                  className="w-full"
                />
              </div>

              {/* Add Timeslot */}
              <div className="md:col-span-3 flex justify-end">
                <Button
                  variant="secondary"
                  className="flex items-center gap-1 px-3"
                  disabled={!slot.enabled}
                  onClick={() => alert(`Add timeslot for ${slot.day}`)}
                >
                  <Plus className="h-4 w-4" />
                  Timeslot
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="primary"
            onClick={handleUpdate}
            className="px-8 py-2 text-sm font-medium"
          >
            UPDATE
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Disponibility;
