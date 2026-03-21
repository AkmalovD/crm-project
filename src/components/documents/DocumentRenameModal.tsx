import { FormEvent, useEffect, useState } from "react";

import { DocumentItem } from "./Documents.types";
import styles from "./DocumentsDashboardPage.module.css";

interface DocumentRenameModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, name: string) => void;
}

export function DocumentRenameModal({ document, isOpen, onClose, onSubmit }: DocumentRenameModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(document?.name ?? "");
  }, [document]);

  if (!isOpen || !document) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit(document.id, name.trim());
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Rename document</h3>
          <button type="button" className={styles.buttonGhost} onClick={onClose}>
            Close
          </button>
        </div>
        <form className={styles.modalBody} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter document name"
            autoFocus
          />
          <div className={styles.rowBetween}>
            <button type="button" className={styles.buttonGhost} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.buttonPrimary}>
              Save name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
