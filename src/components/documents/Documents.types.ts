export type DocumentCategory =
  | "referral"
  | "assessment"
  | "consent_form"
  | "progress_report"
  | "invoice"
  | "other";

export type FileType = "pdf" | "jpg" | "png" | "docx";
export type ViewMode = "grid" | "list";

export interface PersonRef {
  id: string;
  fullName: string;
  avatar: string | null;
}

export interface DocumentItem {
  id: string;
  name: string;
  originalName: string;
  fileType: FileType;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl: string | null;
  category: DocumentCategory;
  tags: string[];
  isConfidential: boolean;
  client: PersonRef | null;
  therapist: PersonRef | null;
  uploadedByName: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  documentId: string;
  action: "viewed" | "downloaded" | "renamed" | "deleted" | "uploaded" | "confidential_toggled";
  performedByName: string;
  performedAt: string;
  meta: Record<string, string> | null;
}

export interface DocumentFiltersState {
  search: string;
  category: "all" | DocumentCategory;
  clientId: "all" | string;
  therapistId: "all" | string;
  fileType: "all" | FileType;
  sortBy: "uploadedAt_desc" | "uploadedAt_asc" | "name_asc" | "fileSize_desc" | "clientName_asc";
}
