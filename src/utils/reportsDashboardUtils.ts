import { ReportMetric, ReportType } from "@/types/reportsDashboardTypes";

export function fmtDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDateTime(date: string) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function createToken() {
  return Math.random().toString(36).slice(2, 10);
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function metricPreviewValue(metric: ReportMetric, type: ReportType) {
  const seed = `${type}:${metric}`.split("").reduce((total, ch) => total + ch.charCodeAt(0), 0);
  return 500 + ((seed * 17) % 2000);
}

export function generateBuilderPreview(selectedType: ReportType) {
  return [
    { name: "Jan", valueA: 89, valueB: selectedType === "revenue" ? 125 : 94 },
    { name: "Feb", valueA: 94, valueB: selectedType === "revenue" ? 133 : 99 },
    { name: "Mar", valueA: 102, valueB: selectedType === "revenue" ? 146 : 106 },
    { name: "Apr", valueA: 108, valueB: selectedType === "revenue" ? 159 : 112 },
    { name: "May", valueA: 113, valueB: selectedType === "revenue" ? 166 : 118 },
  ];
}
