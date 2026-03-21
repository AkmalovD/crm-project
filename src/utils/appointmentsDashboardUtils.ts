import { ActiveView, Appointment } from "@/types/appointmentsDashboardTypes";

const DAY_MS = 24 * 60 * 60 * 1000;

export const NUMBER = new Intl.NumberFormat("en-US");
export const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function parseDateOnly(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function addDays(date: Date, amount: number) {
  return new Date(date.getTime() + amount * DAY_MS);
}

export function formatDateLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function weekStart(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(copy, diff);
}

export function buildRangeDates(selectedDate: Date, activeView: ActiveView) {
  if (activeView === "day" || activeView === "agenda") return [selectedDate];
  if (activeView === "week") {
    const start = weekStart(selectedDate);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const start = weekStart(monthStart);
  const days: Date[] = [];
  for (
    let cursor = start;
    cursor <= monthEnd || days.length % 7 !== 0 || days.length < 35;
    cursor = addDays(cursor, 1)
  ) {
    days.push(cursor);
    if (days.length >= 42 && cursor > monthEnd && cursor.getDay() === 0) break;
  }
  return days;
}

export function sortByDateTime(appointments: Appointment[]) {
  return [...appointments].sort((left, right) =>
    `${left.date}T${left.startTime}`.localeCompare(`${right.date}T${right.startTime}`),
  );
}

export function calcEndTime(startTime: string, duration: number) {
  const [hour, minute] = startTime.split(":").map((value) => Number(value));
  const total = hour * 60 + minute + duration;
  const nextHour = Math.floor(total / 60) % 24;
  const nextMinute = total % 60;
  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
}
