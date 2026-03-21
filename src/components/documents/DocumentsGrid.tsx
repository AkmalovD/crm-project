import { DocumentItem } from "./Documents.types";
import { DocumentCard } from "./DocumentCard";
import styles from "./DocumentsDashboardPage.module.css";

interface DocumentsGridProps {
  documents: DocumentItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DocumentsGrid({
  documents,
  selectedIds,
  onToggleSelect,
  onPreview,
  onDownload,
  onRename,
  onDelete,
}: DocumentsGridProps) {
  return (
    <section className={styles.grid}>
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          selected={selectedIds.has(document.id)}
          onToggleSelect={onToggleSelect}
          onPreview={onPreview}
          onDownload={onDownload}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
