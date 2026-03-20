"use client";

import { useMemo, useState } from "react";

import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import { AnalyticsAnnualActivityCard } from "./AnalyticsAnnualActivityCard";
import { AnalyticsBookingAndCancellationSection } from "./AnalyticsBookingAndCancellationSection";
import { AnalyticsClientAndFunnelSection } from "./AnalyticsClientAndFunnelSection";
import { AnalyticsKpiCard } from "./AnalyticsKpiCard";
import { AnalyticsOutcomesAndServicesSection } from "./AnalyticsOutcomesAndServicesSection";
import { AnalyticsPageHeader } from "./AnalyticsPageHeader";
import { AnalyticsRevenueAndAgeSection } from "./AnalyticsRevenueAndAgeSection";
import { AnalyticsRevenueInsightsSection } from "./AnalyticsRevenueInsightsSection";
import { AnalyticsTabs } from "./AnalyticsTabs";
import { AnalyticsTherapistPerformanceCard } from "./AnalyticsTherapistPerformanceCard";
import styles from "./AnalyticsDashboardPage.module.css";
import {
  HOURS,
  KPI_DATA,
  OUTCOME_DATA,
  THERAPISTS,
  THERAPIST_PAGE_SIZE,
  WEEK_DAYS,
} from "@/data/analyticsData/analyticsDashboardData";
import { AnalyticsTab, SeriesToggle, TherapistSortBy } from "../../types/analyticsDashboardTypes";
import { buildAnnualActivity } from "../../utils/analyticsDashboardUtils";

export function AnalyticsDashboardPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("Overview");
  const [seriesToggle, setSeriesToggle] = useState<SeriesToggle>("Both");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<TherapistSortBy>("completion");
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

  const totalPages = Math.max(1, Math.ceil(therapistsFiltered.length / THERAPIST_PAGE_SIZE));
  const therapistRows = therapistsFiltered.slice((page - 1) * THERAPIST_PAGE_SIZE, page * THERAPIST_PAGE_SIZE);

  const totalSessions = OUTCOME_DATA.reduce((sum, item) => sum + item.value, 0);

  return (
    <DashboardScaffold>
      <div className={styles.analyticsPage}>
        <AnalyticsPageHeader />
        <AnalyticsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <section className={styles.analyticsKpiGrid}>
          {KPI_DATA.map((card) => (
            <AnalyticsKpiCard key={card.label} {...card} />
          ))}
        </section>

        <AnalyticsRevenueAndAgeSection
          seriesToggle={seriesToggle}
          onSeriesToggleChange={setSeriesToggle}
        />
        <AnalyticsOutcomesAndServicesSection totalSessions={totalSessions} />
        <AnalyticsBookingAndCancellationSection bookingHeatmap={bookingHeatmap} />
        <AnalyticsTherapistPerformanceCard
          query={query}
          sortBy={sortBy}
          page={page}
          totalPages={totalPages}
          therapistRows={therapistRows}
          onQueryChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          onSortChange={(value) => {
            setSortBy(value);
            setPage(1);
          }}
          onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
          onNextPage={() => setPage((current) => Math.min(totalPages, current + 1))}
        />
        <AnalyticsClientAndFunnelSection />
        <AnalyticsRevenueInsightsSection />
        <AnalyticsAnnualActivityCard activityCells={activityCells} />
      </div>
    </DashboardScaffold>
  );
}
