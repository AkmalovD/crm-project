import styles from "./AppointmentsDashboardPage.module.css";
import { NUMBER } from "@/utils/appointmentsDashboardUtils";

interface AppointmentsStatsBarProps {
  totalToday: number;
  confirmedToday: number;
  pendingToday: number;
  cancelledToday: number;
  availableSlots: number;
}

export function AppointmentsStatsBar({
  totalToday,
  confirmedToday,
  pendingToday,
  cancelledToday,
  availableSlots,
}: AppointmentsStatsBarProps) {
  return (
    <section className={styles.statsBar}>
      <div className={styles.statChip}>
        <span>Total Today</span>
        <strong>{NUMBER.format(totalToday)}</strong>
      </div>
      <div className={styles.divider} />
      <div className={styles.statChip}>
        <span>Confirmed</span>
        <strong className={styles.statConfirmed}>{NUMBER.format(confirmedToday)}</strong>
      </div>
      <div className={styles.divider} />
      <div className={styles.statChip}>
        <span>Pending</span>
        <strong className={styles.statPending}>{NUMBER.format(pendingToday)}</strong>
      </div>
      <div className={styles.divider} />
      <div className={styles.statChip}>
        <span>Cancelled</span>
        <strong className={styles.statCancelled}>{NUMBER.format(cancelledToday)}</strong>
      </div>
      <div className={styles.divider} />
      <div className={styles.statChip}>
        <span>Available Slots</span>
        <strong className={styles.statAvailable}>{NUMBER.format(availableSlots)}</strong>
      </div>
    </section>
  );
}
