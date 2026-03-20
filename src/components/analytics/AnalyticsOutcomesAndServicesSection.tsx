import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { OUTCOME_DATA, SERVICES_BY_REVENUE } from "./analyticsDashboardData";
import { formatCountTooltip, formatRevenueTooltip, NUMBER } from "./analyticsDashboardUtils";
import { AnalyticsChartCard } from "./AnalyticsChartCard";
import styles from "./AnalyticsDashboardPage.module.css";

interface AnalyticsOutcomesAndServicesSectionProps {
  totalSessions: number;
}

export function AnalyticsOutcomesAndServicesSection({
  totalSessions,
}: AnalyticsOutcomesAndServicesSectionProps) {
  return (
    <section className={styles.analyticsGrid5050}>
      <AnalyticsChartCard title="Session Outcomes">
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
      </AnalyticsChartCard>

      <AnalyticsChartCard title="Top Services by Revenue">
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
      </AnalyticsChartCard>
    </section>
  );
}
