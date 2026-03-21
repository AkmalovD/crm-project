import { Download, Eye, Lock, Pencil, Trash2 } from "lucide-react";

import { CATEGORY_LABELS, FILE_TYPE_LABELS, formatDate, formatFileSize } from "./Documents.utils";
import { DocumentItem } from "./Documents.types";
import styles from "./DocumentsDashboardPage.module.css";

interface DocumentsTableProps {
  documents: DocumentItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DocumentsTable({
  documents,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onPreview,
  onDownload,
  onRename,
  onDelete,
}: DocumentsTableProps) {
  const allSelected = documents.length > 0 && documents.every((item) => selectedIds.has(item.id));
  return (
    <section className={`${styles.card} ${styles.tableWrap}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onSelectAll(allSelected ? [] : documents.map((item) => item.id))}
              />
            </th>
            <th>Name</th>
            <th>Category</th>
            <th>Client</th>
            <th>Therapist</th>
            <th>Type</th>
            <th>Size</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.has(document.id)}
                  onChange={() => onToggleSelect(document.id)}
                />
              </td>
              <td>
                {document.name} {document.isConfidential && <Lock size={12} />}
              </td>
              <td>{CATEGORY_LABELS[document.category]}</td>
              <td>{document.client?.fullName ?? "No client"}</td>
              <td>{document.therapist?.fullName ?? "Unassigned"}</td>
              <td>{FILE_TYPE_LABELS[document.fileType]}</td>
              <td>{formatFileSize(document.fileSize)}</td>
              <td>{formatDate(document.uploadedAt)}</td>
              <td>
                <div className={styles.docActions}>
                  <button type="button" className={styles.button} onClick={() => onPreview(document.id)}>
                    <Eye size={13} />
                  </button>
                  <button type="button" className={styles.button} onClick={() => onDownload(document.id)}>
                    <Download size={13} />
                  </button>
                  <button type="button" className={styles.button} onClick={() => onRename(document.id)}>
                    <Pencil size={13} />
                  </button>
                  <button type="button" className={styles.buttonDanger} onClick={() => onDelete(document.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
