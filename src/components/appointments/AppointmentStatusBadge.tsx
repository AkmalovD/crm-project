import { AppointmentStatus } from "@/types/appointmentsDashboardTypes";
import { STATUS_CLASS, STATUS_LABELS } from "@/data/appointmentsData/appointmentsDashboardData";
import styles from "./AppointmentsDashboardPage.module.css";
import { cx } from "@/utils/appointmentsDashboardUtils";

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <span className={cx(styles.statusBadge, STATUS_CLASS[status])}>{STATUS_LABELS[status]}</span>;
}
