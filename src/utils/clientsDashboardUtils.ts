import { Client } from "../types/clientsDashboardTypes";
import { STATUS_LABELS, THERAPY_LABELS } from "@/data/clientsData/clientsDashboardData";

export const NUMBER = new Intl.NumberFormat("en-US");

export function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(date: string | null) {
  if (!date) return "No sessions yet";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toCsv(rows: Client[]) {
  const header = [
    "Client Code",
    "Full Name",
    "Age",
    "Date of Birth",
    "Diagnosis",
    "Therapist",
    "Therapy Type",
    "Status",
    "Phone",
    "Last Session",
    "Total Sessions",
  ];

  const body = rows.map((row) => [
    row.clientCode,
    row.fullName,
    String(row.age),
    row.dateOfBirth,
    row.primaryDiagnosis,
    row.assignedTherapist.name,
    THERAPY_LABELS[row.therapyType],
    STATUS_LABELS[row.status],
    row.phone,
    row.lastSessionDate ?? "",
    String(row.totalSessions),
  ]);

  return [header, ...body]
    .map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export function downloadCsv(rows: Client[], fileName: string) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
