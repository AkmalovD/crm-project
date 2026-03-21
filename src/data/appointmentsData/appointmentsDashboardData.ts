import {
  Appointment,
  AppointmentStatus,
  Client,
  PreferredTimeRange,
  SessionType,
  Therapist,
  WaitlistEntry,
} from "@/types/appointmentsDashboardTypes";
import styles from "@/components/appointments/AppointmentsDashboardPage.module.css";

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
  no_show: "No-show",
};

export const STATUS_CLASS: Record<AppointmentStatus, string> = {
  confirmed: styles.statusConfirmed,
  pending: styles.statusPending,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
  rescheduled: styles.statusRescheduled,
  no_show: styles.statusNoShow,
};

export const SESSION_LABELS: Record<SessionType, string> = {
  individual: "Individual",
  group: "Group",
  online: "Online",
};

export const TIME_RANGE_LABELS: Record<PreferredTimeRange, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export const THERAPISTS: Therapist[] = [
  { id: "t-1", fullName: "Dr. Mia Carter", color: "#4acf7f", workHours: "09:00 - 18:00" },
  { id: "t-2", fullName: "Dr. Liam Evans", color: "#60a5fa", workHours: "08:30 - 17:30" },
  { id: "t-3", fullName: "Dr. Ava Pierce", color: "#f59e0b", workHours: "10:00 - 19:00" },
  { id: "t-4", fullName: "Dr. Noah Wells", color: "#8b5cf6", workHours: "09:30 - 17:00" },
];

export const CLIENTS: Client[] = [
  { id: "c-101", fullName: "John Parker", phone: "+1 202-555-0101" },
  { id: "c-102", fullName: "Ariana Lopez", phone: "+1 202-555-0119" },
  { id: "c-103", fullName: "Ethan Morris", phone: "+1 202-555-0134" },
  { id: "c-104", fullName: "Sophia Reed", phone: "+1 202-555-0178" },
  { id: "c-105", fullName: "Oliver Shaw", phone: "+1 202-555-0163" },
  { id: "c-106", fullName: "Nora Kim", phone: "+1 202-555-0154" },
  { id: "c-107", fullName: "Mateo Hughes", phone: "+1 202-555-0180" },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
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

export const INITIAL_WAITLIST: WaitlistEntry[] = [
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
