import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { PRIMARY } from "@/data/analyticsData/analyticsDashboardData";
import { KpiItem } from "../../types/analyticsDashboardTypes";
import { NUMBER, CURRENCY, cx, formatCompactPercent } from "../../utils/analyticsDashboardUtils";
import styles from "./AnalyticsDashboardPage.module.css";

export function AnalyticsKpiCard({ label, value, trend, suffix, spark, valueSuffix }: KpiItem) {
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
            <Line dataKey="value" stroke={positive ? PRIMARY : "#ef4444"} strokeWidth={2} type="monotone" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
