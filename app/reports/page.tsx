import { Suspense } from "react";

import { ReportsDashboardPage } from "@/components/reports/ReportsDashboardPage";

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <p className="p-6 text-sm text-neutral-500">Loading reports…</p>
      }
    >
      <ReportsDashboardPage />
    </Suspense>
  );
}
