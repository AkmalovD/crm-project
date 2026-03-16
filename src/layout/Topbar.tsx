type TopbarProps = {
  search: string;
  status: "All" | "Approved" | "Refunded" | "Unpaid";
  dateRange: "7d" | "30d" | "90d";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "All" | "Approved" | "Refunded" | "Unpaid") => void;
  onDateRangeChange: (value: "7d" | "30d" | "90d") => void;
};

export function Topbar({
  search,
  status,
  dateRange,
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
}: TopbarProps) {
  return (
    <header className="dashboard-topbar">
      <label className="dashboard-search">
        <span className="text-slate-400">⌕</span>
        <input
          aria-label="Search orders"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <div className="dashboard-topbar-actions">
        <button className="dashboard-icon-button" aria-label="Notifications">
          🔔
        </button>
        <button className="dashboard-icon-button" aria-label="Information">
          i
        </button>
        <div className="dashboard-user-pill">
          <span className="dashboard-avatar">EB</span>
          <span>Erik Brown</span>
          <span className="text-xs text-slate-400">▾</span>
        </div>
      </div>

      <div className="dashboard-content-actions">
        <label className="dashboard-select">
          <span className="text-slate-500">📅</span>
          <select
            value={dateRange}
            onChange={(event) => onDateRangeChange(event.target.value as "7d" | "30d" | "90d")}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </label>

        <label className="dashboard-select">
          <span className="text-slate-500">☰</span>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as "All" | "Approved" | "Refunded" | "Unpaid")
            }
          >
            <option value="All">All statuses</option>
            <option value="Approved">Approved</option>
            <option value="Refunded">Refunded</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </label>

        <button className="dashboard-add-order">+ Add Order</button>
      </div>
    </header>
  );
}
