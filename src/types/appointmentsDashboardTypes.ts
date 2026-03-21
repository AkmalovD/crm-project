export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "no_show";
export type SessionType = "individual" | "group" | "online";
export type ActiveView = "day" | "week" | "month" | "agenda";
export type PreferredTimeRange = "morning" | "afternoon" | "evening";

export interface Therapist {
  id: string;
  fullName: string;
  color: string;
  workHours: string;
}

export interface Client {
  id: string;
  fullName: string;
  phone: string;
}

export interface Appointment {
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

export interface WaitlistEntry {
  id: string;
  client: Client;
  therapistId: string;
  preferredDays: string[];
  preferredTimeRange: PreferredTimeRange;
  sessionType: SessionType;
  notes: string | null;
}

export interface AppointmentFormState {
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
