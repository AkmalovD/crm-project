"use client";

import { useMemo, useState } from "react";
import { DashboardScaffold } from "./DashboardScaffold";
import { MOCK_PATIENTS, PAGE_SIZE } from "../../data/dashboardData/medicalDashboardData";
import { MedicalAppointmentsMapCard } from "./MedicalAppointmentsMapCard";
import { MedicalDashboardHeader } from "./MedicalDashboardHeader";
import { MedicalDashboardTopBar } from "./MedicalDashboardTopBar";
import { MedicalPatientsTableCard } from "./MedicalPatientsTableCard";
import { MedicalSessionAnalyticsCard } from "./MedicalSessionAnalyticsCard";
import { MedicalStatsGrid } from "./MedicalStatsGrid";

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
        <MedicalDashboardTopBar />
        <MedicalDashboardHeader />
        <MedicalStatsGrid />
        <div className="grid grid-cols-[1.4fr_1fr] gap-4">
          <MedicalSessionAnalyticsCard chartPeriod={chartPeriod} onChartPeriodChange={setChartPeriod} />
          <MedicalAppointmentsMapCard />
        </div>
        <MedicalPatientsTableCard
          patients={paged}
          totalCount={MOCK_PATIENTS.length}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          page={page}
          totalPages={totalPages}
          onPreviousPage={() => setPage((previous) => Math.max(0, previous - 1))}
          onNextPage={() => setPage((previous) => Math.min(totalPages - 1, previous + 1))}
        />
      </div>
    </DashboardScaffold>
  );
}
