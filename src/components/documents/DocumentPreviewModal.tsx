import { Download, Pencil } from "lucide-react";

import { DocumentItem } from "./Documents.types";
import { FILE_TYPE_LABELS, formatFileSize } from "./Documents.utils";
import styles from "./DocumentsDashboardPage.module.css";

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (id: string) => void;
  onRename: (id: string) => void;
}

export function DocumentPreviewModal({ document, isOpen, onClose, onDownload, onRename }: DocumentPreviewModalProps) {
  if (!isOpen || !document) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${styles.modalWide}`}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>{document.name}</h3>
            <p className={styles.modalSub}>
              {document.client?.fullName ?? "No client"} - {formatFileSize(document.fileSize)} -{" "}
              {FILE_TYPE_LABELS[document.fileType]}
            </p>
          </div>
          <div className={styles.docActions}>
            <button type="button" className={styles.button} onClick={() => onRename(document.id)}>
              <Pencil size={14} /> Rename
            </button>
            <button type="button" className={styles.buttonPrimary} onClick={() => onDownload(document.id)}>
              <Download size={14} /> Download
            </button>
            <button type="button" className={styles.buttonGhost} onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {document.fileType === "pdf" && (
          <div className={styles.previewBox}>
            <iframe src={document.fileUrl} title={document.name} style={{ width: "100%", height: "100%" }} />
          </div>
        )}

        {(document.fileType === "jpg" || document.fileType === "png") && (
          <div className={styles.previewBox}>
            <img
              src={document.fileUrl}
              alt={document.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}

        {document.fileType === "docx" && (
          <div className={styles.docxPlaceholder}>
            Word documents cannot be previewed in browser. Use download to view.
          </div>
        )}
      </div>
    </div>
  );
}
