import { Archive, Upload } from "lucide-react";

import styles from "./DocumentsDashboardPage.module.css";

interface DocumentsHeaderProps {
  selectedCount: number;
  onUpload: () => void;
  onBulkDownload: () => void;
}

export function DocumentsHeader({ selectedCount, onUpload, onBulkDownload }: DocumentsHeaderProps) {
  return (
    <div className={styles.headerRow}>
      <div>
        <h1 className={styles.title}>Documents</h1>
        <p className={styles.subtitle}>Manage client records, referrals, and reports.</p>
      </div>

      <div className={styles.actions}>
        {selectedCount > 0 && (
          <button type="button" className={styles.button} onClick={onBulkDownload}>
            <Archive size={14} /> Download ZIP ({selectedCount})
          </button>
        )}
        <button type="button" className={styles.buttonPrimary} onClick={onUpload}>
          <Upload size={14} /> Upload Documents
        </button>
      </div>
    </div>
  );
}
