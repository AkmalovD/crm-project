import { Download, Eye, FileText, ImageIcon, Lock, MoreHorizontal, Type } from "lucide-react";

import { CATEGORY_LABELS, FILE_TYPE_LABELS, formatDate, formatFileSize } from "./Documents.utils";
import { DocumentItem } from "./Documents.types";
import styles from "./DocumentsDashboardPage.module.css";

interface DocumentCardProps {
  document: DocumentItem;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

function typeClass(fileType: DocumentItem["fileType"]) {
  if (fileType === "pdf") return `${styles.filePill} ${styles.filePdf}`;
  if (fileType === "docx") return `${styles.filePill} ${styles.fileDocx}`;
  return `${styles.filePill} ${styles.fileImage}`;
}

function fileIcon(fileType: DocumentItem["fileType"]) {
  if (fileType === "pdf") return <FileText size={14} />;
  if (fileType === "docx") return <Type size={14} />;
  return <ImageIcon size={14} />;
}

export function DocumentCard({
  document,
  selected,
  onToggleSelect,
  onPreview,
  onDownload,
  onRename,
  onDelete,
}: DocumentCardProps) {
  return (
    <article className={`${styles.docCard} ${selected ? styles.docCardSelected : ""}`}>
      <div className={styles.docCardTop}>
        <label className={styles.rowBetween}>
          <input type="checkbox" checked={selected} onChange={() => onToggleSelect(document.id)} />
          <span className={typeClass(document.fileType)}>
            {fileIcon(document.fileType)} {FILE_TYPE_LABELS[document.fileType]}
          </span>
        </label>
        {document.isConfidential && <Lock size={14} title="Confidential" />}
      </div>

      <p className={styles.docName}>{document.name}</p>
      <p className={styles.docMeta}>
        {document.client?.fullName ?? "No client"} - {formatFileSize(document.fileSize)}
      </p>
      <p className={styles.docMeta}>{formatDate(document.uploadedAt)}</p>
      <span className={styles.badge}>{CATEGORY_LABELS[document.category]}</span>

      <div className={styles.docActions}>
        <button type="button" className={styles.button} onClick={() => onPreview(document.id)}>
          <Eye size={14} />
        </button>
        <button type="button" className={styles.button} onClick={() => onDownload(document.id)}>
          <Download size={14} />
        </button>
        <button type="button" className={styles.button} onClick={() => onRename(document.id)}>
          <MoreHorizontal size={14} />
        </button>
        <button type="button" className={styles.buttonDanger} onClick={() => onDelete(document.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
