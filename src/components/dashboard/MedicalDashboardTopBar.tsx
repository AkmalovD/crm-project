import { Bell, ChevronDown, Info, Search } from "lucide-react";

export function MedicalDashboardTopBar() {
  return (
    <div className="dashboard-topbar">
      <div className="dashboard-search">
        <Search size={15} color="#94a3b8" />
        <input placeholder="Search..." />
      </div>
      <div className="dashboard-topbar-actions">
        <button type="button" className="dashboard-icon-button">
          <Bell size={15} />
        </button>
        <button type="button" className="dashboard-icon-button">
          <Info size={15} />
        </button>
        <div className="dashboard-user-pill">
          <div className="dashboard-avatar">EB</div>
          <span>Erik Brown</span>
          <ChevronDown size={14} color="#9ca3af" />
        </div>
      </div>
    </div>
  );
}
