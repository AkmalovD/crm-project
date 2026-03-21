import { Copy, FileClock, MoreHorizontal, Pin, PinOff, Play, Plus, Share2, Trash2, ChevronDown } from "lucide-react";
import { METRIC_LABEL, REPORT_TYPE_LABEL } from "@/data/reportsData/reportsDashboardData";
import { ReportType, SavedReport } from "@/types/reportsDashboardTypes";
import { createId, fmtDate } from "@/utils/reportsDashboardUtils";
import styles from "./ReportsDashboardPage.module.css";

interface ReportsSavedTabProps {
  savedSearch: string;
  savedTypeFilter: "all" | ReportType;
  filteredSavedReports: SavedReport[];
  pinnedReports: SavedReport[];
  nonPinnedReports: SavedReport[];
  onSavedSearchChange: (value: string) => void;
  onSavedTypeFilterChange: (value: "all" | ReportType) => void;
  onOpenSaveModal: () => void;
  onSetBuilderTab: () => void;
  onShare: (reportId: string) => void;
  onSetSavedReports: (updater: (current: SavedReport[]) => SavedReport[]) => void;
}

export function ReportsSavedTab({
  savedSearch,
  savedTypeFilter,
  filteredSavedReports,
  pinnedReports,
  nonPinnedReports,
  onSavedSearchChange,
  onSavedTypeFilterChange,
  onOpenSaveModal,
  onSetBuilderTab,
  onShare,
  onSetSavedReports,
}: ReportsSavedTabProps) {
  return (
    <section className={styles.section}>
      <div className={styles.rowBetween}>
        <div className={styles.row}>
          <input
            className={styles.input}
            placeholder="Search saved reports..."
            value={savedSearch}
            onChange={(event) => onSavedSearchChange(event.target.value)}
          />
          <select
            className={styles.select}
            value={savedTypeFilter}
            onChange={(event) => onSavedTypeFilterChange(event.target.value as "all" | ReportType)}
          >
            <option value="all">All types</option>
            {(Object.keys(REPORT_TYPE_LABEL) as ReportType[]).map((type) => (
              <option key={type} value={type}>
                {REPORT_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className={styles.primaryButton} onClick={onOpenSaveModal}>
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
                        onSetSavedReports((current) =>
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
                  <button type="button" className={styles.ghostButton} onClick={onSetBuilderTab}>
                    <Play size={13} />
                    Run
                  </button>
                  <button type="button" className={styles.ghostButton} onClick={() => onShare(report.id)}>
                    <Share2 size={13} />
                    Share
                  </button>
                  <button
                    type="button"
                    className={styles.ghostButton}
                    onClick={() =>
                      onSetSavedReports((current) => [
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
          <button type="button" className={styles.primaryButton} onClick={onOpenSaveModal}>
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
                      onSetSavedReports((current) =>
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
                <button type="button" className={styles.ghostButton} onClick={onSetBuilderTab}>
                  <Play size={13} />
                  Run
                </button>
                <button type="button" className={styles.ghostButton} onClick={() => onShare(report.id)}>
                  <Share2 size={13} />
                  Share
                </button>
                <button
                  type="button"
                  className={styles.ghostButtonDanger}
                  onClick={() => onSetSavedReports((current) => current.filter((item) => item.id !== report.id))}
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
  );
}
