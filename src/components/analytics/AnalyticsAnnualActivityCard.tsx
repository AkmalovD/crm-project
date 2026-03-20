import { Fragment } from "react";
import { MONTHLY_OVERVIEW } from "@/data/analyticsData/analyticsDashboardData";
import { AnalyticsChartCard } from "./AnalyticsChartCard";

interface AnalyticsAnnualActivityCardProps {
  activityCells: { week: number; day: number; count: number }[];
}

export function AnalyticsAnnualActivityCard({ activityCells }: AnalyticsAnnualActivityCardProps) {
  return (
    <AnalyticsChartCard title="Annual Booking Activity" filter={false}>
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
              <div key={`day-${dayIndex}`} className="text-xs text-slate-500">
                {label}
              </div>
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
    </AnalyticsChartCard>
  );
}
