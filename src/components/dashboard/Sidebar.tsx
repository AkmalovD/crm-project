const pagesItems = ["Dashboard", "Analytics", "E-commerce", "Orders", "Customers", "Invoices"];
const appItems = ["Finance", "Messages", "Calendar", "Tasks"];

export function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="size-4 rounded-full bg-[radial-gradient(circle_at_35%_35%,#5f63ff_0%,#5f63ff_45%,#2f36e8_100%)]" />
        <span className="text-2xl font-semibold tracking-tight text-slate-800">REduce</span>
      </div>

      <nav className="px-4 pb-6">
        <SectionLabel title="Pages" />
        <ul className="space-y-1.5">
          {pagesItems.map((item) => {
            const isOrdersGroup = item === "E-commerce";
            const isChild = item === "Orders" || item === "Customers" || item === "Invoices";
            const isActiveChild = item === "Orders";

            if (isOrdersGroup) {
              return (
                <li key={item} className="mt-2 rounded-xl bg-[#5b61f6] p-3 text-white shadow-sm">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{item}</span>
                    <span className="text-xs">▾</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-white/90">
                    <li className="rounded-md bg-white/15 px-2 py-1 font-medium text-white">Orders</li>
                    <li className="px-2 py-1">Customers</li>
                    <li className="px-2 py-1">Invoices</li>
                  </ul>
                </li>
              );
            }

            return (
              <li
                key={item}
                className={[
                  "rounded-lg px-3 py-2 text-sm text-slate-600",
                  isChild ? "ml-2 hidden" : "",
                  isActiveChild ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-100",
                ].join(" ")}
              >
                {item}
              </li>
            );
          })}
        </ul>

        <SectionLabel className="mt-7" title="Apps" />
        <ul className="space-y-1.5">
          {appItems.map((item) => (
            <li key={item} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              <div className="flex items-center justify-between">
                <span>{item}</span>
                {item === "Messages" ? (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">+16</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <SectionLabel className="mt-7" title="Settings" />
        <ul className="space-y-1.5">
          <li className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">My Profile</li>
        </ul>
      </nav>
    </aside>
  );
}

function SectionLabel({ title, className = "" }: { title: string; className?: string }) {
  return (
    <h3 className={`mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 ${className}`}>
      {title}
    </h3>
  );
}
