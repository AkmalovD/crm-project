"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  FileClock,
  GitCompare,
  History,
  MoreHorizontal,
  Pin,
  PinOff,
  Play,
  Plus,
  Save,
  Share2,
  Trash2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import styles from "./ReportsDashboardPage.module.css";

type ReportPageTab = "saved" | "builder" | "comparison" | "schedules" | "history";
type ReportType = "sessions" | "revenue" | "clients" | "therapists" | "cancellations" | "goals";
type ExportFormat = "pdf" | "excel" | "csv";
type ScheduleFrequency = "daily" | "weekly" | "monthly";
type ReportMetric =
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

interface ReportFilters {
  type: ReportType;
  from: string;
  to: string;
  therapistId?: string;
  status?: string;
}

interface SavedReport {
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

interface ReportHistoryEntry {
  id: string;
  type: ReportType;
  filters: ReportFilters;
  generatedAt: string;
  generatedBy: string;
  exportFormat: ExportFormat | null;
}

interface ScheduledReport {
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

const TABS: Array<{ id: ReportPageTab; label: string; icon: ReactNode }> = [
  { id: "saved", label: "Saved Reports", icon: <Save size={14} /> },
  { id: "builder", label: "Custom Builder", icon: <BadgeCheck size={14} /> },
  { id: "comparison", label: "Comparison", icon: <GitCompare size={14} /> },
  { id: "schedules", label: "Schedules", icon: <CalendarClock size={14} /> },
  { id: "history", label: "History", icon: <History size={14} /> },
];

const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  sessions: "Sessions",
  revenue: "Revenue",
  clients: "Clients",
  therapists: "Therapists",
  cancellations: "Cancellations",
  goals: "Goals",
};

const METRIC_LABEL: Record<ReportMetric, string> = {
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

const METRICS_BY_TYPE: Record<ReportType, ReportMetric[]> = {
  sessions: ["totalSessions", "completedSessions", "cancelledSessions", "noShowSessions", "avgSessionDuration", "completionRate"],
  revenue: ["totalRevenue", "avgRevenue"],
  clients: ["totalClients", "newClients", "returningClients", "retentionRate"],
  therapists: ["totalSessions", "completionRate", "totalRevenue", "avgSessionDuration"],
  cancellations: ["cancelledSessions", "noShowSessions"],
  goals: ["completionRate"],
};

const INITIAL_SAVED_REPORTS: SavedReport[] = [
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

const INITIAL_SCHEDULES: ScheduledReport[] = [
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

const INITIAL_HISTORY: ReportHistoryEntry[] = [
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

function fmtDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtDateTime(date: string) {
  return new Date(date).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function createToken() {
  return Math.random().toString(36).slice(2, 10);
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function metricPreviewValue(metric: ReportMetric, type: ReportType) {
  const seed = `${type}:${metric}`.split("").reduce((total, ch) => total + ch.charCodeAt(0), 0);
  return 500 + ((seed * 17) % 2000);
}

function generateBuilderPreview(selectedType: ReportType) {
  return [
    { name: "Jan", valueA: 89, valueB: selectedType === "revenue" ? 125 : 94 },
    { name: "Feb", valueA: 94, valueB: selectedType === "revenue" ? 133 : 99 },
    { name: "Mar", valueA: 102, valueB: selectedType === "revenue" ? 146 : 106 },
    { name: "Apr", valueA: 108, valueB: selectedType === "revenue" ? 159 : 112 },
    { name: "May", valueA: 113, valueB: selectedType === "revenue" ? 166 : 118 },
  ];
}

export function ReportsDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as ReportPageTab | null;
  const initialTab = tabFromUrl ?? "saved";
  const [activeTab, setActiveTab] = useState<ReportPageTab>(TABS.some((item) => item.id === initialTab) ? initialTab : "saved");

  const [savedReports, setSavedReports] = useState<SavedReport[]>(INITIAL_SAVED_REPORTS);
  const [schedules, setSchedules] = useState<ScheduledReport[]>(INITIAL_SCHEDULES);
  const [historyEntries] = useState<ReportHistoryEntry[]>(INITIAL_HISTORY);

  const [savedSearch, setSavedSearch] = useState("");
  const [savedTypeFilter, setSavedTypeFilter] = useState<"all" | ReportType>("all");

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const [builderType, setBuilderType] = useState<ReportType>("sessions");
  const [builderFrom, setBuilderFrom] = useState("2026-01-01");
  const [builderTo, setBuilderTo] = useState("2026-03-31");
  const [builderMetrics, setBuilderMetrics] = useState<ReportMetric[]>(METRICS_BY_TYPE.sessions.slice(0, 3));
  const [isBuilderRun, setIsBuilderRun] = useState(false);

  const [periodALabel, setPeriodALabel] = useState("Q1 2026");
  const [periodBLabel, setPeriodBLabel] = useState("Q1 2025");
  const [comparisonType, setComparisonType] = useState<ReportType>("sessions");
  const [isComparisonRun, setIsComparisonRun] = useState(false);

  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  const [saveName, setSaveName] = useState("");
  const [saveType, setSaveType] = useState<ReportType>("sessions");
  const [saveFrom, setSaveFrom] = useState("2026-01-01");
  const [saveTo, setSaveTo] = useState("2026-12-31");
  const [saveMetrics, setSaveMetrics] = useState<ReportMetric[]>(METRICS_BY_TYPE.sessions.slice(0, 2));

  const [scheduleName, setScheduleName] = useState("");
  const [scheduleType, setScheduleType] = useState<ReportType>("revenue");
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduleFrequency>("monthly");
  const [scheduleFormat, setScheduleFormat] = useState<ExportFormat>("pdf");
  const [scheduleRecipients, setScheduleRecipients] = useState("admin@clinic.com");

  const [historyTypeFilter, setHistoryTypeFilter] = useState<"all" | ReportType>("all");
  const [historyFormatFilter, setHistoryFormatFilter] = useState<"all" | ExportFormat>("all");
  const [historyPage, setHistoryPage] = useState(1);

  useEffect(() => {
    if (tabFromUrl === activeTab) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", activeTab);
    router.replace(`/reports?${next.toString()}`);
  }, [activeTab, router, searchParams, tabFromUrl]);

  const selectedReport = useMemo(() => savedReports.find((item) => item.id === selectedReportId) ?? null, [savedReports, selectedReportId]);

  const filteredSavedReports = useMemo(() => {
    return savedReports.filter((item) => {
      const bySearch = item.name.toLowerCase().includes(savedSearch.toLowerCase());
      const byType = savedTypeFilter === "all" ? true : item.type === savedTypeFilter;
      return bySearch && byType;
    });
  }, [savedReports, savedSearch, savedTypeFilter]);

  const pinnedReports = filteredSavedReports.filter((item) => item.isPinned);
  const nonPinnedReports = filteredSavedReports.filter((item) => !item.isPinned);
  const enabledSchedules = schedules.filter((item) => item.isEnabled).length;

  const comparisonRows = useMemo(
    () => [
      { metric: "Total Sessions", a: 1284, b: 1102 },
      { metric: "Completed Sessions", a: 1140, b: 980 },
      { metric: "Revenue", a: 24500, b: 19800 },
      { metric: "Completion Rate", a: 88, b: 89 },
      { metric: "Avg Duration", a: 48, b: 45 },
    ],
    [],
  );

  const comparisonChartData = useMemo(
    () =>
      comparisonRows.map((row) => ({
        name: row.metric,
        periodA: row.a,
        periodB: row.b,
      })),
    [comparisonRows],
  );

  const builderPreview = useMemo(() => generateBuilderPreview(builderType), [builderType]);

  const filteredHistory = useMemo(() => {
    return historyEntries.filter((entry) => {
      const byType = historyTypeFilter === "all" ? true : entry.type === historyTypeFilter;
      const byFormat = historyFormatFilter === "all" ? true : entry.exportFormat === historyFormatFilter;
      return byType && byFormat;
    });
  }, [historyEntries, historyTypeFilter, historyFormatFilter]);

  const historyPerPage = 5;
  const historyTotalPages = Math.max(1, Math.ceil(filteredHistory.length / historyPerPage));
  const historyRows = filteredHistory.slice((historyPage - 1) * historyPerPage, historyPage * historyPerPage);

  const handleMetricToggle = (metric: ReportMetric, source: "save" | "builder") => {
    if (source === "save") {
      setSaveMetrics((current) => (current.includes(metric) ? current.filter((item) => item !== metric) : [...current, metric]));
      return;
    }
    setBuilderMetrics((current) => (current.includes(metric) ? current.filter((item) => item !== metric) : [...current, metric]));
  };

  const handleShare = (reportId: string) => {
    const selected = savedReports.find((item) => item.id === reportId);
    if (!selected) return;
    if (!selected.shareToken) {
      setSavedReports((current) => current.map((item) => (item.id === reportId ? { ...item, shareToken: createToken() } : item)));
    }
    setSelectedReportId(reportId);
    setCopiedShareLink(false);
    setIsShareModalOpen(true);
  };

  const copyShareLink = async () => {
    if (!selectedReport?.shareToken || typeof navigator === "undefined") return;
    const link = `${window.location.origin}/reports/shared/${selectedReport.shareToken}`;
    await navigator.clipboard.writeText(link);
    setCopiedShareLink(true);
  };

  const submitSaveModal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!saveName.trim() || saveMetrics.length === 0) return;
    setSavedReports((current) => [
      {
        id: createId("sr"),
        name: saveName.trim(),
        type: saveType,
        filters: { type: saveType, from: saveFrom, to: saveTo },
        metrics: saveMetrics,
        isPinned: false,
        shareToken: null,
        createdAt: new Date().toISOString().slice(0, 10),
        createdBy: "Current User",
      },
      ...current,
    ]);
    setIsSaveModalOpen(false);
    setSaveName("");
  };

  const openEditSchedule = (scheduleId: string) => {
    const found = schedules.find((item) => item.id === scheduleId);
    if (!found) return;
    setEditingScheduleId(scheduleId);
    setScheduleName(found.name);
    setScheduleType(found.type);
    setScheduleFrequency(found.frequency);
    setScheduleFormat(found.exportFormat);
    setScheduleRecipients(found.recipients.join(", "));
    setIsCreateScheduleOpen(true);
  };

  const submitScheduleModal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const recipients = scheduleRecipients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (!scheduleName.trim() || recipients.length === 0) return;

    if (editingScheduleId) {
      setSchedules((current) =>
        current.map((item) =>
          item.id === editingScheduleId
            ? {
                ...item,
                name: scheduleName.trim(),
                type: scheduleType,
                frequency: scheduleFrequency,
                exportFormat: scheduleFormat,
                recipients,
              }
            : item,
        ),
      );
    } else {
      setSchedules((current) => [
        {
          id: createId("sch"),
          name: scheduleName.trim(),
          type: scheduleType,
          filters: { type: scheduleType, from: "2026-01-01", to: "2026-12-31" },
          frequency: scheduleFrequency,
          recipients,
          exportFormat: scheduleFormat,
          nextRunAt: "2026-04-01",
          lastRunAt: null,
          isEnabled: true,
        },
        ...current,
      ]);
    }

    setIsCreateScheduleOpen(false);
    setEditingScheduleId(null);
    setScheduleName("");
  };

  return (
    <DashboardScaffold>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Reports</h1>
            <p className={styles.subtitle}>Generate, share, and automate clinic analytics reports.</p>
          </div>
          <div className={styles.scheduleBadge}>
            <Clock3 size={14} />
            {enabledSchedules} active schedules
          </div>
        </header>

        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "saved" && (
          <section className={styles.section}>
            <div className={styles.rowBetween}>
              <div className={styles.row}>
                <input
                  className={styles.input}
                  placeholder="Search saved reports..."
                  value={savedSearch}
                  onChange={(event) => setSavedSearch(event.target.value)}
                />
                <select
                  className={styles.select}
                  value={savedTypeFilter}
                  onChange={(event) => setSavedTypeFilter(event.target.value as "all" | ReportType)}
                >
                  <option value="all">All types</option>
                  {(Object.keys(REPORT_TYPE_LABEL) as ReportType[]).map((type) => (
                    <option key={type} value={type}>
                      {REPORT_TYPE_LABEL[type]}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" className={styles.primaryButton} onClick={() => setIsSaveModalOpen(true)}>
                <Plus size={14} />
                New Saved Report
              </button>
            </div>

            {pinnedReports.length > 0 && (
              <>
                <h3 className={styles.groupTitle}>Pinned</h3>
                <div className={styles.cardGrid}>
                  {pinnedReports.map((report) => (
                    <article key={report.id} className={styles.card}>
                      <div className={styles.cardTop}>
                        <span className={styles.reportBadge}>{REPORT_TYPE_LABEL[report.type]}</span>
                        <div className={styles.row}>
                          <button
                            type="button"
                            className={styles.iconButton}
                            onClick={() =>
                              setSavedReports((current) =>
                                current.map((item) => (item.id === report.id ? { ...item, isPinned: !item.isPinned } : item)),
                              )
                            }
                            aria-label="Unpin report"
                          >
                            <PinOff size={14} />
                          </button>
                          <button type="button" className={styles.iconButton} aria-label="More options">
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      </div>
                      <p className={styles.cardTitle}>{report.name}</p>
                      <p className={styles.cardMuted}>
                        {fmtDate(report.filters.from)} - {fmtDate(report.filters.to)}
                      </p>
                      <p className={styles.cardMuted}>Metrics: {report.metrics.slice(0, 2).map((m) => METRIC_LABEL[m]).join(", ")}</p>
                      <p className={styles.cardMuted}>Created by {report.createdBy}</p>
                      <div className={styles.cardActions}>
                        <button type="button" className={styles.ghostButton} onClick={() => setActiveTab("builder")}>
                          <Play size={13} />
                          Run
                        </button>
                        <button type="button" className={styles.ghostButton} onClick={() => handleShare(report.id)}>
                          <Share2 size={13} />
                          Share
                        </button>
                        <button
                          type="button"
                          className={styles.ghostButton}
                          onClick={() =>
                            setSavedReports((current) => [
                              {
                                ...report,
                                id: createId("sr"),
                                name: `${report.name} (Copy)`,
                                createdAt: new Date().toISOString().slice(0, 10),
                              },
                              ...current,
                            ])
                          }
                        >
                          <Copy size={13} />
                          Duplicate
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}

            <h3 className={styles.groupTitle}>All Reports ({filteredSavedReports.length})</h3>
            {filteredSavedReports.length === 0 ? (
              <div className={styles.emptyState}>
                <FileClock size={18} />
                <p>No saved reports yet.</p>
                <button type="button" className={styles.primaryButton} onClick={() => setIsSaveModalOpen(true)}>
                  Create your first saved report
                </button>
              </div>
            ) : (
              <div className={styles.cardGrid}>
                {nonPinnedReports.map((report) => (
                  <article key={report.id} className={styles.card}>
                    <div className={styles.cardTop}>
                      <span className={styles.reportBadge}>{REPORT_TYPE_LABEL[report.type]}</span>
                      <div className={styles.row}>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() =>
                            setSavedReports((current) =>
                              current.map((item) => (item.id === report.id ? { ...item, isPinned: !item.isPinned } : item)),
                            )
                          }
                          aria-label="Pin report"
                        >
                          <Pin size={14} />
                        </button>
                        <button type="button" className={styles.iconButton} aria-label="More options">
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </div>
                    <p className={styles.cardTitle}>{report.name}</p>
                    <p className={styles.cardMuted}>
                      {fmtDate(report.filters.from)} - {fmtDate(report.filters.to)}
                    </p>
                    <p className={styles.cardMuted}>Metrics: {report.metrics.slice(0, 2).map((m) => METRIC_LABEL[m]).join(", ")}</p>
                    <div className={styles.cardActions}>
                      <button type="button" className={styles.ghostButton} onClick={() => setActiveTab("builder")}>
                        <Play size={13} />
                        Run
                      </button>
                      <button type="button" className={styles.ghostButton} onClick={() => handleShare(report.id)}>
                        <Share2 size={13} />
                        Share
                      </button>
                      <button
                        type="button"
                        className={styles.ghostButtonDanger}
                        onClick={() => setSavedReports((current) => current.filter((item) => item.id !== report.id))}
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "builder" && (
          <section className={styles.section}>
            <div className={styles.builderLayout}>
              <div className={styles.builderPanel}>
                <h3 className={styles.groupTitle}>Build Custom Report</h3>
                <label className={styles.field}>
                  <span>Report Type</span>
                  <select
                    className={styles.select}
                    value={builderType}
                    onChange={(event) => {
                      const nextType = event.target.value as ReportType;
                      setBuilderType(nextType);
                      setBuilderMetrics(METRICS_BY_TYPE[nextType].slice(0, 2));
                    }}
                  >
                    {(Object.keys(REPORT_TYPE_LABEL) as ReportType[]).map((type) => (
                      <option key={type} value={type}>
                        {REPORT_TYPE_LABEL[type]}
                      </option>
                    ))}
                  </select>
                </label>
                <div className={styles.twoColumns}>
                  <label className={styles.field}>
                    <span>From</span>
                    <input className={styles.input} type="date" value={builderFrom} onChange={(event) => setBuilderFrom(event.target.value)} />
                  </label>
                  <label className={styles.field}>
                    <span>To</span>
                    <input className={styles.input} type="date" value={builderTo} onChange={(event) => setBuilderTo(event.target.value)} />
                  </label>
                </div>
                <div className={styles.metricWrap}>
                  <p className={styles.metricTitle}>Select Metrics</p>
                  {METRICS_BY_TYPE[builderType].map((metric) => (
                    <label key={metric} className={styles.checkboxLine}>
                      <input
                        type="checkbox"
                        checked={builderMetrics.includes(metric)}
                        onChange={() => handleMetricToggle(metric, "builder")}
                      />
                      {METRIC_LABEL[metric]}
                    </label>
                  ))}
                </div>
                <div className={styles.row}>
                  <button type="button" className={styles.primaryButton} onClick={() => setIsBuilderRun(true)}>
                    <Play size={14} />
                    Run Report
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      setSaveType(builderType);
                      setSaveFrom(builderFrom);
                      setSaveTo(builderTo);
                      setSaveMetrics(builderMetrics);
                      setIsSaveModalOpen(true);
                    }}
                  >
                    <Save size={14} />
                    Save Report
                  </button>
                </div>
              </div>
              <div className={styles.builderPreview}>
                {!isBuilderRun ? (
                  <div className={styles.placeholder}>Run report to see preview.</div>
                ) : (
                  <>
                    <div className={styles.summaryGrid}>
                      {builderMetrics.slice(0, 4).map((metric) => (
                        <div key={metric} className={styles.summaryCard}>
                          <p>{METRIC_LABEL[metric]}</p>
                          <strong>{metricPreviewValue(metric, builderType)}</strong>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartBox}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={builderPreview}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="valueA" fill="#a5b4fc" name="Baseline" />
                          <Bar dataKey="valueB" fill="#4acf7f" name={REPORT_TYPE_LABEL[builderType]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "comparison" && (
          <section className={styles.section}>
            <div className={styles.twoColumns}>
              <label className={styles.field}>
                <span>Period A Label</span>
                <input className={styles.input} value={periodALabel} onChange={(event) => setPeriodALabel(event.target.value)} />
              </label>
              <label className={styles.field}>
                <span>Period B Label</span>
                <input className={styles.input} value={periodBLabel} onChange={(event) => setPeriodBLabel(event.target.value)} />
              </label>
            </div>
            <div className={styles.row}>
              <select className={styles.select} value={comparisonType} onChange={(event) => setComparisonType(event.target.value as ReportType)}>
                {(Object.keys(REPORT_TYPE_LABEL) as ReportType[]).map((type) => (
                  <option key={type} value={type}>
                    {REPORT_TYPE_LABEL[type]}
                  </option>
                ))}
              </select>
              <button type="button" className={styles.primaryButton} onClick={() => setIsComparisonRun(true)}>
                Compare
              </button>
            </div>

            {isComparisonRun && (
              <>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>{periodALabel}</th>
                        <th>{periodBLabel}</th>
                        <th>Diff</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => {
                        const diffPct = ((row.a - row.b) / Math.max(1, row.b)) * 100;
                        const positive = diffPct >= 0;
                        return (
                          <tr key={row.metric}>
                            <td>{row.metric}</td>
                            <td>{row.metric.includes("Revenue") ? `$${row.a.toLocaleString()}` : row.a.toLocaleString()}</td>
                            <td>{row.metric.includes("Revenue") ? `$${row.b.toLocaleString()}` : row.b.toLocaleString()}</td>
                            <td className={positive ? styles.diffPositive : styles.diffNegative}>
                              {positive ? "+" : ""}
                              {diffPct.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className={styles.chartBox}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" hide />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="periodA" name={periodALabel} fill="#a5b4fc" />
                      <Bar dataKey="periodB" name={periodBLabel} fill="#4acf7f" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </section>
        )}

        {activeTab === "schedules" && (
          <section className={styles.section}>
            <div className={styles.rowBetween}>
              <p className={styles.helperText}>
                {enabledSchedules} of {schedules.length} schedules active
              </p>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => {
                  setEditingScheduleId(null);
                  setScheduleName("");
                  setIsCreateScheduleOpen(true);
                }}
              >
                <Plus size={14} />
                New Schedule
              </button>
            </div>
            {schedules.length === 0 ? (
              <div className={styles.emptyState}>
                <CalendarClock size={18} />
                <p>No scheduled reports yet.</p>
              </div>
            ) : (
              <div className={styles.scheduleList}>
                {schedules.map((schedule) => (
                  <article key={schedule.id} className={styles.scheduleCard}>
                    <div className={styles.rowBetween}>
                      <label className={styles.switchLine}>
                        <input
                          type="checkbox"
                          checked={schedule.isEnabled}
                          onChange={(event) =>
                            setSchedules((current) =>
                              current.map((item) => (item.id === schedule.id ? { ...item, isEnabled: event.target.checked } : item)),
                            )
                          }
                        />
                        <span>{schedule.isEnabled ? "Active" : "Paused"}</span>
                      </label>
                      <button type="button" className={styles.iconButton} onClick={() => openEditSchedule(schedule.id)} aria-label="Edit schedule">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                    <h4>{schedule.name}</h4>
                    <p>Type: {REPORT_TYPE_LABEL[schedule.type]}</p>
                    <p>Frequency: {schedule.frequency}</p>
                    <p>Format: {schedule.exportFormat.toUpperCase()}</p>
                    <p>
                      Recipients: {schedule.recipients[0]}
                      {schedule.recipients.length > 1 ? ` +${schedule.recipients.length - 1} more` : ""}
                    </p>
                    <p>
                      Next run: {fmtDate(schedule.nextRunAt)} | Last run: {schedule.lastRunAt ? fmtDate(schedule.lastRunAt) : "Never"}
                    </p>
                    <div className={styles.row}>
                      <button type="button" className={styles.ghostButton} onClick={() => openEditSchedule(schedule.id)}>
                        Edit
                      </button>
                      <button type="button" className={styles.ghostButton} onClick={() => alert("Report sent.")}>
                        Run now
                      </button>
                      <button
                        type="button"
                        className={styles.ghostButtonDanger}
                        onClick={() => setSchedules((current) => current.filter((item) => item.id !== schedule.id))}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "history" && (
          <section className={styles.section}>
            <div className={styles.row}>
              <select
                className={styles.select}
                value={historyTypeFilter}
                onChange={(event) => {
                  setHistoryTypeFilter(event.target.value as "all" | ReportType);
                  setHistoryPage(1);
                }}
              >
                <option value="all">All Types</option>
                {(Object.keys(REPORT_TYPE_LABEL) as ReportType[]).map((type) => (
                  <option key={type} value={type}>
                    {REPORT_TYPE_LABEL[type]}
                  </option>
                ))}
              </select>
              <select
                className={styles.select}
                value={historyFormatFilter}
                onChange={(event) => {
                  setHistoryFormatFilter(event.target.value as "all" | ExportFormat);
                  setHistoryPage(1);
                }}
              >
                <option value="all">All Formats</option>
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  setHistoryTypeFilter("all");
                  setHistoryFormatFilter("all");
                  setHistoryPage(1);
                }}
              >
                Clear
              </button>
            </div>
            {historyRows.length === 0 ? (
              <div className={styles.emptyState}>
                <History size={18} />
                <p>No report history yet.</p>
              </div>
            ) : (
              <>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Generated At</th>
                        <th>Type</th>
                        <th>Period</th>
                        <th>Generated By</th>
                        <th>Format</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyRows.map((item) => (
                        <tr key={item.id}>
                          <td>{fmtDateTime(item.generatedAt)}</td>
                          <td>{REPORT_TYPE_LABEL[item.type]}</td>
                          <td>
                            {fmtDate(item.filters.from)} - {fmtDate(item.filters.to)}
                          </td>
                          <td>{item.generatedBy}</td>
                          <td>{item.exportFormat ? item.exportFormat.toUpperCase() : "-"}</td>
                          <td>
                            <div className={styles.row}>
                              <button type="button" className={styles.ghostButton}>
                                Download
                              </button>
                              <button type="button" className={styles.ghostButton} onClick={() => setActiveTab("builder")}>
                                Re-run
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.pagination}>
                  <button type="button" className={styles.secondaryButton} disabled={historyPage <= 1} onClick={() => setHistoryPage((v) => Math.max(1, v - 1))}>
                    Previous
                  </button>
                  <span>
                    {historyPage} / {historyTotalPages}
                  </span>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    disabled={historyPage >= historyTotalPages}
                    onClick={() => setHistoryPage((v) => Math.min(historyTotalPages, v + 1))}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </section>
        )}
      </div>

      {isSaveModalOpen && (
        <div className={styles.modalOverlay}>
          <form className={styles.modal} onSubmit={submitSaveModal}>
            <h3>{saveName ? "Update Saved Report" : "Save Report"}</h3>
            <label className={styles.field}>
              <span>Report Name</span>
              <input className={styles.input} value={saveName} onChange={(event) => setSaveName(event.target.value)} required />
            </label>
            <label className={styles.field}>
              <span>Report Type</span>
              <select
                className={styles.select}
                value={saveType}
                onChange={(event) => {
                  const nextType = event.target.value as ReportType;
                  setSaveType(nextType);
                  setSaveMetrics(METRICS_BY_TYPE[nextType].slice(0, 2));
                }}
              >
                {(Object.keys(REPORT_TYPE_LABEL) as ReportType[]).map((type) => (
                  <option key={type} value={type}>
                    {REPORT_TYPE_LABEL[type]}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.twoColumns}>
              <label className={styles.field}>
                <span>From</span>
                <input className={styles.input} type="date" value={saveFrom} onChange={(event) => setSaveFrom(event.target.value)} required />
              </label>
              <label className={styles.field}>
                <span>To</span>
                <input className={styles.input} type="date" value={saveTo} onChange={(event) => setSaveTo(event.target.value)} required />
              </label>
            </div>
            <div className={styles.metricWrap}>
              <p className={styles.metricTitle}>Metrics</p>
              {METRICS_BY_TYPE[saveType].map((metric) => (
                <label key={metric} className={styles.checkboxLine}>
                  <input type="checkbox" checked={saveMetrics.includes(metric)} onChange={() => handleMetricToggle(metric, "save")} />
                  {METRIC_LABEL[metric]}
                </label>
              ))}
            </div>
            <div className={styles.rowEnd}>
              <button type="button" className={styles.secondaryButton} onClick={() => setIsSaveModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className={styles.primaryButton} disabled={saveMetrics.length === 0}>
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {isShareModalOpen && selectedReport && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Share Report</h3>
            <p className={styles.helperText}>Share configuration-only link for {selectedReport.name}.</p>
            <div className={styles.row}>
              <input
                className={styles.input}
                readOnly
                value={`${typeof window === "undefined" ? "" : window.location.origin}/reports/shared/${selectedReport.shareToken ?? ""}`}
              />
              <button type="button" className={styles.secondaryButton} onClick={copyShareLink}>
                <Copy size={14} />
              </button>
            </div>
            {copiedShareLink && (
              <p className={styles.successText}>
                <Check size={13} /> Link copied to clipboard
              </p>
            )}
            <div className={styles.rowBetween}>
              <button
                type="button"
                className={styles.ghostButtonDanger}
                onClick={() =>
                  setSavedReports((current) => current.map((item) => (item.id === selectedReport.id ? { ...item, shareToken: null } : item)))
                }
              >
                Revoke link
              </button>
              <button type="button" className={styles.secondaryButton} onClick={() => setIsShareModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreateScheduleOpen && (
        <div className={styles.modalOverlay}>
          <form className={styles.modal} onSubmit={submitScheduleModal}>
            <h3>{editingScheduleId ? "Edit Schedule" : "Create Schedule"}</h3>
            <label className={styles.field}>
              <span>Schedule Name</span>
              <input className={styles.input} value={scheduleName} onChange={(event) => setScheduleName(event.target.value)} required />
            </label>
            <label className={styles.field}>
              <span>Report Type</span>
              <select className={styles.select} value={scheduleType} onChange={(event) => setScheduleType(event.target.value as ReportType)}>
                {(Object.keys(REPORT_TYPE_LABEL) as ReportType[]).map((type) => (
                  <option key={type} value={type}>
                    {REPORT_TYPE_LABEL[type]}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.twoColumns}>
              <label className={styles.field}>
                <span>Frequency</span>
                <select
                  className={styles.select}
                  value={scheduleFrequency}
                  onChange={(event) => setScheduleFrequency(event.target.value as ScheduleFrequency)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </label>
              <label className={styles.field}>
                <span>Export Format</span>
                <select className={styles.select} value={scheduleFormat} onChange={(event) => setScheduleFormat(event.target.value as ExportFormat)}>
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </label>
            </div>
            <label className={styles.field}>
              <span>Recipients (comma separated emails)</span>
              <input className={styles.input} value={scheduleRecipients} onChange={(event) => setScheduleRecipients(event.target.value)} required />
            </label>
            <div className={styles.rowEnd}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  setIsCreateScheduleOpen(false);
                  setEditingScheduleId(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className={styles.primaryButton}>
                {editingScheduleId ? "Save Changes" : "Create Schedule"}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardScaffold>
  );
}
