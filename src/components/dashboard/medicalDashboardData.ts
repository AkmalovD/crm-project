import { Activity, CalendarDays, DollarSign, Users } from "lucide-react";
import { Patient, StatCardConfig } from "./medicalDashboardTypes";

export const PRIMARY = "#4acf7f";
export const PAGE_SIZE = 10;

export const SESSION_CHART_DATA = [
  { day: "Mo", sessions: 220, patients: 50, appointments: 80 },
  { day: "Tu", sessions: 320, patients: 80, appointments: 150 },
  { day: "We", sessions: 280, patients: 100, appointments: 200 },
  { day: "Th", sessions: 200, patients: 70, appointments: 120 },
  { day: "Fr", sessions: 380, patients: 110, appointments: 250 },
  { day: "St", sessions: 180, patients: 60, appointments: 160 },
  { day: "Su", sessions: 460, patients: 130, appointments: 380 },
];

export const CITIES = [
  { name: "Rivne", x: 70, y: 40, dot: PRIMARY, pct: "+89%" },
  { name: "Kyiv", x: 142, y: 45, dot: "#60a5fa", pct: "+60%" },
  { name: "Lviv", x: 33, y: 57, dot: "#f472b6", pct: "+48%" },
  { name: "Cherkasy", x: 168, y: 66, dot: "#fbbf24", pct: "+30%" },
  { name: "Ivano-Frankivsk", x: 45, y: 77, dot: "#94a3b8", pct: "" },
  { name: "Uzhhorod", x: 8, y: 83, dot: "#94a3b8", pct: "" },
  { name: "Odesa", x: 145, y: 128, dot: "#94a3b8", pct: "" },
];

export const STAT_CARDS: StatCardConfig[] = [
  {
    label: "Total Sessions",
    value: "1,284",
    delta: "+18.45%",
    deltaPositive: true,
    link: "View session history",
    Icon: Activity,
  },
  {
    label: "Appointments",
    value: "+36",
    delta: "-3.75%",
    deltaPositive: false,
    link: "View all appointments",
    Icon: CalendarDays,
  },
  {
    label: "Patients",
    value: "248",
    delta: "+12",
    deltaPositive: true,
    link: "See patient list",
    Icon: Users,
  },
  {
    label: "Balance",
    value: "$12,450",
    delta: "+0.00%",
    deltaPositive: true,
    link: "Withdraw funds",
    Icon: DollarSign,
  },
];

export const MOCK_PATIENTS: Patient[] = [
  { id: "1", name: "Lviv Forum Clinic", therapist: { name: "Nataly Chaplack", initials: "NC", color: "#f87171" }, progress: 84, nextSession: "31/04/2024", completed: 78.9, visits: 1289, status: "Active" },
  { id: "2", name: "Blockbuster Recovery", therapist: { name: "Yulian Yalovenko", initials: "YY", color: "#60a5fa" }, progress: 83.6, nextSession: "31/04/2024", completed: 65.9, visits: 1400, status: "Active" },
  { id: "3", name: "Lavina Speech Center", therapist: { name: "Apanovych Lubomudr", initials: "AL", color: "#a78bfa" }, progress: 83.4, nextSession: "31/04/2024", completed: 78.9, visits: 1490, status: "Active" },
  { id: "4", name: "River Mind Clinic", therapist: { name: "Mary Croostina", initials: "MC", color: "#fb923c" }, progress: 83, nextSession: "31/04/2024", completed: 90.8, visits: 12500, status: "On Hold" },
  { id: "5", name: "King Cross Therapy", therapist: { name: "Shchastislav Yurchuk", initials: "SY", color: "#34d399" }, progress: 82.5, nextSession: "31/04/2024", completed: 78.6, visits: 678, status: "Active" },
  { id: "6", name: "Victoria Speech Lab", therapist: { name: "Diana Berigan", initials: "DB", color: "#f472b6" }, progress: 82.3, nextSession: "31/04/2024", completed: 56.3, visits: 4560, status: "Active" },
  { id: "7", name: "Hollywood Logopedic", therapist: { name: "Mary Chaplack", initials: "MC", color: "#fb923c" }, progress: 82, nextSession: "31/04/2024", completed: 78.9, visits: 1289, status: "On Hold" },
  { id: "8", name: "Kyiv Central Clinic", therapist: { name: "Ivan Petrenko", initials: "IP", color: "#38bdf8" }, progress: 81.5, nextSession: "02/05/2024", completed: 74.2, visits: 2100, status: "Active" },
  { id: "9", name: "Dnipro Health Hub", therapist: { name: "Olena Kovalenko", initials: "OK", color: "#4ade80" }, progress: 81.2, nextSession: "03/05/2024", completed: 67.5, visits: 980, status: "Active" },
  { id: "10", name: "Odesa Speech Ctr", therapist: { name: "Viktor Melnyk", initials: "VM", color: "#818cf8" }, progress: 80.8, nextSession: "04/05/2024", completed: 71.3, visits: 3200, status: "Active" },
  { id: "11", name: "Kharkiv Med Center", therapist: { name: "Andriy Bondar", initials: "AB", color: "#fb7185" }, progress: 80.5, nextSession: "05/05/2024", completed: 60.1, visits: 1750, status: "On Hold" },
  { id: "12", name: "Lviv East Clinic", therapist: { name: "Sofiia Savchenko", initials: "SS", color: "#c084fc" }, progress: 80.1, nextSession: "06/05/2024", completed: 82.4, visits: 890, status: "Active" },
  { id: "13", name: "Zhytomyr Recovery", therapist: { name: "Mykola Tkachenko", initials: "MT", color: "#2dd4bf" }, progress: 79.8, nextSession: "07/05/2024", completed: 59.7, visits: 1120, status: "Active" },
  { id: "14", name: "Poltava Logopedic", therapist: { name: "Iryna Moroz", initials: "IM", color: "#facc15" }, progress: 79.5, nextSession: "08/05/2024", completed: 73.8, visits: 2340, status: "Active" },
  { id: "15", name: "Sumy Speech Lab", therapist: { name: "Bohdan Kravchenko", initials: "BK", color: "#f87171" }, progress: 79.2, nextSession: "09/05/2024", completed: 55, visits: 760, status: "On Hold" },
  { id: "16", name: "Chernivtsi Clinic", therapist: { name: "Oksana Marchenko", initials: "OM", color: "#60a5fa" }, progress: 78.9, nextSession: "10/05/2024", completed: 80.2, visits: 1430, status: "Active" },
  { id: "17", name: "Lutsk Health Ctr", therapist: { name: "Vasyl Kovalchuk", initials: "VK", color: "#a78bfa" }, progress: 78.6, nextSession: "11/05/2024", completed: 66.7, visits: 560, status: "Active" },
  { id: "18", name: "Ivano Logopedic", therapist: { name: "Natalia Boychuk", initials: "NB", color: "#fb923c" }, progress: 78.3, nextSession: "12/05/2024", completed: 71.1, visits: 1890, status: "Active" },
  { id: "19", name: "Ternopil Speech", therapist: { name: "Roman Panasiuk", initials: "RP", color: "#34d399" }, progress: 78, nextSession: "13/05/2024", completed: 77.5, visits: 2010, status: "Active" },
  { id: "20", name: "Rivne Med Center", therapist: { name: "Halyna Lysenko", initials: "HL", color: "#f472b6" }, progress: 77.7, nextSession: "14/05/2024", completed: 53.9, visits: 670, status: "On Hold" },
  { id: "21", name: "Uzhhorod Clinic", therapist: { name: "Dmytro Shevchenko", initials: "DS", color: "#38bdf8" }, progress: 77.4, nextSession: "15/05/2024", completed: 84.6, visits: 1100, status: "Active" },
  { id: "22", name: "Cherkasy Recovery", therapist: { name: "Larysa Karpenko", initials: "LK", color: "#4ade80" }, progress: 77.1, nextSession: "16/05/2024", completed: 69.3, visits: 3450, status: "Active" },
  { id: "23", name: "Vinnytsia Speech", therapist: { name: "Taras Bondarenko", initials: "TB", color: "#818cf8" }, progress: 76.8, nextSession: "17/05/2024", completed: 61.8, visits: 890, status: "Active" },
  { id: "24", name: "Mykolaiv Logoped", therapist: { name: "Svitlana Rudenko", initials: "SR", color: "#fb7185" }, progress: 76.5, nextSession: "18/05/2024", completed: 75.4, visits: 2200, status: "Active" },
  { id: "25", name: "Zaporizhzhia Ctr", therapist: { name: "Oleksandr Sydorenko", initials: "OS", color: "#c084fc" }, progress: 76.2, nextSession: "19/05/2024", completed: 50.6, visits: 1340, status: "On Hold" },
  { id: "26", name: "Kremenchuk Clinic", therapist: { name: "Yuliia Pavlenko", initials: "YP", color: "#2dd4bf" }, progress: 75.9, nextSession: "20/05/2024", completed: 79.1, visits: 780, status: "Active" },
  { id: "27", name: "Mariupol Speech", therapist: { name: "Serhiy Kovalenko", initials: "SK", color: "#facc15" }, progress: 75.6, nextSession: "21/05/2024", completed: 72.3, visits: 1560, status: "Active" },
  { id: "28", name: "Kryvyi Rih Ctr", therapist: { name: "Nataliia Honcharenko", initials: "NH", color: "#f87171" }, progress: 75.3, nextSession: "22/05/2024", completed: 63.7, visits: 2890, status: "Active" },
  { id: "29", name: "Berdychiv Recovery", therapist: { name: "Andrii Shevchuk", initials: "AS", color: "#60a5fa" }, progress: 75, nextSession: "23/05/2024", completed: 58.2, visits: 430, status: "Active" },
  { id: "30", name: "Khmelnytskyi Lab", therapist: { name: "Oksana Petrychenko", initials: "OP", color: "#a78bfa" }, progress: 74.7, nextSession: "24/05/2024", completed: 47.9, visits: 1020, status: "On Hold" },
];
