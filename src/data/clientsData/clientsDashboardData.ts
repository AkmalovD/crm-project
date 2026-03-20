import { Client, ClientStatus, Therapist, TherapyType } from "./clientsDashboardTypes";

export const THERAPISTS: Therapist[] = [
  { id: "t-1", name: "Dr. Mia Carter" },
  { id: "t-2", name: "Dr. Liam Evans" },
  { id: "t-3", name: "Dr. Ava Pierce" },
  { id: "t-4", name: "Dr. Noah Wells" },
];

export const CLIENTS: Client[] = [
  { id: "c-1001", firstName: "John", lastName: "Parker", fullName: "John Parker", clientCode: "CL-1001", age: 8, dateOfBirth: "2017-06-11", primaryDiagnosis: "Articulation disorder", assignedTherapist: THERAPISTS[0], therapyType: "individual", status: "active", phone: "+1 202-555-0101", lastSessionDate: "2026-03-12", totalSessions: 36 },
  { id: "c-1002", firstName: "Ariana", lastName: "Lopez", fullName: "Ariana Lopez", clientCode: "CL-1002", age: 12, dateOfBirth: "2013-01-22", primaryDiagnosis: "Fluency disorder", assignedTherapist: THERAPISTS[1], therapyType: "group", status: "active", phone: "+1 202-555-0119", lastSessionDate: "2026-03-10", totalSessions: 42 },
  { id: "c-1003", firstName: "Ethan", lastName: "Morris", fullName: "Ethan Morris", clientCode: "CL-1003", age: 16, dateOfBirth: "2009-08-30", primaryDiagnosis: "Voice disorder", assignedTherapist: THERAPISTS[2], therapyType: "online", status: "on_hold", phone: "+1 202-555-0134", lastSessionDate: "2026-02-19", totalSessions: 18 },
  { id: "c-1004", firstName: "Sophia", lastName: "Reed", fullName: "Sophia Reed", clientCode: "CL-1004", age: 7, dateOfBirth: "2018-03-07", primaryDiagnosis: "Language delay", assignedTherapist: THERAPISTS[3], therapyType: "individual", status: "new", phone: "+1 202-555-0178", lastSessionDate: null, totalSessions: 0 },
  { id: "c-1005", firstName: "Oliver", lastName: "Shaw", fullName: "Oliver Shaw", clientCode: "CL-1005", age: 10, dateOfBirth: "2015-11-19", primaryDiagnosis: "Childhood apraxia of speech", assignedTherapist: THERAPISTS[0], therapyType: "individual", status: "active", phone: "+1 202-555-0163", lastSessionDate: "2026-03-13", totalSessions: 51 },
  { id: "c-1006", firstName: "Nora", lastName: "Kim", fullName: "Nora Kim", clientCode: "CL-1006", age: 19, dateOfBirth: "2006-09-14", primaryDiagnosis: "Aphasia support", assignedTherapist: THERAPISTS[2], therapyType: "online", status: "inactive", phone: "+1 202-555-0154", lastSessionDate: "2025-12-03", totalSessions: 23 },
  { id: "c-1007", firstName: "Mateo", lastName: "Hughes", fullName: "Mateo Hughes", clientCode: "CL-1007", age: 14, dateOfBirth: "2011-02-25", primaryDiagnosis: "Stuttering management", assignedTherapist: THERAPISTS[1], therapyType: "group", status: "active", phone: "+1 202-555-0180", lastSessionDate: "2026-03-11", totalSessions: 39 },
  { id: "c-1008", firstName: "Maya", lastName: "Davis", fullName: "Maya Davis", clientCode: "CL-1008", age: 28, dateOfBirth: "1997-05-10", primaryDiagnosis: "Adult articulation", assignedTherapist: THERAPISTS[3], therapyType: "individual", status: "discharged", phone: "+1 202-555-0124", lastSessionDate: "2026-01-14", totalSessions: 64 },
  { id: "c-1009", firstName: "Noah", lastName: "Stone", fullName: "Noah Stone", clientCode: "CL-1009", age: 9, dateOfBirth: "2016-04-18", primaryDiagnosis: "Phonological disorder", assignedTherapist: THERAPISTS[0], therapyType: "individual", status: "active", phone: "+1 202-555-0192", lastSessionDate: "2026-03-09", totalSessions: 27 },
  { id: "c-1010", firstName: "Layla", lastName: "Turner", fullName: "Layla Turner", clientCode: "CL-1010", age: 11, dateOfBirth: "2014-10-05", primaryDiagnosis: "Expressive language disorder", assignedTherapist: THERAPISTS[2], therapyType: "group", status: "new", phone: "+1 202-555-0147", lastSessionDate: null, totalSessions: 0 },
  { id: "c-1011", firstName: "Benjamin", lastName: "Cook", fullName: "Benjamin Cook", clientCode: "CL-1011", age: 31, dateOfBirth: "1994-07-03", primaryDiagnosis: "Voice rehabilitation", assignedTherapist: THERAPISTS[3], therapyType: "online", status: "active", phone: "+1 202-555-0111", lastSessionDate: "2026-03-08", totalSessions: 16 },
  { id: "c-1012", firstName: "Amelia", lastName: "Price", fullName: "Amelia Price", clientCode: "CL-1012", age: 6, dateOfBirth: "2019-01-12", primaryDiagnosis: "Speech sound disorder", assignedTherapist: THERAPISTS[1], therapyType: "individual", status: "active", phone: "+1 202-555-0188", lastSessionDate: "2026-03-15", totalSessions: 33 },
];

export const PAGE_SIZE = 8;

export const STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  new: "New",
  discharged: "Discharged",
  on_hold: "On Hold",
};

export const THERAPY_LABELS: Record<TherapyType, string> = {
  individual: "Individual",
  group: "Group",
  online: "Online",
};
