import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MONTHLY_OVERVIEW, PRIMARY, SERVICES_BY_REVENUE } from "@/data/analyticsData/analyticsDashboardData";
import { formatRevenueTooltip } from "../../utils/analyticsDashboardUtils";
import { AnalyticsChartCard } from "./AnalyticsChartCard";
import styles from "./AnalyticsDashboardPage.module.css";

export function AnalyticsRevenueInsightsSection() {
  return (
    <section className={styles.analyticsGrid5050}>
      <AnalyticsChartCard title="Revenue by Service Type">
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
      </AnalyticsChartCard>

      <AnalyticsChartCard title="Monthly Revenue Growth">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_OVERVIEW}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => formatRevenueTooltip(value)} />
              <ReferenceLine
                y={1900}
                stroke="#9ca3af"
                strokeDasharray="5 5"
                label={{ value: "Prev year avg", fill: "#6b7280", fontSize: 11 }}
              />
              <Area dataKey="revenue" type="monotone" stroke={PRIMARY} fill="rgba(74, 207, 127, 0.18)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsChartCard>
    </section>
  );
}
