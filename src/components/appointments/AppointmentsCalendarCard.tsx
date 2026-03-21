import { CalendarRange, Clock3, Users } from "lucide-react";
import { ActiveView, Appointment } from "@/types/appointmentsDashboardTypes";
import styles from "./AppointmentsDashboardPage.module.css";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import {
  cx,
  formatDateLabel,
  parseDateOnly,
  toDateOnly,
} from "@/utils/appointmentsDashboardUtils";
import { SESSION_LABELS } from "@/data/appointmentsData/appointmentsDashboardData";

interface AppointmentsCalendarCardProps {
  activeView: ActiveView;
  selectedDate: Date;
  rangeDates: Date[];
  filteredForCurrentRange: Appointment[];
  groupedAgenda: [string, Appointment[]][];
  onEdit: (appointment: Appointment) => void;
  onToggleCancel: (appointmentId: string, isCancelled: boolean) => void;
}

export function AppointmentsCalendarCard({
  activeView,
  selectedDate,
  rangeDates,
  filteredForCurrentRange,
  groupedAgenda,
  onEdit,
  onToggleCancel,
}: AppointmentsCalendarCardProps) {
  const dayColumns =
    activeView === "day"
      ? [selectedDate]
      : activeView === "week"
        ? rangeDates.slice(0, 7)
        : activeView === "month"
          ? []
          : [selectedDate];

  return (
    <section className={styles.calendarCard}>
      {(activeView === "day" || activeView === "week") && (
        <div className={cx(styles.calendarGridScroller, activeView === "day" && styles.calendarGridScrollerSingle)}>
          <div className={cx(styles.calendarGrid, activeView === "day" && styles.calendarGridSingle)}>
            {dayColumns.map((columnDate) => {
              const key = toDateOnly(columnDate);
              const columnAppointments = filteredForCurrentRange.filter((item) => item.date === key);
              return (
                <article key={key} className={styles.dayColumn}>
                  <header className={styles.columnHeader}>
                    <span>{formatDateLabel(columnDate)}</span>
                    <span>{columnAppointments.length} sessions</span>
                  </header>
                  <div className={styles.columnContent}>
                    {columnAppointments.length === 0 && <p className={styles.emptyText}>No appointments</p>}
                    {columnAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={styles.appointmentCard}
                        style={{ borderLeftColor: appointment.therapist.color }}
                      >
                        <div className={styles.appointmentTop}>
                          <p className={styles.appointmentName}>{appointment.client.fullName}</p>
                          <AppointmentStatusBadge status={appointment.status} />
                        </div>
                        <p className={styles.appointmentMeta}>
                          <Clock3 size={12} />
                          {appointment.startTime} - {appointment.endTime} ({appointment.duration}m)
                        </p>
                        <p className={styles.appointmentMeta}>
                          <Users size={12} />
                          {appointment.therapist.fullName}
                        </p>
                        <div className={styles.appointmentActions}>
                          <button type="button" className={styles.ghostInline} onClick={() => onEdit(appointment)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.ghostInlineDanger}
                            onClick={() => onToggleCancel(appointment.id, appointment.status === "cancelled")}
                          >
                            {appointment.status === "cancelled" ? "Restore" : "Cancel"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {activeView === "month" && (
        <div className={styles.monthGrid}>
          {rangeDates.map((date) => {
            const key = toDateOnly(date);
            const dayAppointments = filteredForCurrentRange.filter((item) => item.date === key);
            const inCurrentMonth = date.getMonth() === selectedDate.getMonth();
            return (
              <article key={key} className={cx(styles.monthCell, !inCurrentMonth && styles.monthCellMuted)}>
                <div className={styles.monthCellHeader}>
                  <span>{date.getDate()}</span>
                  {dayAppointments.length > 0 && <span className={styles.monthCount}>{dayAppointments.length}</span>}
                </div>
                <div className={styles.monthCellBody}>
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <p key={appointment.id} className={styles.monthEvent}>
                      {appointment.startTime} {appointment.client.fullName}
                    </p>
                  ))}
                  {dayAppointments.length > 2 && <p className={styles.moreText}>+{dayAppointments.length - 2} more</p>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {activeView === "agenda" && (
        <div className={styles.agendaWrap}>
          {groupedAgenda.length === 0 && <p className={styles.emptyText}>No appointments in this range.</p>}
          {groupedAgenda.map(([date, dateAppointments]) => (
            <article key={date} className={styles.agendaGroup}>
              <header className={styles.agendaHeader}>
                <CalendarRange size={14} />
                {parseDateOnly(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </header>
              <div className={styles.tableWrap}>
                <table className={styles.agendaTable}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Client</th>
                      <th>Therapist</th>
                      <th>Type</th>
                      <th>Room</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          {appointment.startTime} - {appointment.endTime}
                        </td>
                        <td>{appointment.client.fullName}</td>
                        <td>{appointment.therapist.fullName}</td>
                        <td>
                          <span className={styles.typeBadge}>{SESSION_LABELS[appointment.sessionType]}</span>
                        </td>
                        <td>{appointment.room ?? "-"}</td>
                        <td>{appointment.duration} min</td>
                        <td>
                          <AppointmentStatusBadge status={appointment.status} />
                        </td>
                        <td>
                          <div className={styles.tableActions}>
                            <button type="button" className={styles.ghostInline} onClick={() => onEdit(appointment)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className={styles.ghostInlineDanger}
                              onClick={() => onToggleCancel(appointment.id, false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
