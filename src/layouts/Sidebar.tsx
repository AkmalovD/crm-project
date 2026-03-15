"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const pageLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
];

const ecommerceLinks = [
  { label: "Orders", href: "/orders" },
  { label: "Customers", href: "/customers" },
  { label: "Invoices", href: "/invoices" },
];

const appLinks = [
  { label: "Finance", href: "/finance" },
  { label: "Messages", href: "/messages", badge: "+16" },
  { label: "Calendar", href: "/calendar" },
  { label: "Tasks", href: "/tasks" },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const isEcommerceActive =
    pathname === "/e-commerce" || ecommerceLinks.some((link) => isRouteActive(pathname, link.href));

  return (
    <aside className={`dashboard-sidebar ${isOpen ? "is-open" : "is-collapsed"}`}>
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="size-4 shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,#5f63ff_0%,#5f63ff_45%,#2f36e8_100%)]" />
          {isOpen ? <span className="text-2xl font-semibold tracking-tight text-slate-800">REduce</span> : null}
        </div>
        <button
          type="button"
          className="dashboard-sidebar-toggle"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          {isOpen ? "<<" : ">>"}
        </button>
      </div>

      <nav className="px-3 pb-6">
        <SectionLabel title="Pages" isOpen={isOpen} />
        <ul className="space-y-1.5">
          {pageLinks.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} isOpen={isOpen} active={isRouteActive(pathname, item.href)} />
          ))}
          <li className={`mt-2 rounded-xl p-2.5 shadow-sm ${isEcommerceActive ? "bg-[#5b61f6] text-white" : "bg-slate-100"}`}>
            <Link
              href="/e-commerce"
              className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm font-medium ${isEcommerceActive ? "text-white" : "text-slate-700 hover:bg-white/70"}`}
            >
              <span>{isOpen ? "E-commerce" : "EC"}</span>
              {isOpen ? <span className="text-xs">▾</span> : null}
            </Link>
            {isOpen ? (
              <ul className={`mt-2 space-y-1 text-sm ${isEcommerceActive ? "text-white/90" : "text-slate-600"}`}>
                {ecommerceLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-2 py-1 ${
                        isRouteActive(pathname, item.href)
                          ? isEcommerceActive
                            ? "bg-white/15 font-medium text-white"
                            : "bg-indigo-50 font-medium text-indigo-700"
                          : isEcommerceActive
                            ? "hover:bg-white/10"
                            : "hover:bg-slate-200"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        </ul>

        <SectionLabel className="mt-7" title="Apps" isOpen={isOpen} />
        <ul className="space-y-1.5">
          {appLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${
                  isRouteActive(pathname, item.href)
                    ? "bg-indigo-50 font-medium text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{isOpen ? item.label : item.label.slice(0, 2).toUpperCase()}</span>
                {isOpen && item.badge ? (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">{item.badge}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <SectionLabel className="mt-7" title="Settings" isOpen={isOpen} />
        <ul className="space-y-1.5">
          <NavItem href="/my-profile" label="My Profile" isOpen={isOpen} active={isRouteActive(pathname, "/my-profile")} />
        </ul>
      </nav>
    </aside>
  );
}

function NavItem({
  href,
  label,
  isOpen,
  active,
}: {
  href: string;
  label: string;
  isOpen: boolean;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`block rounded-lg px-3 py-2 text-sm ${
          active ? "bg-indigo-50 font-medium text-indigo-700" : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        {isOpen ? label : label.slice(0, 2).toUpperCase()}
      </Link>
    </li>
  );
}

function SectionLabel({ title, className = "", isOpen }: { title: string; className?: string; isOpen: boolean }) {
  if (!isOpen) {
    return null;
  }

  return (
    <h3 className={`mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 ${className}`}>
      {title}
    </h3>
  );
}

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
