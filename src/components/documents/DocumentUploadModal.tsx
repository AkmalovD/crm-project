import { FormEvent, useMemo, useState } from "react";

import styles from "./DocumentsDashboardPage.module.css";

interface DocumentUploadModalProps {
  isOpen: boolean;
  pendingFileNames: string[];
  onClose: () => void;
  onSubmit: (payload: { category: string; tags: string[]; isConfidential: boolean }) => void;
}

export function DocumentUploadModal({ isOpen, pendingFileNames, onClose, onSubmit }: DocumentUploadModalProps) {
  const [category, setCategory] = useState("other");
  const [tags, setTags] = useState("");
  const [isConfidential, setIsConfidential] = useState(false);

  const normalizedTags = useMemo(
    () =>
      tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [tags],
  );

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ category, tags: normalizedTags, isConfidential });
    setTags("");
    setCategory("other");
    setIsConfidential(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Upload documents</h3>
          <button type="button" className={styles.button} onClick={onClose}>
            Close
          </button>
        </div>

        <form className={styles.modalBody} onSubmit={handleSubmit}>
          <ul className={styles.listPlain}>
            {pendingFileNames.length === 0 ? <li>No files selected yet.</li> : null}
            {pendingFileNames.map((fileName) => (
              <li key={fileName} className={styles.rowBetween}>
                <span>{fileName}</span>
                <span>Ready</span>
              </li>
            ))}
          </ul>

          <label className={styles.rowBetween}>
            Category
            <select className={styles.select} value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="referral">Referral</option>
              <option value="assessment">Assessment</option>
              <option value="consent_form">Consent Form</option>
              <option value="progress_report">Progress Report</option>
              <option value="invoice">Invoice</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className={styles.rowBetween}>
            Tags
            <input
              className={styles.input}
              placeholder="urgent, billing, signed"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </label>

          <label className={styles.rowBetween}>
            Confidential
            <input
              type="checkbox"
              checked={isConfidential}
              onChange={(event) => setIsConfidential(event.target.checked)}
            />
          </label>

          <div className={styles.rowBetween}>
            <button type="button" className={styles.buttonGhost} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.buttonPrimary}>
              Upload {pendingFileNames.length || ""} file(s)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
