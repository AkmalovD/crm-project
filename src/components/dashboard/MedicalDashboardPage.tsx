"use client";

import { useMemo, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  UserPlus,
  BarChart2,
  Users,
  CalendarDays,
  DollarSign,
  Download,
  Bell,
  Info,
  ChevronDown,
  Search,
  Activity,
  LucideIcon,
} from "lucide-react";
import { DashboardScaffold } from "./DashboardScaffold";

// ─── Constants ────────────────────────────────────────────────────────────────

// Kept as a string constant only for recharts/SVG props that require hex values.
const PRIMARY = "#4acf7f";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Therapist {
  name: string;
  initials: string;
  color: string;
}

interface Patient {
  id: string;
  name: string;
  therapist: Therapist;
  progress: number;
  nextSession: string;
  completed: number;
  visits: number;
  status: "Active" | "On Hold";
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const SESSION_CHART_DATA = [
  { day: "Mo", sessions: 220, patients: 50,  appointments: 80  },
  { day: "Tu", sessions: 320, patients: 80,  appointments: 150 },
  { day: "We", sessions: 280, patients: 100, appointments: 200 },
  { day: "Th", sessions: 200, patients: 70,  appointments: 120 },
  { day: "Fr", sessions: 380, patients: 110, appointments: 250 },
  { day: "St", sessions: 180, patients: 60,  appointments: 160 },
  { day: "Su", sessions: 460, patients: 130, appointments: 380 },
];

const MOCK_PATIENTS: Patient[] = [
  { id: "1",  name: "Lviv Forum Clinic",      therapist: { name: "Nataly Chaplack",      initials: "NC", color: "#f87171" }, progress: 84,   nextSession: "31/04/2024", completed: 78.9, visits: 1289,  status: "Active"  },
  { id: "2",  name: "Blockbuster Recovery",   therapist: { name: "Yulian Yalovenko",     initials: "YY", color: "#60a5fa" }, progress: 83.6, nextSession: "31/04/2024", completed: 65.9, visits: 1400,  status: "Active"  },
  { id: "3",  name: "Lavina Speech Center",   therapist: { name: "Apanovych Lubomudr",   initials: "AL", color: "#a78bfa" }, progress: 83.4, nextSession: "31/04/2024", completed: 78.9, visits: 1490,  status: "Active"  },
  { id: "4",  name: "River Mind Clinic",      therapist: { name: "Mary Croostina",       initials: "MC", color: "#fb923c" }, progress: 83,   nextSession: "31/04/2024", completed: 90.8, visits: 12500, status: "On Hold" },
  { id: "5",  name: "King Cross Therapy",     therapist: { name: "Shchastislav Yurchuk", initials: "SY", color: "#34d399" }, progress: 82.5, nextSession: "31/04/2024", completed: 78.6, visits: 678,   status: "Active"  },
  { id: "6",  name: "Victoria Speech Lab",    therapist: { name: "Diana Berigan",        initials: "DB", color: "#f472b6" }, progress: 82.3, nextSession: "31/04/2024", completed: 56.3, visits: 4560,  status: "Active"  },
  { id: "7",  name: "Hollywood Logopedic",    therapist: { name: "Mary Chaplack",        initials: "MC", color: "#fb923c" }, progress: 82,   nextSession: "31/04/2024", completed: 78.9, visits: 1289,  status: "On Hold" },
  { id: "8",  name: "Kyiv Central Clinic",    therapist: { name: "Ivan Petrenko",        initials: "IP", color: "#38bdf8" }, progress: 81.5, nextSession: "02/05/2024", completed: 74.2, visits: 2100,  status: "Active"  },
  { id: "9",  name: "Dnipro Health Hub",      therapist: { name: "Olena Kovalenko",      initials: "OK", color: "#4ade80" }, progress: 81.2, nextSession: "03/05/2024", completed: 67.5, visits: 980,   status: "Active"  },
  { id: "10", name: "Odesa Speech Ctr",       therapist: { name: "Viktor Melnyk",        initials: "VM", color: "#818cf8" }, progress: 80.8, nextSession: "04/05/2024", completed: 71.3, visits: 3200,  status: "Active"  },
  { id: "11", name: "Kharkiv Med Center",     therapist: { name: "Andriy Bondar",        initials: "AB", color: "#fb7185" }, progress: 80.5, nextSession: "05/05/2024", completed: 60.1, visits: 1750,  status: "On Hold" },
  { id: "12", name: "Lviv East Clinic",       therapist: { name: "Sofiia Savchenko",     initials: "SS", color: "#c084fc" }, progress: 80.1, nextSession: "06/05/2024", completed: 82.4, visits: 890,   status: "Active"  },
  { id: "13", name: "Zhytomyr Recovery",      therapist: { name: "Mykola Tkachenko",     initials: "MT", color: "#2dd4bf" }, progress: 79.8, nextSession: "07/05/2024", completed: 59.7, visits: 1120,  status: "Active"  },
  { id: "14", name: "Poltava Logopedic",      therapist: { name: "Iryna Moroz",          initials: "IM", color: "#facc15" }, progress: 79.5, nextSession: "08/05/2024", completed: 73.8, visits: 2340,  status: "Active"  },
  { id: "15", name: "Sumy Speech Lab",        therapist: { name: "Bohdan Kravchenko",    initials: "BK", color: "#f87171" }, progress: 79.2, nextSession: "09/05/2024", completed: 55.0, visits: 760,   status: "On Hold" },
  { id: "16", name: "Chernivtsi Clinic",      therapist: { name: "Oksana Marchenko",     initials: "OM", color: "#60a5fa" }, progress: 78.9, nextSession: "10/05/2024", completed: 80.2, visits: 1430,  status: "Active"  },
  { id: "17", name: "Lutsk Health Ctr",       therapist: { name: "Vasyl Kovalchuk",      initials: "VK", color: "#a78bfa" }, progress: 78.6, nextSession: "11/05/2024", completed: 66.7, visits: 560,   status: "Active"  },
  { id: "18", name: "Ivano Logopedic",        therapist: { name: "Natalia Boychuk",      initials: "NB", color: "#fb923c" }, progress: 78.3, nextSession: "12/05/2024", completed: 71.1, visits: 1890,  status: "Active"  },
  { id: "19", name: "Ternopil Speech",        therapist: { name: "Roman Panasiuk",       initials: "RP", color: "#34d399" }, progress: 78.0, nextSession: "13/05/2024", completed: 77.5, visits: 2010,  status: "Active"  },
  { id: "20", name: "Rivne Med Center",       therapist: { name: "Halyna Lysenko",       initials: "HL", color: "#f472b6" }, progress: 77.7, nextSession: "14/05/2024", completed: 53.9, visits: 670,   status: "On Hold" },
  { id: "21", name: "Uzhhorod Clinic",        therapist: { name: "Dmytro Shevchenko",    initials: "DS", color: "#38bdf8" }, progress: 77.4, nextSession: "15/05/2024", completed: 84.6, visits: 1100,  status: "Active"  },
  { id: "22", name: "Cherkasy Recovery",      therapist: { name: "Larysa Karpenko",      initials: "LK", color: "#4ade80" }, progress: 77.1, nextSession: "16/05/2024", completed: 69.3, visits: 3450,  status: "Active"  },
  { id: "23", name: "Vinnytsia Speech",       therapist: { name: "Taras Bondarenko",     initials: "TB", color: "#818cf8" }, progress: 76.8, nextSession: "17/05/2024", completed: 61.8, visits: 890,   status: "Active"  },
  { id: "24", name: "Mykolaiv Logoped",       therapist: { name: "Svitlana Rudenko",     initials: "SR", color: "#fb7185" }, progress: 76.5, nextSession: "18/05/2024", completed: 75.4, visits: 2200,  status: "Active"  },
  { id: "25", name: "Zaporizhzhia Ctr",       therapist: { name: "Oleksandr Sydorenko",  initials: "OS", color: "#c084fc" }, progress: 76.2, nextSession: "19/05/2024", completed: 50.6, visits: 1340,  status: "On Hold" },
  { id: "26", name: "Kremenchuk Clinic",      therapist: { name: "Yuliia Pavlenko",      initials: "YP", color: "#2dd4bf" }, progress: 75.9, nextSession: "20/05/2024", completed: 79.1, visits: 780,   status: "Active"  },
  { id: "27", name: "Mariupol Speech",        therapist: { name: "Serhiy Kovalenko",     initials: "SK", color: "#facc15" }, progress: 75.6, nextSession: "21/05/2024", completed: 72.3, visits: 1560,  status: "Active"  },
  { id: "28", name: "Kryvyi Rih Ctr",         therapist: { name: "Nataliia Honcharenko", initials: "NH", color: "#f87171" }, progress: 75.3, nextSession: "22/05/2024", completed: 63.7, visits: 2890,  status: "Active"  },
  { id: "29", name: "Berdychiv Recovery",     therapist: { name: "Andrii Shevchuk",      initials: "AS", color: "#60a5fa" }, progress: 75.0, nextSession: "23/05/2024", completed: 58.2, visits: 430,   status: "Active"  },
  { id: "30", name: "Khmelnytskyi Lab",       therapist: { name: "Oksana Petrychenko",   initials: "OP", color: "#a78bfa" }, progress: 74.7, nextSession: "24/05/2024", completed: 47.9, visits: 1020,  status: "On Hold" },
];

const PAGE_SIZE = 10;

// ─── Ukraine map ──────────────────────────────────────────────────────────────

const CITIES = [
  { name: "Rivne",           x: 70,  y: 40,  dot: PRIMARY,   pct: "+89%" },
  { name: "Kyiv",            x: 142, y: 45,  dot: "#60a5fa", pct: "+60%" },
  { name: "Lviv",            x: 33,  y: 57,  dot: "#f472b6", pct: "+48%" },
  { name: "Cherkasy",        x: 168, y: 66,  dot: "#fbbf24", pct: "+30%" },
  { name: "Ivano-Frankivsk", x: 45,  y: 77,  dot: "#94a3b8", pct: ""     },
  { name: "Uzhhorod",        x: 8,   y: 83,  dot: "#94a3b8", pct: ""     },
  { name: "Odesa",           x: 145, y: 128, dot: "#94a3b8", pct: ""     },
];

function UkraineMap() {
  return (
    <div className="relative w-full pt-2">
      <svg viewBox="0 0 300 170" className="w-full h-auto" aria-hidden="true">
        <path
          d="M 8,85 L 12,70 L 22,57 L 33,50 L 50,40 L 70,35
             L 90,27 L 110,20 L 130,15 L 155,11 L 170,11
             L 188,15 L 205,22 L 220,28 L 232,38 L 243,50
             L 255,65 L 265,80 L 272,95 L 275,108 L 272,120
             L 265,132 L 255,142 L 243,150 L 228,157 L 213,161
             L 198,162 L 183,160 L 170,156 L 160,150
             L 148,155 L 135,160 L 118,162 L 100,160
             L 82,154 L 65,144 L 50,132 L 35,118
             L 20,103 L 10,93 Z"
          fill="#d8e4f0"
          stroke="#b8cfe4"
          strokeWidth="1.2"
        />
        {CITIES.map((city) => (
          <g key={city.name}>
            <circle cx={city.x} cy={city.y} r={3.5} fill={city.dot} opacity={0.9} />
            <text x={city.x + 5} y={city.y + 3.5} fontSize="7.5" fill="#475569" fontFamily="inherit">
              {city.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  link: string;
  Icon: LucideIcon;
}

function StatCard({ label, value, delta, deltaPositive, link, Icon }: StatCardProps) {
  return (
    <div className="border border-(--border) rounded-[14px] bg-(--panel) px-5 py-[18px] flex flex-col gap-1.5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase tracking-[0.06em] text-(--soft-text) font-bold mb-0.5">
            {label}
          </p>
          <span className={`text-xs font-semibold ${deltaPositive ? "text-green-500" : "text-red-500"}`}>
            {delta}
          </span>
        </div>
        <div className="w-[34px] h-[34px] rounded-full bg-[#edfaf3] flex items-center justify-center text-[#4acf7f] shrink-0">
          <Icon size={16} />
        </div>
      </div>
      <p className="text-[26px] font-bold text-[#131d35] leading-tight">{value}</p>
      <a href="#" className="text-xs text-[#4acf7f] no-underline hover:underline">
        {link}
      </a>
    </div>
  );
}

// ─── Custom tooltip for chart ─────────────────────────────────────────────────

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-(--border) rounded-[10px] px-3.5 py-2.5 text-xs shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <p className="font-semibold text-slate-800 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="mb-0.5" style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MedicalDashboardPage() {
  const [chartPeriod, setChartPeriod] = useState("Weekly");
  const [sortBy, setSortBy] = useState("Progress");
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(MOCK_PATIENTS.length / PAGE_SIZE);

  const sorted = useMemo(() => {
    const copy = [...MOCK_PATIENTS];
    if (sortBy === "Progress") copy.sort((a, b) => b.progress - a.progress);
    else if (sortBy === "Name") copy.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "Status") copy.sort((a, b) => a.status.localeCompare(b.status));
    return copy;
  }, [sortBy]);

  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(0);
  };

  return (
    <DashboardScaffold>
      <div className="flex flex-col gap-5">

        {/* ── Topbar ──────────────────────────────────────────────────────── */}
        <div className="dashboard-topbar">
          <div className="dashboard-search">
            <Search size={15} color="#94a3b8" />
            <input placeholder="Search..." />
          </div>
          <div className="dashboard-topbar-actions">
            <button type="button" className="dashboard-icon-button">
              <Bell size={15} />
            </button>
            <button type="button" className="dashboard-icon-button">
              <Info size={15} />
            </button>
            <div className="dashboard-user-pill">
              <div className="dashboard-avatar">EB</div>
              <span>Erik Brown</span>
              <ChevronDown size={14} color="#9ca3af" />
            </div>
          </div>
        </div>

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex justify-between items-center">
          <h1 className="text-[32px] font-bold text-[#131d35] leading-tight">Dashboard</h1>
          <div className="flex gap-2.5 items-center">
            <button
              type="button"
              className="h-[38px] rounded-[10px] border-0 bg-[#4acf7f] text-white text-sm font-semibold px-4 shadow-[0_8px_20px_rgba(74,207,127,0.28)] flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={15} />
              + Add Patient
            </button>
            <button type="button" className="dashboard-icon-button rounded-[10px] w-[38px]">
              <BarChart2 size={16} />
            </button>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Sessions" value="1,284"   delta="+18.45%" deltaPositive    link="View session history"   Icon={Activity}    />
          <StatCard label="Appointments"   value="+36"     delta="-3.75%"  deltaPositive={false} link="View all appointments" Icon={CalendarDays} />
          <StatCard label="Patients"       value="248"     delta="+12"     deltaPositive    link="See patient list"       Icon={Users}       />
          <StatCard label="Balance"        value="$12,450" delta="+0.00%"  deltaPositive    link="Withdraw funds"         Icon={DollarSign}  />
        </div>

        {/* ── Analytics + Map ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-[1.4fr_1fr] gap-4">

          {/* Session analytics chart */}
          <div className="border border-(--border) rounded-[14px] bg-(--panel) p-5 px-[22px]">
            <div className="flex justify-between items-center mb-3.5">
              <h2 className="text-[15px] font-semibold text-slate-800">Session Analytics</h2>
              <div className="dashboard-select">
                <select
                  value={chartPeriod}
                  onChange={(e) => setChartPeriod(e.target.value)}
                  className="text-[13px] font-medium"
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </div>
            </div>

            {/* Summary row */}
            <div className="flex gap-6 mb-4">
              <div>
                <span className="text-[20px] font-bold text-[#4acf7f]">1,760</span>
                <span className="text-[13px] text-slate-500 ml-1.5">Income</span>
              </div>
              <div>
                <span className="text-[20px] font-bold text-slate-800">345</span>
                <span className="text-[13px] text-slate-500 ml-1.5">Sessions</span>
              </div>
              <div>
                <span className="text-[20px] font-bold text-slate-800">3.5%</span>
                <span className="text-[13px] text-slate-500 ml-1.5">Completion Rate</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={SESSION_CHART_DATA} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 500]} ticks={[0, 250, 500, 750, 1000]} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="sessions" name="Sessions" fill={PRIMARY} radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="patients"     name="Patients"     stroke="#94a3b8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="appointments" name="Appointments" stroke="#fbbf24" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex gap-[18px] justify-center text-[11px] text-slate-400 mt-2.5">
              {[
                { color: PRIMARY,    label: "Sessions"      },
                { color: "#94a3b8",  label: "Patients"      },
                { color: "#fbbf24",  label: "Appointments"  },
              ].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Regional map */}
          <div className="border border-(--border) rounded-[14px] bg-(--panel) p-5 px-[22px] flex flex-col">
            <div className="flex justify-between items-start">
              <h2 className="text-[15px] font-semibold text-slate-800 max-w-[180px] leading-[1.35]">
                Implementation of the monthly plan
              </h2>
              <button
                type="button"
                className="bg-transparent border-0 text-slate-400 cursor-pointer p-0.5 hover:text-slate-600"
              >
                <Download size={16} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <UkraineMap />
            </div>

            {/* Map legend */}
            <div className="flex gap-3.5 flex-wrap text-[11px] mt-3">
              {CITIES.filter((c) => c.pct).map((city) => (
                <span key={city.name} className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: city.dot }} />
                  {city.pct}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Patients table ───────────────────────────────────────────────── */}
        <div className="dashboard-orders-card">

          {/* Table header */}
          <div className="px-5 pt-[18px] pb-2.5 flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-800">
              Information by patients ({MOCK_PATIENTS.length})
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-slate-500">Sort By</span>
              <div className="dashboard-select">
                <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                  <option>Progress</option>
                  <option>Name</option>
                  <option>Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th className="w-10">
                    <input type="checkbox" className="accent-[#4acf7f]" />
                  </th>
                  <th>PATIENT</th>
                  <th>THERAPIST</th>
                  <th>PROGRESS ↕</th>
                  <th>NEXT SESSION</th>
                  <th>COMPLETED ↕</th>
                  <th>SESSIONS</th>
                  <th>STATUS ↕</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <input type="checkbox" className="accent-[#4acf7f]" />
                    </td>

                    {/* Patient name */}
                    <td>
                      <a href="#" className="text-[#4acf7f] font-medium no-underline text-sm hover:underline">
                        {patient.name}
                      </a>
                    </td>

                    {/* Therapist */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-[25px] h-[25px] rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0"
                          style={{ background: patient.therapist.color }}
                        >
                          {patient.therapist.initials}
                        </div>
                        <span className="text-sm text-slate-600">{patient.therapist.name}</span>
                      </div>
                    </td>

                    {/* Progress bar */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 rounded bg-gray-200 shrink-0">
                          <div
                            className="h-full rounded bg-[#4acf7f]"
                            style={{ width: `${patient.progress}%` }}
                          />
                        </div>
                        <span className="text-[13px]">{patient.progress}%</span>
                      </div>
                    </td>

                    <td>{patient.nextSession}</td>
                    <td>{patient.completed}%</td>
                    <td>{patient.visits.toLocaleString()} sessions</td>

                    {/* Status badge */}
                    <td>
                      <span
                        className={
                          patient.status === "Active"
                            ? "dashboard-status dashboard-status-approved"
                            : "dashboard-status dashboard-status-refunded"
                        }
                      >
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="dashboard-table-footer">
            <span className="text-[13px]">Rows per page: {PAGE_SIZE}</span>
            <span className="text-[13px]">
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, MOCK_PATIENTS.length)} of{" "}
              {MOCK_PATIENTS.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="dashboard-pager-button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                ← Previous
              </button>
              <button
                type="button"
                className="dashboard-pager-button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardScaffold>
  );
}
