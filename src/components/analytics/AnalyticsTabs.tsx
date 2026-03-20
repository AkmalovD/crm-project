import { TABS } from "@/data/analyticsData/analyticsDashboardData";
import { AnalyticsTab } from "../../types/analyticsDashboardTypes";
import { cx } from "../../utils/analyticsDashboardUtils";
import styles from "./AnalyticsDashboardPage.module.css";

interface AnalyticsTabsProps {
  activeTab: AnalyticsTab;
  onTabChange: (tab: AnalyticsTab) => void;
}

export function AnalyticsTabs({ activeTab, onTabChange }: AnalyticsTabsProps) {
  return (
    <div className={styles.analyticsTabs}>
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          className={cx(styles.analyticsTab, activeTab === tab && styles.tabActive)}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
