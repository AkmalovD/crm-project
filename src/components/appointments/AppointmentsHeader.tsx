import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Therapist } from "@/types/appointmentsDashboardTypes";
import styles from "./AppointmentsDashboardPage.module.css";

interface AppointmentsHeaderProps {
  formattedRange: string;
  therapistFilter: string;
  therapists: Therapist[];
  onPrev: () => void;
  onToday: () => void;
  onNext: () => void;
  onTherapistFilterChange: (value: string) => void;
  onNewAppointment: () => void;
}

export function AppointmentsHeader({
  formattedRange,
  therapistFilter,
  therapists,
  onPrev,
  onToday,
  onNext,
  onTherapistFilterChange,
  onNewAppointment,
}: AppointmentsHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>Appointments</h1>
        <span className={styles.subtitle}>Manage sessions, waitlist, and therapist availability</span>
      </div>
      <div className={styles.headerActions}>
        <div className={styles.dateNav}>
          <button type="button" className={styles.iconButton} onClick={onPrev} aria-label="Go to previous range">
            <ChevronLeft size={16} />
          </button>
          <button type="button" className={styles.secondaryButton} onClick={onToday}>
            Today
          </button>
          <button type="button" className={styles.iconButton} onClick={onNext} aria-label="Go to next range">
            <ChevronRight size={16} />
          </button>
          <span className={styles.rangeLabel}>{formattedRange}</span>
        </div>
        <select
          className={styles.select}
          value={therapistFilter}
          onChange={(event) => onTherapistFilterChange(event.target.value)}
          aria-label="Filter by therapist"
        >
          <option value="">All therapists</option>
          {therapists.map((therapist) => (
            <option key={therapist.id} value={therapist.id}>
              {therapist.fullName}
            </option>
          ))}
        </select>
        <button type="button" className={styles.primaryButton} onClick={onNewAppointment}>
          <Plus size={16} />
          New Appointment
        </button>
      </div>
    </header>
  );
}
