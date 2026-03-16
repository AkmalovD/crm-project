import Link from "next/link";
import { LucideIcon } from "lucide-react";

export interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isOpen: boolean;
  active: boolean;
  badge?: string;
}

export default function SidebarNavItem({ href, label, icon: Icon, isOpen, active, badge }: NavItemProps) {
  return (
    <li>
      <Link
        href={href}
        title={!isOpen ? label : undefined}
        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
          active
            ? "bg-[#4acf7f]/12 font-medium text-[#4acf7f]"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        } ${!isOpen ? "justify-center" : "justify-between"}`}
      >
        <span className="flex shrink-0 items-center gap-2.5 overflow-hidden">
          <Icon size={16} className="shrink-0" aria-hidden="true" />
          {isOpen && <span className="truncate">{label}</span>}
        </span>
        {isOpen && badge && (
          <span className="ml-auto rounded-full bg-[#4acf7f]/20 px-2 py-0.5 text-xs font-semibold text-[#4acf7f]">
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
}
