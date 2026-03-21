import { ActiveView } from "@/types/appointmentsDashboardTypes";
import styles from "./AppointmentsDashboardPage.module.css";
import { cx } from "@/utils/appointmentsDashboardUtils";

interface AppointmentsViewToggleProps {
  activeView: ActiveView;
  onChange: (view: ActiveView) => void;
}

export function AppointmentsViewToggle({ activeView, onChange }: AppointmentsViewToggleProps) {
  return (
    <section className={styles.viewToggle}>
      {(["day", "week", "month", "agenda"] as const).map((view) => (
        <button
          key={view}
          type="button"
          className={cx(styles.viewButton, activeView === view && styles.viewButtonActive)}
          onClick={() => onChange(view)}
        >
          {view[0].toUpperCase()}
          {view.slice(1)}
        </button>
      ))}
    </section>
  );
}
