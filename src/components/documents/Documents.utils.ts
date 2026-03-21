import { AuditLogEntry, DocumentCategory, DocumentItem, FileType } from "./Documents.types";

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  referral: "Referral",
  assessment: "Assessment",
  consent_form: "Consent Form",
  progress_report: "Progress Report",
  invoice: "Invoice",
  other: "Other",
};

export const FILE_TYPE_LABELS: Record<FileType, string> = {
  pdf: "PDF",
  jpg: "JPG",
  png: "PNG",
  docx: "DOCX",
};

export const AUDIT_ACTION_LABELS: Record<AuditLogEntry["action"], string> = {
  uploaded: "uploaded this document",
  viewed: "viewed this document",
  downloaded: "downloaded this document",
  renamed: "renamed this document",
  deleted: "deleted this document",
  confidential_toggled: "changed confidential status",
};

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function compareDocuments(left: DocumentItem, right: DocumentItem, sortBy: string) {
  switch (sortBy) {
    case "uploadedAt_asc":
      return left.uploadedAt.localeCompare(right.uploadedAt);
    case "name_asc":
      return left.name.localeCompare(right.name);
    case "fileSize_desc":
      return right.fileSize - left.fileSize;
    case "clientName_asc":
      return (left.client?.fullName ?? "").localeCompare(right.client?.fullName ?? "");
    case "uploadedAt_desc":
    default:
      return right.uploadedAt.localeCompare(left.uploadedAt);
  }
}
