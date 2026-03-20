import { LucideIcon } from "lucide-react";

export interface Therapist {
  name: string;
  initials: string;
  color: string;
}

export interface Patient {
  id: string;
  name: string;
  therapist: Therapist;
  progress: number;
  nextSession: string;
  completed: number;
  visits: number;
  status: "Active" | "On Hold";
}

export interface StatCardConfig {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  link: string;
  Icon: LucideIcon;
}
