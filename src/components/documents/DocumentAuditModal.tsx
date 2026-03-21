import { AuditLogEntry, DocumentItem } from "./Documents.types";
import { AUDIT_ACTION_LABELS } from "./Documents.utils";
import styles from "./DocumentsDashboardPage.module.css";

interface DocumentAuditModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  auditEntries: AuditLogEntry[];
  onClose: () => void;
}

export function DocumentAuditModal({ document, isOpen, auditEntries, onClose }: DocumentAuditModalProps) {
  if (!isOpen || !document) return null;

  const rows = auditEntries.filter((item) => item.documentId === document.id);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>{document.name}</h3>
            <p className={styles.modalSub}>Audit log</p>
          </div>
          <button type="button" className={styles.buttonGhost} onClick={onClose}>
            Close
          </button>
        </div>
        <div className={styles.modalBody}>
          {rows.length === 0 ? <p className={styles.modalSub}>No audit activity yet.</p> : null}
          <ul className={styles.listPlain}>
            {rows.map((entry) => (
              <li key={entry.id} className={styles.auditItem}>
                <strong>{entry.performedByName}</strong> {AUDIT_ACTION_LABELS[entry.action]}
                {entry.meta ? ` (${Object.entries(entry.meta).map(([k, v]) => `${k}: ${v}`).join(", ")})` : ""}
                <div className={styles.modalSub}>{new Date(entry.performedAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
