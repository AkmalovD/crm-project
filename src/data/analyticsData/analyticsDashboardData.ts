import { KpiItem, MonthlyOverviewItem, TherapistItem } from "@/types/analyticsDashboardTypes"

export const PRIMARY = "#4acf7f";
export const TABS = ["Overview", "Sessions", "Revenue", "Clients", "Therapists"] as const;

export const KPI_DATA: readonly KpiItem[] = [
  { label: "Total Sessions", value: 1284, trend: 12, suffix: "% vs last month", spark: [10, 16, 12, 20, 18, 26, 24] },
  {
    label: "Average Sessions Per Day",
    value: 42,
    trend: 5,
    suffix: "% vs last month",
    spark: [5, 8, 6, 9, 10, 12, 11],
  },
  { label: "Total Revenue", value: 24500, trend: 8.3, suffix: "% vs last month", spark: [12, 14, 18, 16, 21, 23, 26] },
  { label: "Client Retention Rate", value: 87, trend: -2, suffix: "% vs last month", spark: [30, 28, 26, 23, 22, 20, 18] },
  {
    label: "Average Session Duration",
    value: 48,
    valueSuffix: " min",
    trend: 3,
    suffix: "min vs last month",
    spark: [20, 18, 23, 22, 26, 24, 27],
  },
];

export const MONTHLY_OVERVIEW: MonthlyOverviewItem[] = [
  { month: "Jan", sessions: 98, revenue: 1420, newClients: 22, returningClients: 48 },
  { month: "Feb", sessions: 110, revenue: 1580, newClients: 19, returningClients: 52 },
  { month: "Mar", sessions: 118, revenue: 1710, newClients: 24, returningClients: 54 },
  { month: "Apr", sessions: 126, revenue: 1820, newClients: 26, returningClients: 58 },
  { month: "May", sessions: 130, revenue: 1940, newClients: 27, returningClients: 61 },
  { month: "Jun", sessions: 138, revenue: 2080, newClients: 29, returningClients: 64 },
  { month: "Jul", sessions: 144, revenue: 2180, newClients: 31, returningClients: 66 },
  { month: "Aug", sessions: 142, revenue: 2140, newClients: 30, returningClients: 64 },
  { month: "Sep", sessions: 150, revenue: 2280, newClients: 28, returningClients: 70 },
  { month: "Oct", sessions: 156, revenue: 2360, newClients: 26, returningClients: 74 },
  { month: "Nov", sessions: 160, revenue: 2440, newClients: 25, returningClients: 77 },
  { month: "Dec", sessions: 172, revenue: 2650, newClients: 27, returningClients: 81 },
];

export const AGE_DISTRIBUTION = [
  { group: "3-6 years", pct: 26, count: 132 },
  { group: "7-12 years", pct: 32, count: 164 },
  { group: "13-17 years", pct: 18, count: 94 },
  { group: "18-35 years", pct: 14, count: 76 },
  { group: "35+ years", pct: 10, count: 55 },
];

export const OUTCOME_DATA = [
  { name: "Completed", value: 902, color: "#4acf7f" },
  { name: "Cancelled", value: 132, color: "#ef4444" },
  { name: "No-show", value: 97, color: "#f59e0b" },
  { name: "Rescheduled", value: 153, color: "#60a5fa" },
];

export const SERVICES_BY_REVENUE = [
  { service: "Individual Therapy", revenue: 8600 },
  { service: "Group Therapy", revenue: 5600 },
  { service: "Assessment", revenue: 4200 },
  { service: "Consultation", revenue: 3600 },
  { service: "Online Session", revenue: 2500 },
];

export const CANCELLATION_REASONS = [
  { name: "Client illness", value: 31, color: "#4acf7f" },
  { name: "Schedule conflict", value: 27, color: "#60a5fa" },
  { name: "No reason given", value: 18, color: "#f59e0b" },
  { name: "Therapist unavailable", value: 14, color: "#ef4444" },
  { name: "Emergency", value: 10, color: "#8b5cf6" },
];

export const FUNNEL_DATA = [
  { value: 420, name: "Total New Clients" },
  { value: 344, name: "Completed First Session" },
  { value: 275, name: "Booked 2nd Session" },
  { value: 198, name: "Active (5+ sessions)" },
  { value: 156, name: "Long-term (3+ months)" },
];

export const THERAPISTS: TherapistItem[] = [
  { name: "Mia Carter", specialization: "Articulation", sessions: 186, completed: 162, cancelled: 14, noShow: 10, revenue: 5480, avgDuration: 47, status: "Active" },
  { name: "Liam Evans", specialization: "Stuttering", sessions: 172, completed: 146, cancelled: 18, noShow: 8, revenue: 5110, avgDuration: 49, status: "Active" },
  { name: "Noah Wells", specialization: "Voice", sessions: 149, completed: 126, cancelled: 14, noShow: 9, revenue: 4640, avgDuration: 45, status: "On Leave" },
  { name: "Ava Pierce", specialization: "Language Delay", sessions: 194, completed: 173, cancelled: 11, noShow: 10, revenue: 5850, avgDuration: 51, status: "Active" },
  { name: "Sophia Reed", specialization: "Dysarthria", sessions: 131, completed: 109, cancelled: 13, noShow: 9, revenue: 3980, avgDuration: 44, status: "Active" },
  { name: "Ethan Cole", specialization: "Child Speech", sessions: 168, completed: 140, cancelled: 16, noShow: 12, revenue: 4890, avgDuration: 46, status: "On Leave" },
  { name: "Emma Shaw", specialization: "Aphasia", sessions: 154, completed: 132, cancelled: 11, noShow: 11, revenue: 4475, avgDuration: 48, status: "Active" },
  { name: "Olivia Stone", specialization: "Swallowing", sessions: 141, completed: 118, cancelled: 15, noShow: 8, revenue: 4120, avgDuration: 43, status: "Active" },
];

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const HOURS = ["08", "10", "12", "14", "16", "18", "20"];
export const THERAPIST_PAGE_SIZE = 5;
