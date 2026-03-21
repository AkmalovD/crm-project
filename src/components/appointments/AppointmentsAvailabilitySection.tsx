import { CalendarClock } from "lucide-react";
import { Therapist } from "@/types/appointmentsDashboardTypes";
import styles from "./AppointmentsDashboardPage.module.css";

interface AvailabilityItem {
  therapist: Therapist;
  booked: number;
  capacity: number;
  free: number;
  fill: number;
}

interface AppointmentsAvailabilitySectionProps {
  availability: AvailabilityItem[];
  onBlockSlot: (therapistId: string) => void;
}

export function AppointmentsAvailabilitySection({
  availability,
  onBlockSlot,
}: AppointmentsAvailabilitySectionProps) {
  return (
    <section className={styles.availabilitySection}>
      <header className={styles.availabilityHeader}>
        <h2>
          <CalendarClock size={16} />
          Therapist Availability
        </h2>
      </header>
      <div className={styles.availabilityGrid}>
        {availability.map((item) => (
          <article key={item.therapist.id} className={styles.availabilityCard}>
            <div className={styles.availabilityTop}>
              <div>
                <p className={styles.availabilityName}>{item.therapist.fullName}</p>
                <p className={styles.availabilityHours}>{item.therapist.workHours}</p>
              </div>
              <span className={styles.freeBadge}>{item.free} free</span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${item.fill}%`, backgroundColor: item.therapist.color }}
              />
            </div>
            <p className={styles.capacityText}>
              {item.booked} / {item.capacity} booked
            </p>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => onBlockSlot(item.therapist.id)}
            >
              Block Slot
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
