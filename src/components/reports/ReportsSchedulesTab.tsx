import { CalendarClock, MoreHorizontal, Plus } from "lucide-react";
import { REPORT_TYPE_LABEL } from "@/data/reportsData/reportsDashboardData";
import { ScheduledReport } from "@/types/reportsDashboardTypes";
import { fmtDate } from "@/utils/reportsDashboardUtils";
import styles from "./ReportsDashboardPage.module.css";

interface ReportsSchedulesTabProps {
  enabledSchedules: number;
  schedules: ScheduledReport[];
  onOpenNew: () => void;
  onOpenEdit: (scheduleId: string) => void;
  onSetSchedules: (updater: (current: ScheduledReport[]) => ScheduledReport[]) => void;
}

export function ReportsSchedulesTab({
  enabledSchedules,
  schedules,
  onOpenNew,
  onOpenEdit,
  onSetSchedules,
}: ReportsSchedulesTabProps) {
  return (
    <section className={styles.section}>
      <div className={styles.rowBetween}>
        <p className={styles.helperText}>
          {enabledSchedules} of {schedules.length} schedules active
        </p>
        <button type="button" className={styles.primaryButton} onClick={onOpenNew}>
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
                      onSetSchedules((current) =>
                        current.map((item) =>
                          item.id === schedule.id ? { ...item, isEnabled: event.target.checked } : item,
                        ),
                      )
                    }
                  />
                  <span>{schedule.isEnabled ? "Active" : "Paused"}</span>
                </label>
                <button type="button" className={styles.iconButton} onClick={() => onOpenEdit(schedule.id)} aria-label="Edit schedule">
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
                <button type="button" className={styles.ghostButton} onClick={() => onOpenEdit(schedule.id)}>
                  Edit
                </button>
                <button type="button" className={styles.ghostButton} onClick={() => alert("Report sent.")}>
                  Run now
                </button>
                <button
                  type="button"
                  className={styles.ghostButtonDanger}
                  onClick={() => onSetSchedules((current) => current.filter((item) => item.id !== schedule.id))}
                >
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
