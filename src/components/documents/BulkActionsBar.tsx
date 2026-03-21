import { Archive, Trash2, X } from "lucide-react";

import styles from "./DocumentsDashboardPage.module.css";

interface BulkActionsBarProps {
  selectedCount: number;
  onClear: () => void;
  onBulkDownload: () => void;
  onBulkDelete: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onClear,
  onBulkDownload,
  onBulkDelete,
}: BulkActionsBarProps) {
  if (!selectedCount) return null;

  return (
    <div className={styles.bulkBar}>
      <div className={styles.bulkActions}>
        <button type="button" className={styles.buttonGhost} onClick={onClear}>
          <X size={14} /> Deselect all
        </button>
        <span>{selectedCount} document(s) selected</span>
      </div>
      <div className={styles.bulkActions}>
        <button type="button" className={styles.button} onClick={onBulkDownload}>
          <Archive size={14} /> Download ZIP
        </button>
        <button type="button" className={styles.buttonDanger} onClick={onBulkDelete}>
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
