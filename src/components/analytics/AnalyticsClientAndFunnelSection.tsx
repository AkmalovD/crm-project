import { Bar, BarChart, CartesianGrid, Cell, Funnel, FunnelChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FUNNEL_DATA, MONTHLY_OVERVIEW, PRIMARY } from "@/data/analyticsData/analyticsDashboardData";
import { formatCountTooltip } from "../../utils/analyticsDashboardUtils";
import { AnalyticsChartCard } from "./AnalyticsChartCard";
import styles from "./AnalyticsDashboardPage.module.css";

export function AnalyticsClientAndFunnelSection() {
  return (
    <section className={styles.analyticsGrid5050}>
      <AnalyticsChartCard title="New vs Returning Clients (monthly)">
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
      </AnalyticsChartCard>

      <AnalyticsChartCard title="Client Retention Funnel">
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
      </AnalyticsChartCard>
    </section>
  );
}
