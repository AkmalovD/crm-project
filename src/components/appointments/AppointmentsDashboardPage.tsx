"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Users,
  X,
} from "lucide-react";

import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import styles from "./AppointmentsDashboardPage.module.css";

type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled" | "rescheduled" | "no_show";
type SessionType = "individual" | "group" | "online";
type ActiveView = "day" | "week" | "month" | "agenda";
type PreferredTimeRange = "morning" | "afternoon" | "evening";

interface Therapist {
  id: string;
  fullName: string;
  color: string;
  workHours: string;
}

interface Client {
  id: string;
  fullName: string;
  phone: string;
}

interface Appointment {
  id: string;
  client: Client;
  therapist: Therapist;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  sessionType: SessionType;
  room: string | null;
  price: number;
  status: AppointmentStatus;
  notes: string | null;
  isWalkIn: boolean;
}

interface WaitlistEntry {
  id: string;
  client: Client;
  therapistId: string;
  preferredDays: string[];
  preferredTimeRange: PreferredTimeRange;
  sessionType: SessionType;
  notes: string | null;
}

interface AppointmentFormState {
  clientName: string;
  clientPhone: string;
  therapistId: string;
  date: string;
  startTime: string;
  duration: number;
  sessionType: SessionType;
  room: string;
  price: number;
  notes: string;
}

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
  no_show: "No-show",
};

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  confirmed: styles.statusConfirmed,
  pending: styles.statusPending,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
  rescheduled: styles.statusRescheduled,
  no_show: styles.statusNoShow,
};

const SESSION_LABELS: Record<SessionType, string> = {
  individual: "Individual",
  group: "Group",
  online: "Online",
};

const TIME_RANGE_LABELS: Record<PreferredTimeRange, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

const THERAPISTS: Therapist[] = [
  { id: "t-1", fullName: "Dr. Mia Carter", color: "#4acf7f", workHours: "09:00 - 18:00" },
  { id: "t-2", fullName: "Dr. Liam Evans", color: "#60a5fa", workHours: "08:30 - 17:30" },
  { id: "t-3", fullName: "Dr. Ava Pierce", color: "#f59e0b", workHours: "10:00 - 19:00" },
  { id: "t-4", fullName: "Dr. Noah Wells", color: "#8b5cf6", workHours: "09:30 - 17:00" },
];

const CLIENTS: Client[] = [
  { id: "c-101", fullName: "John Parker", phone: "+1 202-555-0101" },
  { id: "c-102", fullName: "Ariana Lopez", phone: "+1 202-555-0119" },
  { id: "c-103", fullName: "Ethan Morris", phone: "+1 202-555-0134" },
  { id: "c-104", fullName: "Sophia Reed", phone: "+1 202-555-0178" },
  { id: "c-105", fullName: "Oliver Shaw", phone: "+1 202-555-0163" },
  { id: "c-106", fullName: "Nora Kim", phone: "+1 202-555-0154" },
  { id: "c-107", fullName: "Mateo Hughes", phone: "+1 202-555-0180" },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "a-1001",
    client: CLIENTS[0],
    therapist: THERAPISTS[0],
    date: "2026-03-19",
    startTime: "09:00",
    endTime: "09:50",
    duration: 50,
    sessionType: "individual",
    room: "Room A",
    price: 80,
    status: "confirmed",
    notes: "Focus on articulation drills",
    isWalkIn: false,
  },
  {
    id: "a-1002",
    client: CLIENTS[1],
    therapist: THERAPISTS[1],
    date: "2026-03-19",
    startTime: "10:30",
    endTime: "11:20",
    duration: 50,
    sessionType: "group",
    room: "Room C",
    price: 65,
    status: "pending",
    notes: null,
    isWalkIn: false,
  },
  {
    id: "a-1003",
    client: CLIENTS[2],
    therapist: THERAPISTS[2],
    date: "2026-03-20",
    startTime: "13:00",
    endTime: "13:45",
    duration: 45,
    sessionType: "online",
    room: null,
    price: 70,
    status: "rescheduled",
    notes: "Send meeting link 10 mins before",
    isWalkIn: false,
  },
  {
    id: "a-1004",
    client: CLIENTS[3],
    therapist: THERAPISTS[0],
    date: "2026-03-21",
    startTime: "15:00",
    endTime: "15:50",
    duration: 50,
    sessionType: "individual",
    room: "Room B",
    price: 80,
    status: "confirmed",
    notes: null,
    isWalkIn: false,
  },
  {
    id: "a-1005",
    client: CLIENTS[4],
    therapist: THERAPISTS[3],
    date: "2026-03-19",
    startTime: "16:00",
    endTime: "16:50",
    duration: 50,
    sessionType: "individual",
    room: "Room D",
    price: 75,
    status: "cancelled",
    notes: "Client called to cancel",
    isWalkIn: false,
  },
];

const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    id: "w-1",
    client: CLIENTS[5],
    therapistId: THERAPISTS[0].id,
    preferredDays: ["Mon", "Wed", "Fri"],
    preferredTimeRange: "morning",
    sessionType: "individual",
    notes: null,
  },
  {
    id: "w-2",
    client: CLIENTS[6],
    therapistId: THERAPISTS[1].id,
    preferredDays: ["Tue", "Thu"],
    preferredTimeRange: "afternoon",
    sessionType: "group",
    notes: "Prefers after school hours",
  },
];

const DAY_MS = 24 * 60 * 60 * 1000;
const NUMBER = new Intl.NumberFormat("en-US");
const CURRENCY = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDateOnly(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function addDays(date: Date, amount: number) {
  return new Date(date.getTime() + amount * DAY_MS);
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function weekStart(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(copy, diff);
}

function buildRangeDates(selectedDate: Date, activeView: ActiveView) {
  if (activeView === "day" || activeView === "agenda") return [selectedDate];
  if (activeView === "week") {
    const start = weekStart(selectedDate);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const start = weekStart(monthStart);
  const days: Date[] = [];
  for (let cursor = start; cursor <= monthEnd || days.length % 7 !== 0 || days.length < 35; cursor = addDays(cursor, 1)) {
    days.push(cursor);
    if (days.length >= 42 && cursor > monthEnd && cursor.getDay() === 0) break;
  }
  return days;
}

function sortByDateTime(appointments: Appointment[]) {
  return [...appointments].sort((left, right) =>
    `${left.date}T${left.startTime}`.localeCompare(`${right.date}T${right.startTime}`),
  );
}

function calcEndTime(startTime: string, duration: number) {
  const [hour, minute] = startTime.split(":").map((value) => Number(value));
  const total = hour * 60 + minute + duration;
  const nextHour = Math.floor(total / 60) % 24;
  const nextMinute = total % 60;
  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
}

function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <span className={cx(styles.statusBadge, STATUS_CLASS[status])}>{STATUS_LABELS[status]}</span>;
}

export function AppointmentsDashboardPage() {
  const [activeView, setActiveView] = useState<ActiveView>("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-03-19T00:00:00"));
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(INITIAL_WAITLIST);
  const [therapistFilter, setTherapistFilter] = useState<string>("");
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [formState, setFormState] = useState<AppointmentFormState>({
    clientName: "",
    clientPhone: "",
    therapistId: THERAPISTS[0].id,
    date: toDateOnly(selectedDate),
    startTime: "09:00",
    duration: 50,
    sessionType: "individual",
    room: "",
    price: 80,
    notes: "",
  });

  const visibleAppointments = useMemo(() => {
    const byTherapist = therapistFilter ? appointments.filter((item) => item.therapist.id === therapistFilter) : appointments;
    return sortByDateTime(byTherapist);
  }, [appointments, therapistFilter]);

  const rangeDates = useMemo(() => buildRangeDates(selectedDate, activeView), [selectedDate, activeView]);

  const filteredForCurrentRange = useMemo(() => {
    const rangeKeys = new Set(rangeDates.map((item) => toDateOnly(item)));
    return visibleAppointments.filter((item) => rangeKeys.has(item.date));
  }, [visibleAppointments, rangeDates]);

  const selectedDateKey = toDateOnly(selectedDate);
  const appointmentsToday = visibleAppointments.filter((item) => item.date === selectedDateKey);
  const totalToday = appointmentsToday.length;
  const confirmedToday = appointmentsToday.filter((item) => item.status === "confirmed").length;
  const pendingToday = appointmentsToday.filter((item) => item.status === "pending").length;
  const cancelledToday = appointmentsToday.filter((item) => item.status === "cancelled").length;
  const availableSlots = Math.max(0, 20 - totalToday);

  const formattedRange = useMemo(() => {
    if (activeView === "day" || activeView === "agenda") {
      return selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
    }
    if (activeView === "week") {
      const start = weekStart(selectedDate);
      const end = addDays(start, 6);
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }
    return selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [activeView, selectedDate]);

  const groupedAgenda = useMemo(() => {
    const grouped = new Map<string, Appointment[]>();
    for (const item of filteredForCurrentRange) {
      const key = item.date;
      const list = grouped.get(key) ?? [];
      list.push(item);
      grouped.set(key, list);
    }
    return Array.from(grouped.entries()).sort((left, right) => left[0].localeCompare(right[0]));
  }, [filteredForCurrentRange]);

  const availability = THERAPISTS.map((therapist) => {
    const count = appointmentsToday.filter((item) => item.therapist.id === therapist.id).length;
    const capacity = 6;
    return {
      therapist,
      booked: count,
      capacity,
      free: Math.max(0, capacity - count),
      fill: Math.min(100, Math.round((count / capacity) * 100)),
    };
  });

  const goToToday = () => setSelectedDate(new Date());
  const goToPrev = () => setSelectedDate((current) => addDays(current, activeView === "month" ? -30 : activeView === "week" ? -7 : -1));
  const goToNext = () => setSelectedDate((current) => addDays(current, activeView === "month" ? 30 : activeView === "week" ? 7 : 1));

  const resetForm = (dateValue: string) => {
    setFormState({
      clientName: "",
      clientPhone: "",
      therapistId: THERAPISTS[0].id,
      date: dateValue,
      startTime: "09:00",
      duration: 50,
      sessionType: "individual",
      room: "",
      price: 80,
      notes: "",
    });
  };

  const openCreateModal = (prefill?: Partial<AppointmentFormState>) => {
    setEditingAppointmentId(null);
    resetForm(toDateOnly(selectedDate));
    setFormState((current) => ({ ...current, ...prefill }));
    setIsCreateModalOpen(true);
  };

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointmentId(appointment.id);
    setFormState({
      clientName: appointment.client.fullName,
      clientPhone: appointment.client.phone,
      therapistId: appointment.therapist.id,
      date: appointment.date,
      startTime: appointment.startTime,
      duration: appointment.duration,
      sessionType: appointment.sessionType,
      room: appointment.room ?? "",
      price: appointment.price,
      notes: appointment.notes ?? "",
    });
    setIsCreateModalOpen(true);
  };

  const cancelAppointment = (id: string) => {
    setAppointments((current) =>
      current.map((item) => (item.id === id ? { ...item, status: item.status === "cancelled" ? "confirmed" : "cancelled" } : item)),
    );
  };

  const convertWaitlistToBooking = (entry: WaitlistEntry) => {
    setIsWaitlistOpen(false);
    openCreateModal({
      clientName: entry.client.fullName,
      clientPhone: entry.client.phone,
      therapistId: entry.therapistId,
      sessionType: entry.sessionType,
    });
  };

  const removeWaitlistEntry = (id: string) => {
    setWaitlist((current) => current.filter((item) => item.id !== id));
  };

  const submitAppointment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const therapist = THERAPISTS.find((item) => item.id === formState.therapistId) ?? THERAPISTS[0];
    const client: Client = {
      id: `c-${Date.now()}`,
      fullName: formState.clientName || "Walk-in Client",
      phone: formState.clientPhone || "N/A",
    };
    const nextAppointment: Appointment = {
      id: editingAppointmentId ?? `a-${Date.now()}`,
      client,
      therapist,
      date: formState.date,
      startTime: formState.startTime,
      endTime: calcEndTime(formState.startTime, formState.duration),
      duration: formState.duration,
      sessionType: formState.sessionType,
      room: formState.room || null,
      price: formState.price,
      status: editingAppointmentId ? "rescheduled" : "confirmed",
      notes: formState.notes || null,
      isWalkIn: !CLIENTS.some((knownClient) => knownClient.fullName === formState.clientName),
    };

    setAppointments((current) => {
      if (editingAppointmentId) {
        return current.map((item) => (item.id === editingAppointmentId ? nextAppointment : item));
      }
      return sortByDateTime([...current, nextAppointment]);
    });

    setIsCreateModalOpen(false);
    setEditingAppointmentId(null);
  };

  const dayColumns =
    activeView === "day"
      ? [selectedDate]
      : activeView === "week"
        ? rangeDates.slice(0, 7)
        : activeView === "month"
          ? []
          : [selectedDate];

  return (
    <DashboardScaffold>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Appointments</h1>
            <span className={styles.subtitle}>Manage sessions, waitlist, and therapist availability</span>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.dateNav}>
              <button type="button" className={styles.iconButton} onClick={goToPrev} aria-label="Go to previous range">
                <ChevronLeft size={16} />
              </button>
              <button type="button" className={styles.secondaryButton} onClick={goToToday}>
                Today
              </button>
              <button type="button" className={styles.iconButton} onClick={goToNext} aria-label="Go to next range">
                <ChevronRight size={16} />
              </button>
              <span className={styles.rangeLabel}>{formattedRange}</span>
            </div>
            <select
              className={styles.select}
              value={therapistFilter}
              onChange={(event) => setTherapistFilter(event.target.value)}
              aria-label="Filter by therapist"
            >
              <option value="">All therapists</option>
              {THERAPISTS.map((therapist) => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.fullName}
                </option>
              ))}
            </select>
            <button type="button" className={styles.primaryButton} onClick={() => openCreateModal()}>
              <Plus size={16} />
              New Appointment
            </button>
          </div>
        </header>

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

        <section className={styles.viewToggle}>
          {(["day", "week", "month", "agenda"] as const).map((view) => (
            <button
              key={view}
              type="button"
              className={cx(styles.viewButton, activeView === view && styles.viewButtonActive)}
              onClick={() => setActiveView(view)}
            >
              {view[0].toUpperCase()}
              {view.slice(1)}
            </button>
          ))}
        </section>

        <div className={styles.mainLayout}>
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
                            <div key={appointment.id} className={styles.appointmentCard} style={{ borderLeftColor: appointment.therapist.color }}>
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
                                <button type="button" className={styles.ghostInline} onClick={() => openEditModal(appointment)}>
                                  Edit
                                </button>
                                <button type="button" className={styles.ghostInlineDanger} onClick={() => cancelAppointment(appointment.id)}>
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
                      {parseDateOnly(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
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
                                  <button type="button" className={styles.ghostInline} onClick={() => openEditModal(appointment)}>
                                    Edit
                                  </button>
                                  <button type="button" className={styles.ghostInlineDanger} onClick={() => cancelAppointment(appointment.id)}>
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

          {isWaitlistOpen && (
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
                      <button type="button" className={styles.secondaryButton} onClick={() => convertWaitlistToBooking(entry)}>
                        Convert
                      </button>
                      <button type="button" className={styles.iconButton} onClick={() => removeWaitlistEntry(entry.id)} aria-label="Remove entry">
                        <X size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          )}
        </div>

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
                  <div className={styles.progressFill} style={{ width: `${item.fill}%`, backgroundColor: item.therapist.color }} />
                </div>
                <p className={styles.capacityText}>
                  {item.booked} / {item.capacity} booked
                </p>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() =>
                    openCreateModal({
                      therapistId: item.therapist.id,
                      date: selectedDateKey,
                      startTime: "12:00",
                      duration: 30,
                      notes: "Blocked slot",
                    })
                  }
                >
                  Block Slot
                </button>
              </article>
            ))}
          </div>
        </section>

        <button type="button" className={styles.waitlistToggle} onClick={() => setIsWaitlistOpen((current) => !current)}>
          <CalendarDays size={14} />
          Waitlist ({waitlist.length})
        </button>
      </div>

      {isCreateModalOpen && (
        <div className={styles.modalOverlay}>
          <form className={styles.modal} onSubmit={submitAppointment}>
            <header className={styles.modalHeader}>
              <h3>{editingAppointmentId ? "Edit Appointment" : "Create Appointment"}</h3>
              <button type="button" className={styles.iconButton} onClick={() => setIsCreateModalOpen(false)} aria-label="Close modal">
                <X size={14} />
              </button>
            </header>

            <div className={styles.modalGrid}>
              <label className={styles.field}>
                <span>Client Name</span>
                <input
                  required
                  value={formState.clientName}
                  onChange={(event) => setFormState((current) => ({ ...current, clientName: event.target.value }))}
                  placeholder="Client full name"
                />
              </label>

              <label className={styles.field}>
                <span>Client Phone</span>
                <input
                  value={formState.clientPhone}
                  onChange={(event) => setFormState((current) => ({ ...current, clientPhone: event.target.value }))}
                  placeholder="+1 000-000-0000"
                />
              </label>

              <label className={styles.field}>
                <span>Therapist</span>
                <select
                  value={formState.therapistId}
                  onChange={(event) => setFormState((current) => ({ ...current, therapistId: event.target.value }))}
                >
                  {THERAPISTS.map((therapist) => (
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
                  onChange={(event) => setFormState((current) => ({ ...current, date: event.target.value }))}
                />
              </label>

              <label className={styles.field}>
                <span>Start Time</span>
                <input
                  type="time"
                  required
                  value={formState.startTime}
                  onChange={(event) => setFormState((current) => ({ ...current, startTime: event.target.value }))}
                />
              </label>

              <label className={styles.field}>
                <span>Duration</span>
                <select
                  value={formState.duration}
                  onChange={(event) => setFormState((current) => ({ ...current, duration: Number(event.target.value) }))}
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
                  onChange={(event) => setFormState((current) => ({ ...current, sessionType: event.target.value as SessionType }))}
                >
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="online">Online</option>
                </select>
              </label>

              <label className={styles.field}>
                <span>Room</span>
                <input value={formState.room} onChange={(event) => setFormState((current) => ({ ...current, room: event.target.value }))} />
              </label>

              <label className={styles.field}>
                <span>Price</span>
                <input
                  type="number"
                  min={0}
                  value={formState.price}
                  onChange={(event) => setFormState((current) => ({ ...current, price: Number(event.target.value) }))}
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>Notes</span>
              <textarea
                value={formState.notes}
                onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))}
                rows={3}
              />
            </label>

            <footer className={styles.modalFooter}>
              <p className={styles.priceHint}>
                <CheckCircle2 size={14} />
                Estimated revenue: {CURRENCY.format(formState.price)}
              </p>
              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryButton} onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  {editingAppointmentId ? "Save Changes" : "Create Appointment"}
                </button>
              </div>
            </footer>
          </form>
        </div>
      )}
    </DashboardScaffold>
  );
}
