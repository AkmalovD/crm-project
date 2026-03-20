import { Fragment } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CANCELLATION_REASONS, HOURS } from "./analyticsDashboardData";
import { formatPercentTooltip } from "./analyticsDashboardUtils";
import { AnalyticsChartCard } from "./AnalyticsChartCard";
import styles from "./AnalyticsDashboardPage.module.css";

interface AnalyticsBookingAndCancellationSectionProps {
  bookingHeatmap: Array<{ day: string; values: number[] }>;
}

export function AnalyticsBookingAndCancellationSection({
  bookingHeatmap,
}: AnalyticsBookingAndCancellationSectionProps) {
  return (
    <section className={styles.analyticsGrid5050}>
      <AnalyticsChartCard title="Peak Booking Hours">
        <div className="overflow-x-auto">
          <div className="inline-grid min-w-full grid-cols-[100px_repeat(7,minmax(60px,1fr))]">
            <div />
            {HOURS.map((hour) => (
              <div key={hour} className="px-1 pb-2 text-center text-xs font-medium text-slate-500">
                {hour}:00
              </div>
            ))}
            {bookingHeatmap.map((row) => (
              <Fragment key={row.day}>
                <div key={`${row.day}-label`} className="pr-2 pt-2 text-xs font-medium text-slate-500">
                  {row.day}
                </div>
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
      </AnalyticsChartCard>

      <AnalyticsChartCard title="Cancellation Reasons Breakdown">
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
      </AnalyticsChartCard>
    </section>
  );
}
