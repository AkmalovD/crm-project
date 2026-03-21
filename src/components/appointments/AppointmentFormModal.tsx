import { CheckCircle2, X } from "lucide-react";
import { AppointmentFormState, SessionType, Therapist } from "@/types/appointmentsDashboardTypes";
import { CURRENCY } from "@/utils/appointmentsDashboardUtils";
import styles from "./AppointmentsDashboardPage.module.css";

interface AppointmentFormModalProps {
  isEditing: boolean;
  formState: AppointmentFormState;
  therapists: Therapist[];
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (nextState: AppointmentFormState) => void;
}

export function AppointmentFormModal({
  isEditing,
  formState,
  therapists,
  onClose,
  onSubmit,
  onChange,
}: AppointmentFormModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <form className={styles.modal} onSubmit={onSubmit}>
        <header className={styles.modalHeader}>
          <h3>{isEditing ? "Edit Appointment" : "Create Appointment"}</h3>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close modal">
            <X size={14} />
          </button>
        </header>

        <div className={styles.modalGrid}>
          <label className={styles.field}>
            <span>Client Name</span>
            <input
              required
              value={formState.clientName}
              onChange={(event) => onChange({ ...formState, clientName: event.target.value })}
              placeholder="Client full name"
            />
          </label>

          <label className={styles.field}>
            <span>Client Phone</span>
            <input
              value={formState.clientPhone}
              onChange={(event) => onChange({ ...formState, clientPhone: event.target.value })}
              placeholder="+1 000-000-0000"
            />
          </label>

          <label className={styles.field}>
            <span>Therapist</span>
            <select
              value={formState.therapistId}
              onChange={(event) => onChange({ ...formState, therapistId: event.target.value })}
            >
              {therapists.map((therapist) => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.fullName}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Date</span>
            <input
              type="date"
              required
              value={formState.date}
              onChange={(event) => onChange({ ...formState, date: event.target.value })}
            />
          </label>

          <label className={styles.field}>
            <span>Start Time</span>
            <input
              type="time"
              required
              value={formState.startTime}
              onChange={(event) => onChange({ ...formState, startTime: event.target.value })}
            />
          </label>

          <label className={styles.field}>
            <span>Duration</span>
            <select
              value={formState.duration}
              onChange={(event) => onChange({ ...formState, duration: Number(event.target.value) })}
            >
              {[30, 45, 50, 60, 90].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} min
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Session Type</span>
            <select
              value={formState.sessionType}
              onChange={(event) => onChange({ ...formState, sessionType: event.target.value as SessionType })}
            >
              <option value="individual">Individual</option>
              <option value="group">Group</option>
              <option value="online">Online</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Room</span>
            <input value={formState.room} onChange={(event) => onChange({ ...formState, room: event.target.value })} />
          </label>

          <label className={styles.field}>
            <span>Price</span>
            <input
              type="number"
              min={0}
              value={formState.price}
              onChange={(event) => onChange({ ...formState, price: Number(event.target.value) })}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>Notes</span>
          <textarea
            value={formState.notes}
            onChange={(event) => onChange({ ...formState, notes: event.target.value })}
            rows={3}
          />
        </label>

        <footer className={styles.modalFooter}>
          <p className={styles.priceHint}>
            <CheckCircle2 size={14} />
            Estimated revenue: {CURRENCY.format(formState.price)}
          </p>
          <div className={styles.modalActions}>
            <button type="button" className={styles.secondaryButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton}>
              {isEditing ? "Save Changes" : "Create Appointment"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
