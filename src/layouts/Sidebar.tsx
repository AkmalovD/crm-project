"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hospital } from 'lucide-react'
 
type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const pageLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
];

const clientLinks = [
  { label: "Clients", href: "/clients" },
  { label: "Appointments", href: "/appointments" },
  { label: "Reports", href: "/reports" },
  { label: "Documents", href: "/documents" },

];

const managementLinks = [
  { label: "Therapists", href: "/therapists" },
  { label: "Services", href: "/services" },
  { label: "Rooms", href: "/rooms" },
]

const appLinks = [
  { label: "Finance", href: "/finance" },
  { label: "Messages", href: "/messages", badge: "+16" },
  { label: "Calendar", href: "/calendar" },
  { label: "Tasks", href: "/tasks" },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`dashboard-sidebar flex h-screen min-h-0 flex-col ${isOpen ? "is-open" : "is-collapsed"}`}>
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <div className="flex items-center gap-2 overflow-hidden ml-1">
          <Hospital color="#4acf7f"/>
          {isOpen ? <span className="text-2xl font-semibold tracking-tight text-slate-800">Med</span> : null}  
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

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
        <SectionLabel title="Pages" isOpen={isOpen} />
        <ul className="space-y-1.5">
          {pageLinks.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} isOpen={isOpen} active={isRouteActive(pathname, item.href)} />
          ))}
        </ul>

        <SectionLabel className="mt-7" title="Clients" isOpen={isOpen} />
        <ul className="space-y-1.5">
          {clientLinks.map((item) => (
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
              </Link>
            </li>
          ))}
        </ul>

        <SectionLabel className="mt-7" title="Management" isOpen={isOpen} />
        <ul className="space-y-1.5">
          {managementLinks.map((item) => (
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
              </Link>
            </li>
          ))}
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

      <div className="border-t border-slate-200 px-4 py-4">
        {isOpen ? (
          <div className="space-y-1 text-xs text-slate-500">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tech Support</p>
            <p className="font-medium text-slate-700">+998 (90) 033 25 11</p>
            <p>dilmurodakmalov20@gmail.com</p>
          </div>
        ) : (
          <div className="rounded-lg bg-slate-100 px-2 py-1 text-center text-[11px] font-semibold text-slate-600">TS</div>
        )}
      </div>
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
