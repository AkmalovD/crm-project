"use client";

import { Fragment, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Download, FileDown, Info, Search } from "lucide-react";

import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import styles from "./AnalyticsDashboardPage.module.css";

const PRIMARY = "#4acf7f";

const TABS = ["Overview", "Sessions", "Revenue", "Clients", "Therapists"] as const;

const KPI_DATA = [
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
] as const;

const MONTHLY_OVERVIEW = [
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

const AGE_DISTRIBUTION = [
  { group: "3-6 years", pct: 26, count: 132 },
  { group: "7-12 years", pct: 32, count: 164 },
  { group: "13-17 years", pct: 18, count: 94 },
  { group: "18-35 years", pct: 14, count: 76 },
  { group: "35+ years", pct: 10, count: 55 },
];

const OUTCOME_DATA = [
  { name: "Completed", value: 902, color: "#4acf7f" },
  { name: "Cancelled", value: 132, color: "#ef4444" },
  { name: "No-show", value: 97, color: "#f59e0b" },
  { name: "Rescheduled", value: 153, color: "#60a5fa" },
];

const SERVICES_BY_REVENUE = [
  { service: "Individual Therapy", revenue: 8600 },
  { service: "Group Therapy", revenue: 5600 },
  { service: "Assessment", revenue: 4200 },
  { service: "Consultation", revenue: 3600 },
  { service: "Online Session", revenue: 2500 },
];

const CANCELLATION_REASONS = [
  { name: "Client illness", value: 31, color: "#4acf7f" },
  { name: "Schedule conflict", value: 27, color: "#60a5fa" },
  { name: "No reason given", value: 18, color: "#f59e0b" },
  { name: "Therapist unavailable", value: 14, color: "#ef4444" },
  { name: "Emergency", value: 10, color: "#8b5cf6" },
];

const FUNNEL_DATA = [
  { value: 420, name: "Total New Clients" },
  { value: 344, name: "Completed First Session" },
  { value: 275, name: "Booked 2nd Session" },
  { value: 198, name: "Active (5+ sessions)" },
  { value: 156, name: "Long-term (3+ months)" },
];

const THERAPISTS = [
  { name: "Mia Carter", specialization: "Articulation", sessions: 186, completed: 162, cancelled: 14, noShow: 10, revenue: 5480, avgDuration: 47, status: "Active" },
  { name: "Liam Evans", specialization: "Stuttering", sessions: 172, completed: 146, cancelled: 18, noShow: 8, revenue: 5110, avgDuration: 49, status: "Active" },
  { name: "Noah Wells", specialization: "Voice", sessions: 149, completed: 126, cancelled: 14, noShow: 9, revenue: 4640, avgDuration: 45, status: "On Leave" },
  { name: "Ava Pierce", specialization: "Language Delay", sessions: 194, completed: 173, cancelled: 11, noShow: 10, revenue: 5850, avgDuration: 51, status: "Active" },
  { name: "Sophia Reed", specialization: "Dysarthria", sessions: 131, completed: 109, cancelled: 13, noShow: 9, revenue: 3980, avgDuration: 44, status: "Active" },
  { name: "Ethan Cole", specialization: "Child Speech", sessions: 168, completed: 140, cancelled: 16, noShow: 12, revenue: 4890, avgDuration: 46, status: "On Leave" },
  { name: "Emma Shaw", specialization: "Aphasia", sessions: 154, completed: 132, cancelled: 11, noShow: 11, revenue: 4475, avgDuration: 48, status: "Active" },
  { name: "Olivia Stone", specialization: "Swallowing", sessions: 141, completed: 118, cancelled: 15, noShow: 8, revenue: 4120, avgDuration: 43, status: "Active" },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["08", "10", "12", "14", "16", "18", "20"];

const NUMBER = new Intl.NumberFormat("en-US");
const CURRENCY = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function formatCompactPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value}%`;
}

function normalizeNumericValue(value: unknown) {
  if (typeof value === "number") {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatRevenueTooltip(value: unknown) {
  return [CURRENCY.format(normalizeNumericValue(value)), "Revenue"] as const;
}

function formatCountTooltip(value: unknown, label: string) {
  return [NUMBER.format(normalizeNumericValue(value)), label] as const;
}

function formatPercentTooltip(value: unknown, label: string) {
  return [`${normalizeNumericValue(value)}%`, label] as const;
}

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function KpiCard({
  label,
  value,
  trend,
  suffix,
  spark,
  valueSuffix,
}: {
  label: string;
  value: number;
  trend: number;
  suffix: string;
  spark: readonly number[];
  valueSuffix?: string;
}) {
  const positive = trend >= 0;
  return (
    <div className={cx(styles.analyticsCard, styles.analyticsKpiCard)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-[#6b7280]">{label}</p>
        <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-600" : "text-red-500"}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{formatCompactPercent(trend)}</span>
        </div>
      </div>
      <p className="text-3xl font-bold text-[#1a1a2e]">
        {valueSuffix ? `${NUMBER.format(value)}${valueSuffix}` : label.includes("Revenue") ? CURRENCY.format(value) : NUMBER.format(value)}
      </p>
      <p className="mt-1 text-xs text-[#6b7280]">{suffix}</p>
      <div className="mt-3 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={spark.map((item, idx) => ({ idx, value: item }))}>
            <Line
              dataKey="value"
              stroke={positive ? PRIMARY : "#ef4444"}
              strokeWidth={2}
              type="monotone"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  filter = true,
  loading = false,
  hasData = true,
  children,
}: {
  title: string;
  filter?: boolean;
  loading?: boolean;
  hasData?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.analyticsCard}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-[#1a1a2e]">{title}</h3>
          <Info size={14} className="text-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          {filter && (
            <select className={styles.analyticsFilter}>
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Yearly</option>
            </select>
          )}
          <button type="button" className={styles.analyticsIconButton} aria-label={`Export ${title}`}>
            <Download size={15} />
          </button>
        </div>
      </div>
      {loading ? <div className={styles.analyticsSkeleton} /> : hasData ? children : <div className={styles.analyticsEmptyState}>No data available for this period.</div>}
    </section>
  );
}

function buildAnnualActivity() {
  const cells: { week: number; day: number; count: number }[] = [];
  for (let week = 0; week < 53; week += 1) {
    for (let day = 0; day < 7; day += 1) {
      const count = Math.floor((Math.sin((week + day) * 0.5) + 1) * 4 + (week % 6));
      cells.push({ week, day, count: Math.max(0, count) });
    }
  }
  return cells;
}

export function AnalyticsDashboardPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Overview");
  const [seriesToggle, setSeriesToggle] = useState<"Sessions" | "Revenue" | "Both">("Both");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "sessions" | "revenue" | "completion">("completion");
  const [page, setPage] = useState(1);

  const activityCells = useMemo(() => buildAnnualActivity(), []);
  const bookingHeatmap = useMemo(
    () =>
      WEEK_DAYS.map((day, dayIndex) => ({
        day,
        values: HOURS.map((_, hourIndex) => 3 + ((dayIndex * 5 + hourIndex * 7) % 17)),
      })),
    [],
  );

  const therapistsFiltered = useMemo(() => {
    const base = THERAPISTS.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
    const sorted = [...base].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "sessions") return b.sessions - a.sessions;
      if (sortBy === "revenue") return b.revenue - a.revenue;
      const aRate = (a.completed / a.sessions) * 100;
      const bRate = (b.completed / b.sessions) * 100;
      return bRate - aRate;
    });
    return sorted;
  }, [query, sortBy]);

  const PAGE_SIZE = 5;
  const totalPages = Math.max(1, Math.ceil(therapistsFiltered.length / PAGE_SIZE));
  const therapistRows = therapistsFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalSessions = OUTCOME_DATA.reduce((sum, item) => sum + item.value, 0);

  return (
    <DashboardScaffold>
      <div className={styles.analyticsPage}>
        <header className={styles.analyticsPageHeader}>
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a2e]">Analytics</h1>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className={cx(styles.analyticsFilter, "px-3 py-2 text-sm")}>Jan 2025 - Dec 2025</button>
            <button type="button" className={styles.analyticsExportButton}>
              <FileDown size={15} />
              Export Report
            </button>
          </div>
        </header>

        <div className={styles.analyticsTabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              className={cx(styles.analyticsTab, activeTab === tab && styles.tabActive)}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className={styles.analyticsKpiGrid}>
          {KPI_DATA.map((card) => (
            <KpiCard key={card.label} {...card} />
          ))}
        </section>

        <section className={styles.analyticsGrid6040}>
          <ChartCard title="Revenue & Sessions Over Time">
            <div className="mb-3 flex items-center justify-end gap-2">
              {(["Sessions", "Revenue", "Both"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={cx(styles.analyticsToggle, seriesToggle === option && styles.toggleActive)}
                  onClick={() => setSeriesToggle(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MONTHLY_OVERVIEW}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="sessions" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="revenue" orientation="right" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(value, name) => {
                      const metricName = String(name ?? "");
                      return [
                        metricName === "revenue"
                          ? CURRENCY.format(normalizeNumericValue(value))
                          : NUMBER.format(normalizeNumericValue(value)),
                        metricName,
                      ] as const;
                    }}
                  />
                  {(seriesToggle === "Sessions" || seriesToggle === "Both") && (
                    <Bar yAxisId="sessions" dataKey="sessions" fill="#a5b4fc" radius={[8, 8, 0, 0]} />
                  )}
                  {(seriesToggle === "Revenue" || seriesToggle === "Both") && (
                    <Line yAxisId="revenue" dataKey="revenue" stroke={PRIMARY} strokeWidth={3} type="monotone" dot={false} />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Client Age Group Distribution">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={AGE_DISTRIBUTION} layout="vertical" margin={{ left: 24 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="group" type="category" width={98} tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => formatPercentTooltip(value, "Share")} />
                  <Bar dataKey="pct" radius={[0, 8, 8, 0]}>
                    {AGE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={entry.group} fill={`rgba(74, 207, 127, ${0.45 + index * 0.1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <section className={styles.analyticsGrid5050}>
          <ChartCard title="Session Outcomes">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={OUTCOME_DATA} dataKey="value" nameKey="name" innerRadius={68} outerRadius={96} paddingAngle={2}>
                    {OUTCOME_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCountTooltip(value, "Sessions")} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center">
              <p className="text-2xl font-bold text-[#1a1a2e]">{NUMBER.format(totalSessions)}</p>
              <p className="text-sm text-[#6b7280]">Total Sessions</p>
            </div>
          </ChartCard>

          <ChartCard title="Top Services by Revenue">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SERVICES_BY_REVENUE}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="service" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => formatRevenueTooltip(value)} />
                  <Bar dataKey="revenue" fill="rgba(74, 207, 127, 0.65)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <section className={styles.analyticsGrid5050}>
          <ChartCard title="Peak Booking Hours">
            <div className="overflow-x-auto">
              <div className="inline-grid min-w-full grid-cols-[100px_repeat(7,minmax(60px,1fr))]">
                <div />
                {HOURS.map((hour) => (
                  <div key={hour} className="px-1 pb-2 text-center text-xs font-medium text-slate-500">{hour}:00</div>
                ))}
                {bookingHeatmap.map((row) => (
                  <Fragment key={row.day}>
                    <div key={`${row.day}-label`} className="pr-2 pt-2 text-xs font-medium text-slate-500">{row.day}</div>
                    {row.values.map((cell, idx) => {
                      const opacity = Math.min(1, 0.15 + cell / 22);
                      return (
                        <div
                          key={`${row.day}-${idx}`}
                          className={styles.analyticsHeatmapCell}
                          title={`${row.day} ${HOURS[idx]}:00 — ${cell} bookings`}
                          style={{ backgroundColor: `rgba(74, 207, 127, ${opacity})` }}
                        >
                          {cell}
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Cancellation Reasons Breakdown">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CANCELLATION_REASONS} dataKey="value" nameKey="name" innerRadius={62} outerRadius={98}>
                    {CANCELLATION_REASONS.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                  <Tooltip formatter={(value) => formatPercentTooltip(value, "Share")} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <section className={styles.analyticsCard}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">Therapist Performance Breakdown</h3>
              <span className="rounded-full bg-[#edfaf3] px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {NUMBER.format(THERAPISTS.length)} therapists
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className={styles.analyticsSearch}>
                <Search size={14} className="text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search therapist"
                />
              </label>
              <select
                className={styles.analyticsFilter}
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value as "name" | "sessions" | "revenue" | "completion");
                  setPage(1);
                }}
              >
                <option value="completion">Sort: Completion Rate</option>
                <option value="sessions">Sort: Total Sessions</option>
                <option value="revenue">Sort: Revenue</option>
                <option value="name">Sort: Name</option>
              </select>
              <button type="button" className={styles.analyticsIconButton} aria-label="Export table">
                <Download size={14} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={cx(styles.analyticsTable, "min-w-[1080px]")}>
              <thead>
                <tr>
                  <th>Therapist</th>
                  <th>Total Sessions</th>
                  <th>Completed</th>
                  <th>Cancelled</th>
                  <th>No-show</th>
                  <th>Revenue</th>
                  <th>Avg Duration</th>
                  <th>Completion Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {therapistRows.map((therapist) => {
                  const completion = Math.round((therapist.completed / therapist.sessions) * 100);
                  return (
                    <tr key={therapist.name}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                            {therapist.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1a1a2e]">{therapist.name}</p>
                            <p className="text-xs text-slate-500">{therapist.specialization}</p>
                          </div>
                        </div>
                      </td>
                      <td>{NUMBER.format(therapist.sessions)}</td>
                      <td className="text-emerald-600">{NUMBER.format(therapist.completed)}</td>
                      <td className="text-red-500">{NUMBER.format(therapist.cancelled)}</td>
                      <td className="text-amber-500">{NUMBER.format(therapist.noShow)}</td>
                      <td>{CURRENCY.format(therapist.revenue)}</td>
                      <td>{therapist.avgDuration} min</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-28 rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-[#4acf7f]" style={{ width: `${completion}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{completion}%</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={cx(
                            styles.analyticsStatus,
                            therapist.status === "Active" ? styles.statusActive : styles.statusLeave,
                          )}
                        >
                          {therapist.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-end gap-4 text-sm text-slate-500">
            <span>Rows per page: {PAGE_SIZE}</span>
            <button type="button" className={styles.analyticsPager} disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
              Previous
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              className={styles.analyticsPager}
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Next
            </button>
          </div>
        </section>

        <section className={styles.analyticsGrid5050}>
          <ChartCard title="New vs Returning Clients (monthly)">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_OVERVIEW.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="newClients" fill="#bbf7d0" radius={[6, 6, 0, 0]} name="New clients" />
                  <Bar dataKey="returningClients" fill={PRIMARY} radius={[6, 6, 0, 0]} name="Returning clients" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Client Retention Funnel">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip formatter={(value) => formatCountTooltip(value, "Clients")} />
                  <Funnel dataKey="value" data={FUNNEL_DATA} isAnimationActive nameKey="name">
                    {FUNNEL_DATA.map((entry, index) => (
                      <Cell key={entry.name} fill={`rgba(74, 207, 127, ${0.35 + index * 0.14})`} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <section className={styles.analyticsGrid5050}>
          <ChartCard title="Revenue by Service Type">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SERVICES_BY_REVENUE} dataKey="revenue" nameKey="service" innerRadius={64} outerRadius={98}>
                    {SERVICES_BY_REVENUE.map((entry, index) => (
                      <Cell key={entry.service} fill={["#4acf7f", "#60a5fa", "#f59e0b", "#8b5cf6", "#ef4444"][index]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => formatRevenueTooltip(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Monthly Revenue Growth">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_OVERVIEW}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => formatRevenueTooltip(value)} />
                  <ReferenceLine y={1900} stroke="#9ca3af" strokeDasharray="5 5" label={{ value: "Prev year avg", fill: "#6b7280", fontSize: 11 }} />
                  <Area dataKey="revenue" type="monotone" stroke={PRIMARY} fill="rgba(74, 207, 127, 0.18)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <ChartCard title="Annual Booking Activity" filter={false}>
          <div className="overflow-x-auto">
            <div className="grid min-w-[980px] grid-cols-[40px_repeat(53,1fr)] gap-1">
              <div />
              {Array.from({ length: 53 }, (_, index) => (
                <div key={`month-${index}`} className="text-[10px] text-slate-400">
                  {index % 4 === 0 ? MONTHLY_OVERVIEW[Math.floor(index / 4)]?.month ?? "" : ""}
                </div>
              ))}
              {["Mo", "", "We", "", "Fr", "", ""].map((label, dayIndex) => (
                <Fragment key={`day-row-${dayIndex}`}>
                  <div key={`day-${dayIndex}`} className="text-xs text-slate-500">{label}</div>
                  {activityCells
                    .filter((cell) => cell.day === dayIndex)
                    .map((cell) => {
                      const bg =
                        cell.count === 0
                          ? "#f3f4f6"
                          : cell.count < 5
                            ? "#bbf7d0"
                            : cell.count < 9
                              ? "#4acf7f"
                              : "#15803d";
                      return (
                        <div
                          key={`cell-${cell.week}-${cell.day}`}
                          className="h-3.5 rounded-[2px]"
                          style={{ backgroundColor: bg }}
                          title={`Week ${cell.week + 1}, sessions: ${cell.count}`}
                        />
                      );
                    })}
                </Fragment>
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2 text-xs text-slate-500">
            <span>Less</span>
            {["#f3f4f6", "#bbf7d0", "#4acf7f", "#15803d"].map((color) => (
              <span key={color} className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: color }} />
            ))}
            <span>More</span>
          </div>
        </ChartCard>
      </div>
    </DashboardScaffold>
  );
}
