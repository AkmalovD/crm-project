import { Users, X } from "lucide-react";
import { WaitlistEntry } from "@/types/appointmentsDashboardTypes";
import {
  SESSION_LABELS,
  TIME_RANGE_LABELS,
} from "@/data/appointmentsData/appointmentsDashboardData";
import styles from "./AppointmentsDashboardPage.module.css";

interface AppointmentsWaitlistPanelProps {
  waitlist: WaitlistEntry[];
  onConvert: (entry: WaitlistEntry) => void;
  onRemove: (id: string) => void;
}

export function AppointmentsWaitlistPanel({
  waitlist,
  onConvert,
  onRemove,
}: AppointmentsWaitlistPanelProps) {
  return (
    <aside className={styles.waitlistPanel}>
      <header className={styles.waitlistHeader}>
        <h2>
          <Users size={16} />
          Waitlist
        </h2>
        <span className={styles.waitlistCount}>{waitlist.length}</span>
      </header>
      <div className={styles.waitlistBody}>
        {waitlist.length === 0 && <p className={styles.emptyText}>No clients on waitlist.</p>}
        {waitlist.map((entry) => (
          <article key={entry.id} className={styles.waitlistCard}>
            <p className={styles.waitlistName}>{entry.client.fullName}</p>
            <p className={styles.waitlistPhone}>{entry.client.phone}</p>
            <p className={styles.waitlistMeta}>
              {entry.preferredDays.join(", ")} | {TIME_RANGE_LABELS[entry.preferredTimeRange]}
            </p>
            <p className={styles.waitlistMeta}>Session: {SESSION_LABELS[entry.sessionType]}</p>
            <div className={styles.waitlistActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => onConvert(entry)}>
                Convert
              </button>
              <button type="button" className={styles.iconButton} onClick={() => onRemove(entry.id)} aria-label="Remove entry">
                <X size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
