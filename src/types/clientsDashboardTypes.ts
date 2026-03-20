export type ClientStatus = "active" | "inactive" | "new" | "discharged" | "on_hold";
export type TherapyType = "individual" | "group" | "online";
export type SortBy = "name" | "age" | "lastSession" | "totalSessions";
export type SortDir = "asc" | "desc";

export interface Therapist {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  clientCode: string;
  age: number;
  dateOfBirth: string;
  primaryDiagnosis: string;
  assignedTherapist: Therapist;
  therapyType: TherapyType;
  status: ClientStatus;
  phone: string;
  lastSessionDate: string | null;
  totalSessions: number;
}
