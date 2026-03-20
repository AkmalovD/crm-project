import { Download, Info } from "lucide-react";
import styles from "./AnalyticsDashboardPage.module.css";

interface AnalyticsChartCardProps {
  title: string;
  filter?: boolean;
  loading?: boolean;
  hasData?: boolean;
  children: React.ReactNode;
}

export function AnalyticsChartCard({
  title,
  filter = true,
  loading = false,
  hasData = true,
  children,
}: AnalyticsChartCardProps) {
  return (
    <section className={styles.analyticsCard}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-[#1a1a2e]">{title}</h3>
          <Info size={14} className="text-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          {filter && (
            <select className={styles.analyticsFilter}>
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Yearly</option>
            </select>
          )}
          <button type="button" className={styles.analyticsIconButton} aria-label={`Export ${title}`}>
            <Download size={15} />
          </button>
        </div>
      </div>
      {loading ? (
        <div className={styles.analyticsSkeleton} />
      ) : hasData ? (
        children
      ) : (
        <div className={styles.analyticsEmptyState}>No data available for this period.</div>
      )}
    </section>
  );
}
