export const NUMBER = new Intl.NumberFormat("en-US");
export const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCompactPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value}%`;
}

export function normalizeNumericValue(value: unknown) {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatRevenueTooltip(value: unknown) {
  return [CURRENCY.format(normalizeNumericValue(value)), "Revenue"] as const;
}

export function formatCountTooltip(value: unknown, label: string) {
  return [NUMBER.format(normalizeNumericValue(value)), label] as const;
}

export function formatPercentTooltip(value: unknown, label: string) {
  return [`${normalizeNumericValue(value)}%`, label] as const;
}

export function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function buildAnnualActivity() {
  const cells: { week: number; day: number; count: number }[] = [];
  for (let week = 0; week < 53; week += 1) {
    for (let day = 0; day < 7; day += 1) {
      const count = Math.floor((Math.sin((week + day) * 0.5) + 1) * 4 + (week % 6));
      cells.push({ week, day, count: Math.max(0, count) });
    }
  }
  return cells;
}
