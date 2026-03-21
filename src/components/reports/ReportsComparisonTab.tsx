import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { REPORT_TYPE_LABEL } from "@/data/reportsData/reportsDashboardData";
import { ReportType } from "@/types/reportsDashboardTypes";
import styles from "./ReportsDashboardPage.module.css";

interface Row {
  metric: string;
  a: number;
  b: number;
}

interface ReportsComparisonTabProps {
  periodALabel: string;
  periodBLabel: string;
  comparisonType: ReportType;
  isComparisonRun: boolean;
  comparisonRows: Row[];
  comparisonChartData: Array<{ name: string; periodA: number; periodB: number }>;
  onPeriodAChange: (value: string) => void;
  onPeriodBChange: (value: string) => void;
  onComparisonTypeChange: (value: ReportType) => void;
  onRun: () => void;
}

export function ReportsComparisonTab(props: ReportsComparisonTabProps) {
  const {
    periodALabel,
    periodBLabel,
    comparisonType,
    isComparisonRun,
    comparisonRows,
    comparisonChartData,
    onPeriodAChange,
    onPeriodBChange,
    onComparisonTypeChange,
    onRun,
  } = props;
  return (
    <section className={styles.section}>
      <div className={styles.twoColumns}>
        <label className={styles.field}>
          <span>Period A Label</span>
          <input className={styles.input} value={periodALabel} onChange={(e) => onPeriodAChange(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Period B Label</span>
          <input className={styles.input} value={periodBLabel} onChange={(e) => onPeriodBChange(e.target.value)} />
        </label>
      </div>
      <div className={styles.row}>
        <select className={styles.select} value={comparisonType} onChange={(e) => onComparisonTypeChange(e.target.value as ReportType)}>
          {(Object.keys(REPORT_TYPE_LABEL) as ReportType[]).map((type) => (
            <option key={type} value={type}>
              {REPORT_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
        <button type="button" className={styles.primaryButton} onClick={onRun}>
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
  );
}
