import { Upload } from "lucide-react";

import styles from "./DocumentsDashboardPage.module.css";

interface DocumentUploadZoneProps {
  onOpenUpload: () => void;
}

export function DocumentUploadZone({ onOpenUpload }: DocumentUploadZoneProps) {
  return (
    <div className={`${styles.card} ${styles.dropzone}`}>
      <Upload size={28} />
      <p className={styles.dropzoneTitle}>Drag & drop files here</p>
      <p className={styles.dropzoneSub}>PDF, JPG, PNG, DOCX - max 20MB per file</p>
      <button type="button" className={styles.button} style={{ marginTop: "0.7rem" }} onClick={onOpenUpload}>
        Browse Files
      </button>
    </div>
  );
}
