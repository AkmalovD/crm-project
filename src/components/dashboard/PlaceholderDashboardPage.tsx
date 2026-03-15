import { DashboardScaffold } from "./DashboardScaffold";

type PlaceholderDashboardPageProps = {
  title: string;
  description?: string;
};

export function PlaceholderDashboardPage({
  title,
  description = "This page is set up and connected to the sidebar routing.",
}: PlaceholderDashboardPageProps) {
  return (
    <DashboardScaffold>
      <section className="dashboard-placeholder-card">
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </DashboardScaffold>
  );
}
