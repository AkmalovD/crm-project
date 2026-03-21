import { Clock3 } from "lucide-react";
import styles from "./ReportsDashboardPage.module.css";

interface ReportsHeaderProps {
  enabledSchedules: number;
}

export function ReportsHeader({ enabledSchedules }: ReportsHeaderProps) {
  return (
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
  );
}
