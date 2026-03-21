import { Check, Copy } from "lucide-react";
import { SavedReport } from "@/types/reportsDashboardTypes";
import styles from "./ReportsDashboardPage.module.css";

interface ShareReportModalProps {
  selectedReport: SavedReport;
  copiedShareLink: boolean;
  onCopy: () => void;
  onRevoke: () => void;
  onClose: () => void;
}

export function ShareReportModal({
  selectedReport,
  copiedShareLink,
  onCopy,
  onRevoke,
  onClose,
}: ShareReportModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Share Report</h3>
        <p className={styles.helperText}>Share configuration-only link for {selectedReport.name}.</p>
        <div className={styles.row}>
          <input
            className={styles.input}
            readOnly
            value={`${typeof window === "undefined" ? "" : window.location.origin}/reports/shared/${selectedReport.shareToken ?? ""}`}
          />
          <button type="button" className={styles.secondaryButton} onClick={onCopy}>
            <Copy size={14} />
          </button>
        </div>
        {copiedShareLink && (
          <p className={styles.successText}>
            <Check size={13} /> Link copied to clipboard
          </p>
        )}
        <div className={styles.rowBetween}>
          <button type="button" className={styles.ghostButtonDanger} onClick={onRevoke}>
            Revoke link
          </button>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
