"use client";

import { useState } from "react";

import Sidebar from "../../layout/Sidebar";

const SIDEBAR_STORAGE_KEY = "dashboard.sidebar.open";

export function DashboardScaffold({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "0";
  });

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
