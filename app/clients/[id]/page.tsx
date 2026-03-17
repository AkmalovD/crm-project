import { DashboardScaffold } from "@/components/dashboard/DashboardScaffold";

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardScaffold>
      <section className="rounded-xl border border-(--border) bg-white p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Client Profile</p>
            <h1 className="text-3xl font-bold text-[#1a1a2e]">{id}</h1>
          </div>
          <span className="rounded-full bg-[#e8fbf4] px-3 py-1 text-xs font-semibold text-emerald-700">Active</span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-(--border) p-4">
            <h2 className="text-sm font-semibold text-slate-700">Assigned Therapist</h2>
            <p className="mt-2 text-sm text-slate-500">Dr. Mia Carter</p>
          </article>
          <article className="rounded-lg border border-(--border) p-4">
            <h2 className="text-sm font-semibold text-slate-700">Last Session</h2>
            <p className="mt-2 text-sm text-slate-500">Mar 12, 2026</p>
          </article>
          <article className="rounded-lg border border-(--border) p-4">
            <h2 className="text-sm font-semibold text-slate-700">Total Sessions</h2>
            <p className="mt-2 text-sm text-slate-500">36</p>
          </article>
        </div>
      </section>
    </DashboardScaffold>
  );
}
