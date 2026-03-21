import {
  ReportHistoryEntry,
  ReportMetric,
  ReportType,
  SavedReport,
  ScheduledReport,
} from "@/types/reportsDashboardTypes";

export const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  sessions: "Sessions",
  revenue: "Revenue",
  clients: "Clients",
  therapists: "Therapists",
  cancellations: "Cancellations",
  goals: "Goals",
};

export const METRIC_LABEL: Record<ReportMetric, string> = {
  totalSessions: "Total Sessions",
  completedSessions: "Completed Sessions",
  cancelledSessions: "Cancelled Sessions",
  noShowSessions: "No-show Sessions",
  totalRevenue: "Total Revenue",
  avgRevenue: "Avg Revenue",
  totalClients: "Total Clients",
  newClients: "New Clients",
  returningClients: "Returning Clients",
  retentionRate: "Retention Rate",
  avgSessionDuration: "Avg Duration",
  completionRate: "Completion Rate",
};

export const METRICS_BY_TYPE: Record<ReportType, ReportMetric[]> = {
  sessions: [
    "totalSessions",
    "completedSessions",
    "cancelledSessions",
    "noShowSessions",
    "avgSessionDuration",
    "completionRate",
  ],
  revenue: ["totalRevenue", "avgRevenue"],
  clients: ["totalClients", "newClients", "returningClients", "retentionRate"],
  therapists: ["totalSessions", "completionRate", "totalRevenue", "avgSessionDuration"],
  cancellations: ["cancelledSessions", "noShowSessions"],
  goals: ["completionRate"],
};

export const INITIAL_SAVED_REPORTS: SavedReport[] = [
  {
    id: "sr-1",
    name: "Monthly Revenue & Attendance",
    type: "revenue",
    filters: { type: "revenue", from: "2026-01-01", to: "2026-12-31", therapistId: "All", status: "Completed" },
    metrics: ["totalRevenue", "avgRevenue", "completionRate"],
    isPinned: true,
    shareToken: "9Vq2Aabx",
    createdAt: "2026-02-09",
    createdBy: "Ava Carter",
  },
  {
    id: "sr-2",
    name: "Session Quality Weekly",
    type: "sessions",
    filters: { type: "sessions", from: "2026-03-01", to: "2026-03-31", therapistId: "All", status: "Completed" },
    metrics: ["totalSessions", "completedSessions", "noShowSessions", "completionRate"],
    isPinned: false,
    shareToken: null,
    createdAt: "2026-03-03",
    createdBy: "Liam North",
  },
  {
    id: "sr-3",
    name: "Client Retention Insights",
    type: "clients",
    filters: { type: "clients", from: "2026-01-01", to: "2026-06-30", therapistId: "All" },
    metrics: ["totalClients", "newClients", "returningClients", "retentionRate"],
    isPinned: true,
    shareToken: null,
    createdAt: "2026-01-17",
    createdBy: "Noah Wells",
  },
];

export const INITIAL_SCHEDULES: ScheduledReport[] = [
  {
    id: "sch-1",
    name: "Monthly Revenue Digest",
    type: "revenue",
    filters: { type: "revenue", from: "2026-01-01", to: "2026-12-31" },
    frequency: "monthly",
    recipients: ["admin@clinic.com", "finance@clinic.com"],
    exportFormat: "pdf",
    nextRunAt: "2026-04-01",
    lastRunAt: "2026-03-01",
    isEnabled: true,
  },
  {
    id: "sch-2",
    name: "Weekly Completion Summary",
    type: "sessions",
    filters: { type: "sessions", from: "2026-03-01", to: "2026-03-31" },
    frequency: "weekly",
    recipients: ["ops@clinic.com"],
    exportFormat: "excel",
    nextRunAt: "2026-03-25",
    lastRunAt: "2026-03-18",
    isEnabled: false,
  },
];

export const INITIAL_HISTORY: ReportHistoryEntry[] = [
  {
    id: "h-1",
    type: "revenue",
    filters: { type: "revenue", from: "2026-01-01", to: "2026-01-31" },
    generatedAt: "2026-02-01T10:30:00",
    generatedBy: "Ava Carter",
    exportFormat: "pdf",
  },
  {
    id: "h-2",
    type: "sessions",
    filters: { type: "sessions", from: "2026-02-01", to: "2026-02-28" },
    generatedAt: "2026-03-01T11:12:00",
    generatedBy: "Noah Wells",
    exportFormat: "excel",
  },
  {
    id: "h-3",
    type: "clients",
    filters: { type: "clients", from: "2026-01-01", to: "2026-03-15" },
    generatedAt: "2026-03-16T08:52:00",
    generatedBy: "Liam North",
    exportFormat: null,
  },
];
