"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";

import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import { AppointmentFormModal } from "./AppointmentFormModal";
import { AppointmentsAvailabilitySection } from "./AppointmentsAvailabilitySection";
import { AppointmentsCalendarCard } from "./AppointmentsCalendarCard";
import { AppointmentsHeader } from "./AppointmentsHeader";
import { AppointmentsStatsBar } from "./AppointmentsStatsBar";
import { AppointmentsViewToggle } from "./AppointmentsViewToggle";
import { AppointmentsWaitlistPanel } from "./AppointmentsWaitlistPanel";
import {
  CLIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_WAITLIST,
  THERAPISTS,
} from "@/data/appointmentsData/appointmentsDashboardData";
import styles from "./AppointmentsDashboardPage.module.css";
import {
  ActiveView,
  Appointment,
  AppointmentFormState,
  Client,
  WaitlistEntry,
} from "@/types/appointmentsDashboardTypes";
import {
  addDays,
  buildRangeDates,
  calcEndTime,
  sortByDateTime,
  toDateOnly,
  weekStart,
} from "@/utils/appointmentsDashboardUtils";

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
    const byTherapist = therapistFilter
      ? appointments.filter((item) => item.therapist.id === therapistFilter)
      : appointments;
    return sortByDateTime(byTherapist);
  }, [appointments, therapistFilter]);

  const rangeDates = useMemo(
    () => buildRangeDates(selectedDate, activeView),
    [selectedDate, activeView],
  );

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
      return selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    if (activeView === "week") {
      const start = weekStart(selectedDate);
      const end = addDays(start, 6);
      return `${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${end.toLocaleDateString("en-US", {
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
  const goToPrev = () =>
    setSelectedDate((current) =>
      addDays(current, activeView === "month" ? -30 : activeView === "week" ? -7 : -1),
    );
  const goToNext = () =>
    setSelectedDate((current) =>
      addDays(current, activeView === "month" ? 30 : activeView === "week" ? 7 : 1),
    );

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
      current.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "cancelled" ? "confirmed" : "cancelled" }
          : item,
      ),
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

  return (
    <DashboardScaffold>
      <div className={styles.page}>
        <AppointmentsHeader
          formattedRange={formattedRange}
          therapistFilter={therapistFilter}
          therapists={THERAPISTS}
          onPrev={goToPrev}
          onToday={goToToday}
          onNext={goToNext}
          onTherapistFilterChange={setTherapistFilter}
          onNewAppointment={() => openCreateModal()}
        />

        <AppointmentsStatsBar
          totalToday={totalToday}
          confirmedToday={confirmedToday}
          pendingToday={pendingToday}
          cancelledToday={cancelledToday}
          availableSlots={availableSlots}
        />

        <AppointmentsViewToggle activeView={activeView} onChange={setActiveView} />

        <div className={styles.mainLayout}>
          <AppointmentsCalendarCard
            activeView={activeView}
            selectedDate={selectedDate}
            rangeDates={rangeDates}
            filteredForCurrentRange={filteredForCurrentRange}
            groupedAgenda={groupedAgenda}
            onEdit={openEditModal}
            onToggleCancel={cancelAppointment}
          />

          {isWaitlistOpen && (
            <AppointmentsWaitlistPanel
              waitlist={waitlist}
              onConvert={convertWaitlistToBooking}
              onRemove={removeWaitlistEntry}
            />
          )}
        </div>

        <AppointmentsAvailabilitySection
          availability={availability}
          onBlockSlot={(therapistId) =>
            openCreateModal({
              therapistId,
              date: selectedDateKey,
              startTime: "12:00",
              duration: 30,
              notes: "Blocked slot",
            })
          }
        />

        <button
          type="button"
          className={styles.waitlistToggle}
          onClick={() => setIsWaitlistOpen((current) => !current)}
        >
          <CalendarDays size={14} />
          Waitlist ({waitlist.length})
        </button>
      </div>

      {isCreateModalOpen && (
        <AppointmentFormModal
          isEditing={Boolean(editingAppointmentId)}
          formState={formState}
          therapists={THERAPISTS}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={submitAppointment}
          onChange={setFormState}
        />
      )}
    </DashboardScaffold>
  );
}
