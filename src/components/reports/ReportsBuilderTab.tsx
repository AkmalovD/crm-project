import { Play, Save } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { METRIC_LABEL, METRICS_BY_TYPE, REPORT_TYPE_LABEL } from "@/data/reportsData/reportsDashboardData";
import { ReportMetric, ReportType } from "@/types/reportsDashboardTypes";
import { metricPreviewValue } from "@/utils/reportsDashboardUtils";
import styles from "./ReportsDashboardPage.module.css";

interface ReportsBuilderTabProps {
  builderType: ReportType;
  builderFrom: string;
  builderTo: string;
  builderMetrics: ReportMetric[];
  isBuilderRun: boolean;
  builderPreview: Array<{ name: string; valueA: number; valueB: number }>;
  onBuilderTypeChange: (nextType: ReportType) => void;
  onBuilderFromChange: (value: string) => void;
  onBuilderToChange: (value: string) => void;
  onMetricToggle: (metric: ReportMetric) => void;
  onRun: () => void;
  onSave: () => void;
}

export function ReportsBuilderTab(props: ReportsBuilderTabProps) {
  const {
    builderType,
    builderFrom,
    builderTo,
    builderMetrics,
    isBuilderRun,
    builderPreview,
    onBuilderTypeChange,
    onBuilderFromChange,
    onBuilderToChange,
    onMetricToggle,
    onRun,
    onSave,
  } = props;

  return (
    <section className={styles.section}>
      <div className={styles.builderLayout}>
        <div className={styles.builderPanel}>
          <h3 className={styles.groupTitle}>Build Custom Report</h3>
          <label className={styles.field}>
            <span>Report Type</span>
            <select className={styles.select} value={builderType} onChange={(e) => onBuilderTypeChange(e.target.value as ReportType)}>
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
              <input className={styles.input} type="date" value={builderFrom} onChange={(e) => onBuilderFromChange(e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>To</span>
              <input className={styles.input} type="date" value={builderTo} onChange={(e) => onBuilderToChange(e.target.value)} />
            </label>
          </div>
          <div className={styles.metricWrap}>
            <p className={styles.metricTitle}>Select Metrics</p>
            {METRICS_BY_TYPE[builderType].map((metric) => (
              <label key={metric} className={styles.checkboxLine}>
                <input type="checkbox" checked={builderMetrics.includes(metric)} onChange={() => onMetricToggle(metric)} />
                {METRIC_LABEL[metric]}
              </label>
            ))}
          </div>
          <div className={styles.row}>
            <button type="button" className={styles.primaryButton} onClick={onRun}>
              <Play size={14} />
              Run Report
            </button>
            <button type="button" className={styles.secondaryButton} onClick={onSave}>
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
  );
}
