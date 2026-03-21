import { LayoutGrid, List } from "lucide-react";

import { ViewMode } from "./Documents.types";
import styles from "./DocumentsDashboardPage.module.css";

interface DocumentsViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function DocumentsViewToggle({ viewMode, onChange }: DocumentsViewToggleProps) {
  return (
    <div className={styles.viewToggle}>
      <button
        type="button"
        className={`${styles.button} ${viewMode === "grid" ? styles.viewButtonActive : ""}`}
        onClick={() => onChange("grid")}
      >
        <LayoutGrid size={14} /> Grid
      </button>
      <button
        type="button"
        className={`${styles.button} ${viewMode === "list" ? styles.viewButtonActive : ""}`}
        onClick={() => onChange("list")}
      >
        <List size={14} /> List
      </button>
    </div>
  );
}
