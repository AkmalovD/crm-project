export type AnalyticsTab = "Overview" | "Sessions" | "Revenue" | "Clients" | "Therapists";

export type SeriesToggle = "Sessions" | "Revenue" | "Both";

export type TherapistSortBy = "name" | "sessions" | "revenue" | "completion";

export interface KpiItem {
  label: string;
  value: number;
  trend: number;
  suffix: string;
  spark: readonly number[];
  valueSuffix?: string;
}

export interface MonthlyOverviewItem {
  month: string;
  sessions: number;
  revenue: number;
  newClients: number;
  returningClients: number;
}

export interface TherapistItem {
  name: string;
  specialization: string;
  sessions: number;
  completed: number;
  cancelled: number;
  noShow: number;
  revenue: number;
  avgDuration: number;
  status: "Active" | "On Leave";
}
