import { ReactNode } from "react";
import { ReportPageTab } from "@/types/reportsDashboardTypes";
import styles from "./ReportsDashboardPage.module.css";

interface ReportsTabsProps {
  tabs: Array<{ id: ReportPageTab; label: string; icon: ReactNode }>;
  activeTab: ReportPageTab;
  onChange: (tab: ReportPageTab) => void;
}

export function ReportsTabs({ tabs, activeTab, onChange }: ReportsTabsProps) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
