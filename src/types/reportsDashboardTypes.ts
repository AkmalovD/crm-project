export type ReportPageTab = "saved" | "builder" | "comparison" | "schedules" | "history";
export type ReportType = "sessions" | "revenue" | "clients" | "therapists" | "cancellations" | "goals";
export type ExportFormat = "pdf" | "excel" | "csv";
export type ScheduleFrequency = "daily" | "weekly" | "monthly";
export type ReportMetric =
  | "totalSessions"
  | "completedSessions"
  | "cancelledSessions"
  | "noShowSessions"
  | "totalRevenue"
  | "avgRevenue"
  | "totalClients"
  | "newClients"
  | "returningClients"
  | "retentionRate"
  | "avgSessionDuration"
  | "completionRate";

export interface ReportFilters {
  type: ReportType;
  from: string;
  to: string;
  therapistId?: string;
  status?: string;
}

export interface SavedReport {
  id: string;
  name: string;
  type: ReportType;
  filters: ReportFilters;
  metrics: ReportMetric[];
  isPinned: boolean;
  shareToken: string | null;
  createdAt: string;
  createdBy: string;
}

export interface ReportHistoryEntry {
  id: string;
  type: ReportType;
  filters: ReportFilters;
  generatedAt: string;
  generatedBy: string;
  exportFormat: ExportFormat | null;
}

export interface ScheduledReport {
  id: string;
  name: string;
  type: ReportType;
  filters: ReportFilters;
  frequency: ScheduleFrequency;
  recipients: string[];
  exportFormat: ExportFormat;
  nextRunAt: string;
  lastRunAt: string | null;
  isEnabled: boolean;
}
