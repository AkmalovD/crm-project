import { Download, Search } from "lucide-react";
import { THERAPIST_PAGE_SIZE, THERAPISTS } from "@/data/analyticsData/analyticsDashboardData";
import { TherapistItem, TherapistSortBy } from "../../types/analyticsDashboardTypes";
import { CURRENCY, NUMBER, cx } from "../../utils/analyticsDashboardUtils";
import styles from "./AnalyticsDashboardPage.module.css";

interface AnalyticsTherapistPerformanceCardProps {
  query: string;
  sortBy: TherapistSortBy;
  page: number;
  totalPages: number;
  therapistRows: TherapistItem[];
  onQueryChange: (value: string) => void;
  onSortChange: (value: TherapistSortBy) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function AnalyticsTherapistPerformanceCard({
  query,
  sortBy,
  page,
  totalPages,
  therapistRows,
  onQueryChange,
  onSortChange,
  onPreviousPage,
  onNextPage,
}: AnalyticsTherapistPerformanceCardProps) {
  return (
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
            <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search therapist" />
          </label>
          <select
            className={styles.analyticsFilter}
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as TherapistSortBy)}
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
        <span>Rows per page: {THERAPIST_PAGE_SIZE}</span>
        <button type="button" className={styles.analyticsPager} disabled={page <= 1} onClick={onPreviousPage}>
          Previous
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button type="button" className={styles.analyticsPager} disabled={page >= totalPages} onClick={onNextPage}>
          Next
        </button>
      </div>
    </section>
  );
}
