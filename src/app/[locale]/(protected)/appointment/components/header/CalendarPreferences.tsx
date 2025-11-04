'use client';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { Switch } from '@/components/Switch';
import { CalendarCog } from 'lucide-react';

interface CalendarPreferencesProps {
  showUnavailableDays: boolean;
  showAddAppointment: boolean;
  onToggleUnavailableDays: () => void;
  onToggleAddAppointment: () => void;
  loading: boolean;
}

export const CalendarPreferences = ({
  showUnavailableDays,
  showAddAppointment,
  onToggleUnavailableDays,
  onToggleAddAppointment,
  loading,
}: CalendarPreferencesProps) => {
  return (
    <div className="flex justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" disabled={loading}>
            <CalendarCog width={18} />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-4 w-fit">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Switch
                size="small"
                id="showUnavailableDays"
                checked={showUnavailableDays}
                onCheckedChange={onToggleUnavailableDays}
              />
              <Label htmlFor="showUnavailableDays">Afficher les jours non disponibles</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                size="small"
                id="showAddAppointment"
                checked={showAddAppointment}
                onCheckedChange={onToggleAddAppointment}
              />
              <Label htmlFor="showAddAppointment">Afficher le bouton “Ajouter un rendez-vous”</Label>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};