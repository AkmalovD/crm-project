"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, CalendarClock, GitCompare, History, Save } from "lucide-react";

import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import {
  INITIAL_HISTORY,
  INITIAL_SAVED_REPORTS,
  INITIAL_SCHEDULES,
  METRICS_BY_TYPE,
} from "@/data/reportsData/reportsDashboardData";
import {
  ExportFormat,
  ReportHistoryEntry,
  ReportMetric,
  ReportPageTab,
  ReportType,
  ScheduleFrequency,
  SavedReport,
  ScheduledReport,
} from "@/types/reportsDashboardTypes";
import { createId, createToken, generateBuilderPreview } from "@/utils/reportsDashboardUtils";
import { ReportsBuilderTab } from "./ReportsBuilderTab";
import { ReportsComparisonTab } from "./ReportsComparisonTab";
import { ReportsHeader } from "./ReportsHeader";
import { ReportsHistoryTab } from "./ReportsHistoryTab";
import { ReportsSavedTab } from "./ReportsSavedTab";
import { ReportsSchedulesTab } from "./ReportsSchedulesTab";
import { ReportsTabs } from "./ReportsTabs";
import { SaveReportModal } from "./SaveReportModal";
import { ShareReportModal } from "./ShareReportModal";
import { ScheduleReportModal } from "./ScheduleReportModal";
import styles from "./ReportsDashboardPage.module.css";

const TABS: Array<{ id: ReportPageTab; label: string; icon: ReactNode }> = [
  { id: "saved", label: "Saved Reports", icon: <Save size={14} /> },
  { id: "builder", label: "Custom Builder", icon: <BadgeCheck size={14} /> },
  { id: "comparison", label: "Comparison", icon: <GitCompare size={14} /> },
  { id: "schedules", label: "Schedules", icon: <CalendarClock size={14} /> },
  { id: "history", label: "History", icon: <History size={14} /> },
];

export function ReportsDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as ReportPageTab | null;
  const initialTab = tabFromUrl ?? "saved";
  const [activeTab, setActiveTab] = useState<ReportPageTab>(
    TABS.some((item) => item.id === initialTab) ? initialTab : "saved",
  );

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
  const [builderMetrics, setBuilderMetrics] = useState<ReportMetric[]>(
    METRICS_BY_TYPE.sessions.slice(0, 3),
  );
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
  const [saveMetrics, setSaveMetrics] = useState<ReportMetric[]>(
    METRICS_BY_TYPE.sessions.slice(0, 2),
  );

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

  const selectedReport = useMemo(
    () => savedReports.find((item) => item.id === selectedReportId) ?? null,
    [savedReports, selectedReportId],
  );

  const filteredSavedReports = useMemo(
    () =>
      savedReports.filter((item) => {
        const bySearch = item.name.toLowerCase().includes(savedSearch.toLowerCase());
        const byType = savedTypeFilter === "all" ? true : item.type === savedTypeFilter;
        return bySearch && byType;
      }),
    [savedReports, savedSearch, savedTypeFilter],
  );

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

  const filteredHistory = useMemo(
    () =>
      historyEntries.filter((entry) => {
        const byType = historyTypeFilter === "all" ? true : entry.type === historyTypeFilter;
        const byFormat = historyFormatFilter === "all" ? true : entry.exportFormat === historyFormatFilter;
        return byType && byFormat;
      }),
    [historyEntries, historyTypeFilter, historyFormatFilter],
  );

  const historyPerPage = 5;
  const historyTotalPages = Math.max(1, Math.ceil(filteredHistory.length / historyPerPage));
  const historyRows = filteredHistory.slice((historyPage - 1) * historyPerPage, historyPage * historyPerPage);

  const handleShare = (reportId: string) => {
    const selected = savedReports.find((item) => item.id === reportId);
    if (!selected) return;
    if (!selected.shareToken) {
      setSavedReports((current) =>
        current.map((item) => (item.id === reportId ? { ...item, shareToken: createToken() } : item)),
      );
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
        <ReportsHeader enabledSchedules={enabledSchedules} />
        <ReportsTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "saved" && (
          <ReportsSavedTab
            savedSearch={savedSearch}
            savedTypeFilter={savedTypeFilter}
            filteredSavedReports={filteredSavedReports}
            pinnedReports={pinnedReports}
            nonPinnedReports={nonPinnedReports}
            onSavedSearchChange={setSavedSearch}
            onSavedTypeFilterChange={setSavedTypeFilter}
            onOpenSaveModal={() => setIsSaveModalOpen(true)}
            onSetBuilderTab={() => setActiveTab("builder")}
            onShare={handleShare}
            onSetSavedReports={setSavedReports}
          />
        )}

        {activeTab === "builder" && (
          <ReportsBuilderTab
            builderType={builderType}
            builderFrom={builderFrom}
            builderTo={builderTo}
            builderMetrics={builderMetrics}
            isBuilderRun={isBuilderRun}
            builderPreview={builderPreview}
            onBuilderTypeChange={(nextType) => {
              setBuilderType(nextType);
              setBuilderMetrics(METRICS_BY_TYPE[nextType].slice(0, 2));
            }}
            onBuilderFromChange={setBuilderFrom}
            onBuilderToChange={setBuilderTo}
            onMetricToggle={(metric) =>
              setBuilderMetrics((current) =>
                current.includes(metric) ? current.filter((item) => item !== metric) : [...current, metric],
              )
            }
            onRun={() => setIsBuilderRun(true)}
            onSave={() => {
              setSaveType(builderType);
              setSaveFrom(builderFrom);
              setSaveTo(builderTo);
              setSaveMetrics(builderMetrics);
              setIsSaveModalOpen(true);
            }}
          />
        )}

        {activeTab === "comparison" && (
          <ReportsComparisonTab
            periodALabel={periodALabel}
            periodBLabel={periodBLabel}
            comparisonType={comparisonType}
            isComparisonRun={isComparisonRun}
            comparisonRows={comparisonRows}
            comparisonChartData={comparisonChartData}
            onPeriodAChange={setPeriodALabel}
            onPeriodBChange={setPeriodBLabel}
            onComparisonTypeChange={setComparisonType}
            onRun={() => setIsComparisonRun(true)}
          />
        )}

        {activeTab === "schedules" && (
          <ReportsSchedulesTab
            enabledSchedules={enabledSchedules}
            schedules={schedules}
            onOpenNew={() => {
              setEditingScheduleId(null);
              setScheduleName("");
              setIsCreateScheduleOpen(true);
            }}
            onOpenEdit={openEditSchedule}
            onSetSchedules={setSchedules}
          />
        )}

        {activeTab === "history" && (
          <ReportsHistoryTab
            historyTypeFilter={historyTypeFilter}
            historyFormatFilter={historyFormatFilter}
            historyRows={historyRows}
            historyPage={historyPage}
            historyTotalPages={historyTotalPages}
            onTypeChange={(value) => {
              setHistoryTypeFilter(value);
              setHistoryPage(1);
            }}
            onFormatChange={(value) => {
              setHistoryFormatFilter(value);
              setHistoryPage(1);
            }}
            onClear={() => {
              setHistoryTypeFilter("all");
              setHistoryFormatFilter("all");
              setHistoryPage(1);
            }}
            onPrev={() => setHistoryPage((v) => Math.max(1, v - 1))}
            onNext={() => setHistoryPage((v) => Math.min(historyTotalPages, v + 1))}
            onRerun={() => setActiveTab("builder")}
          />
        )}
      </div>

      {isSaveModalOpen && (
        <SaveReportModal
          saveName={saveName}
          saveType={saveType}
          saveFrom={saveFrom}
          saveTo={saveTo}
          saveMetrics={saveMetrics}
          onSaveNameChange={setSaveName}
          onSaveTypeChange={(nextType) => {
            setSaveType(nextType);
            setSaveMetrics(METRICS_BY_TYPE[nextType].slice(0, 2));
          }}
          onSaveFromChange={setSaveFrom}
          onSaveToChange={setSaveTo}
          onMetricToggle={(metric) =>
            setSaveMetrics((current) =>
              current.includes(metric) ? current.filter((item) => item !== metric) : [...current, metric],
            )
          }
          onClose={() => setIsSaveModalOpen(false)}
          onSubmit={submitSaveModal}
        />
      )}

      {isShareModalOpen && selectedReport && (
        <ShareReportModal
          selectedReport={selectedReport}
          copiedShareLink={copiedShareLink}
          onCopy={copyShareLink}
          onRevoke={() =>
            setSavedReports((current) =>
              current.map((item) =>
                item.id === selectedReport.id ? { ...item, shareToken: null } : item,
              ),
            )
          }
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {isCreateScheduleOpen && (
        <ScheduleReportModal
          editingScheduleId={editingScheduleId}
          scheduleName={scheduleName}
          scheduleType={scheduleType}
          scheduleFrequency={scheduleFrequency}
          scheduleFormat={scheduleFormat}
          scheduleRecipients={scheduleRecipients}
          onScheduleNameChange={setScheduleName}
          onScheduleTypeChange={setScheduleType}
          onScheduleFrequencyChange={setScheduleFrequency}
          onScheduleFormatChange={setScheduleFormat}
          onScheduleRecipientsChange={setScheduleRecipients}
          onClose={() => {
            setIsCreateScheduleOpen(false);
            setEditingScheduleId(null);
          }}
          onSubmit={submitScheduleModal}
        />
      )}
    </DashboardScaffold>
  );
}
