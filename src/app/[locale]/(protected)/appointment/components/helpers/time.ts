export function parseTime(value: string | null) {
  if (value == null) {
    return null;
  }
  const [hoursStr, minutesStr] = value.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return { hours, minutes };
}

export function isTimeWithinRange(
  start: { hours: number; minutes: number },
  end: { hours: number; minutes: number },
  target: { hours: number; minutes: number },
) {
  const toMinutes = ({ hours, minutes }: { hours: number; minutes: number }) =>
    hours * 60 + minutes;

  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  const targetMinutes = toMinutes(target);

  return targetMinutes >= startMinutes && targetMinutes < endMinutes;
}

