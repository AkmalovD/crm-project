"use client";

import { useEffect, useState } from "react";

import { Sidebar } from "./Sidebar";

const SIDEBAR_STORAGE_KEY = "dashboard.sidebar.open";

export function DashboardScaffold({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === "0") {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((previous) => {
      const next = !previous;
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <div className={`dashboard-shell ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
