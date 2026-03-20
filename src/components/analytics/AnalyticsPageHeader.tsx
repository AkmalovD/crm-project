import { FileDown } from "lucide-react";
import { cx } from "../../utils/analyticsDashboardUtils";
import styles from "./AnalyticsDashboardPage.module.css";

export function AnalyticsPageHeader() {
  return (
    <header className={styles.analyticsPageHeader}>
      <div>
        <h1 className="text-4xl font-bold text-[#1a1a2e]">Analytics</h1>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className={cx(styles.analyticsFilter, "px-3 py-2 text-sm")}>
          Jan 2025 - Dec 2025
        </button>
        <button type="button" className={styles.analyticsExportButton}>
          <FileDown size={15} />
          Export Report
        </button>
      </div>
    </header>
  );
}
