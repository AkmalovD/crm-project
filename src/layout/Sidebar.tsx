"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Hospital,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  BarChart2,
  Users,
  CalendarDays,
  FileText,
  FolderOpen,
  UserCheck,
  Stethoscope,
  DoorOpen,
  DollarSign,
  MessageSquare,
  Calendar,
  CheckSquare,
  User,
  LucideIcon,
} from "lucide-react";

import SidebarNavItem from "./SidebarNavItem";
import SidebarSectionLabel from "./SidebarSectionLabel";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLinkItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavSection {
  title: string;
  links: NavLinkItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// ─── Navigation data ─────────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Pages",
    links: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart2 },
    ],
  },
  {
    title: "Clients",
    links: [
      { label: "Clients", href: "/clients", icon: Users },
      { label: "Appointments", href: "/appointments", icon: CalendarDays },
      { label: "Reports", href: "/reports", icon: FileText },
      { label: "Documents", href: "/documents", icon: FolderOpen },
    ],
  },
  {
    title: "Management",
    links: [
      { label: "Therapists", href: "/therapists", icon: UserCheck },
      { label: "Services", href: "/services", icon: Stethoscope },
      { label: "Rooms", href: "/rooms", icon: DoorOpen },
    ],
  },
  {
    title: "Apps",
    links: [
      { label: "Finance", href: "/finance", icon: DollarSign },
      { label: "Messages", href: "/messages", icon: MessageSquare, badge: "+16" },
      { label: "Calendar", href: "/calendar", icon: Calendar },
      { label: "Tasks", href: "/tasks", icon: CheckSquare },
    ],
  },
  {
    title: "Settings",
    links: [{ label: "My Profile", href: "/my-profile", icon: User }],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`dashboard-sidebar flex h-screen min-h-0 flex-col ${isOpen ? "is-open" : "is-collapsed"}`}>
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <Link href="/dashboard" className={`flex items-center gap-2 overflow-hidden ${!isOpen ? "hidden" : ""}`}>
          <Hospital size={20} color="#4acf7f" />
          <span className="text-xl font-semibold tracking-tight text-slate-800">Med</span>
        </Link>
        {!isOpen && (
          <div className="mx-auto">
            <Hospital size={20} color="#4acf7f" />
          </div>
        )}
        <button
          type="button"
          className="dashboard-sidebar-toggle"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          {isOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
        {NAV_SECTIONS.map((section, i) => (
          <div key={section.title} className={i > 0 ? "mt-6" : undefined}>
            <SidebarSectionLabel title={section.title} isOpen={isOpen} />
            <ul className="space-y-0.5">
              {section.links.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  badge={item.badge}
                  isOpen={isOpen}
                  active={isRouteActive(pathname, item.href)}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 px-4 py-4">
        {isOpen ? (
          <div className="space-y-1 text-xs text-slate-500">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tech Support</p>
            <p className="font-medium text-slate-700">+998 (90) 033 25 11</p>
            <p>dilmurodakmalov20@gmail.com</p>
          </div>
        ) : (
          <div className="flex justify-center text-slate-400" title="Tech Support">
            <MessageSquare size={16} />
          </div>
        )}
      </div>
    </aside>
  );
}
