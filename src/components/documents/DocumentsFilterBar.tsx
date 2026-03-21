import { ChangeEvent } from "react";
import { X } from "lucide-react";

import { DocumentCategory, DocumentFiltersState } from "./Documents.types";
import styles from "./DocumentsDashboardPage.module.css";

interface Option {
  value: string;
  label: string;
}

interface DocumentsFilterBarProps {
  filters: DocumentFiltersState;
  clientOptions: Option[];
  therapistOptions: Option[];
  onChange: (next: DocumentFiltersState) => void;
}

const CATEGORY_OPTIONS: Array<{ value: "all" | DocumentCategory; label: string }> = [
  { value: "all", label: "All Categories" },
  { value: "referral", label: "Referral" },
  { value: "assessment", label: "Assessment" },
  { value: "consent_form", label: "Consent Form" },
  { value: "progress_report", label: "Progress Report" },
  { value: "invoice", label: "Invoice" },
  { value: "other", label: "Other" },
];

export function DocumentsFilterBar({
  filters,
  clientOptions,
  therapistOptions,
  onChange,
}: DocumentsFilterBarProps) {
  const update = (key: keyof DocumentFiltersState) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({ ...filters, [key]: event.target.value });
  };

  return (
    <div className={`${styles.card} ${styles.filterRow}`} style={{ padding: "0.75rem" }}>
      <div className={styles.filterControls}>
        <input
          className={styles.input}
          placeholder="Search by name or client..."
          value={filters.search}
          onChange={update("search")}
        />
        <select className={styles.select} value={filters.category} onChange={update("category")}>
          {CATEGORY_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select className={styles.select} value={filters.clientId} onChange={update("clientId")}>
          <option value="all">All Clients</option>
          {clientOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select className={styles.select} value={filters.therapistId} onChange={update("therapistId")}>
          <option value="all">All Therapists</option>
          {therapistOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select className={styles.select} value={filters.fileType} onChange={update("fileType")}>
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="jpg">JPG</option>
          <option value="png">PNG</option>
          <option value="docx">DOCX</option>
        </select>
        <select className={styles.select} value={filters.sortBy} onChange={update("sortBy")}>
          <option value="uploadedAt_desc">Newest first</option>
          <option value="uploadedAt_asc">Oldest first</option>
          <option value="name_asc">Name A-Z</option>
          <option value="fileSize_desc">Largest first</option>
          <option value="clientName_asc">Client name</option>
        </select>
      </div>

      <button
        type="button"
        className={styles.buttonGhost}
        onClick={() =>
          onChange({
            search: "",
            category: "all",
            clientId: "all",
            therapistId: "all",
            fileType: "all",
            sortBy: "uploadedAt_desc",
          })
        }
      >
        <X size={14} /> Clear
      </button>
    </div>
  );
}
