import { METRIC_LABEL, METRICS_BY_TYPE, REPORT_TYPE_LABEL } from "@/data/reportsData/reportsDashboardData";
import { ReportMetric, ReportType } from "@/types/reportsDashboardTypes";
import styles from "./ReportsDashboardPage.module.css";

interface SaveReportModalProps {
  saveName: string;
  saveType: ReportType;
  saveFrom: string;
  saveTo: string;
  saveMetrics: ReportMetric[];
  onSaveNameChange: (value: string) => void;
  onSaveTypeChange: (value: ReportType) => void;
  onSaveFromChange: (value: string) => void;
  onSaveToChange: (value: string) => void;
  onMetricToggle: (metric: ReportMetric) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function SaveReportModal(props: SaveReportModalProps) {
  const {
    saveName,
    saveType,
    saveFrom,
    saveTo,
    saveMetrics,
    onSaveNameChange,
    onSaveTypeChange,
    onSaveFromChange,
    onSaveToChange,
    onMetricToggle,
    onClose,
    onSubmit,
  } = props;
  return (
    <div className={styles.modalOverlay}>
      <form className={styles.modal} onSubmit={onSubmit}>
        <h3>{saveName ? "Update Saved Report" : "Save Report"}</h3>
        <label className={styles.field}>
          <span>Report Name</span>
          <input className={styles.input} value={saveName} onChange={(e) => onSaveNameChange(e.target.value)} required />
        </label>
        <label className={styles.field}>
          <span>Report Type</span>
          <select className={styles.select} value={saveType} onChange={(e) => onSaveTypeChange(e.target.value as ReportType)}>
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
            <input className={styles.input} type="date" value={saveFrom} onChange={(e) => onSaveFromChange(e.target.value)} required />
          </label>
          <label className={styles.field}>
            <span>To</span>
            <input className={styles.input} type="date" value={saveTo} onChange={(e) => onSaveToChange(e.target.value)} required />
          </label>
        </div>
        <div className={styles.metricWrap}>
          <p className={styles.metricTitle}>Metrics</p>
          {METRICS_BY_TYPE[saveType].map((metric) => (
            <label key={metric} className={styles.checkboxLine}>
              <input type="checkbox" checked={saveMetrics.includes(metric)} onChange={() => onMetricToggle(metric)} />
              {METRIC_LABEL[metric]}
            </label>
          ))}
        </div>
        <div className={styles.rowEnd}>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryButton} disabled={saveMetrics.length === 0}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
