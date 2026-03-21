# Vocalis — Documents Page Implementation Prompt

## Stack Reference (from .cursorrules)
- **Framework**: Next.js App Router + TypeScript
- **UI**: Tailwind CSS + shadcn/ui (new-york) + CVA
- **State**: TanStack React Query (server state) + Zustand (UI state)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table (list view)
- **File Upload**: uploadthing
- **Icons**: Lucide React
- **Toasts**: Sonner

---

## Route & File Structure

```
src/
└── app/
    └── (dashboard)/
        └── documents/
            ├── page.tsx                        ← Server Component
            ├── loading.tsx                     ← Skeleton loading
            ├── error.tsx                       ← Error boundary
            └── _components/
                ├── DocumentsHeader.tsx
                ├── DocumentsFilterBar.tsx
                ├── DocumentsViewToggle.tsx
                ├── DocumentsGrid.tsx
                ├── DocumentsTable.tsx
                ├── DocumentCard.tsx
                ├── DocumentUploadZone.tsx
                ├── DocumentUploadModal.tsx
                ├── DocumentPreviewModal.tsx
                ├── DocumentRenameModal.tsx
                ├── DocumentAuditModal.tsx
                └── BulkActionsBar.tsx

src/
├── features/
│   └── documents/
│       ├── api/
│       │   └── documents.api.ts
│       ├── hooks/
│       │   ├── useDocuments.ts
│       │   ├── useUploadDocument.ts
│       │   ├── useRenameDocument.ts
│       │   ├── useDeleteDocument.ts
│       │   ├── useDeleteDocuments.ts
│       │   ├── useDownloadDocument.ts
│       │   ├── useBulkDownload.ts
│       │   ├── useToggleConfidential.ts
│       │   └── useDocumentAuditLog.ts
│       ├── types/
│       │   └── documents.types.ts
│       └── validators/
│           ├── uploadDocument.schema.ts
│           └── renameDocument.schema.ts
└── store/
    └── useDocumentStore.ts       ← Zustand: view mode, selected docs, modals
```

---

## Page Architecture

### `page.tsx` — Server Component
```tsx
// Read filters + view mode from searchParams
// Fetch initial documents server-side for fast first paint
export default async function DocumentsPage({ searchParams }) {
  const filters = parseDocumentFilters(searchParams)
  const initialDocuments = await fetchDocuments(filters)

  return (
    <DocumentsClientShell
      initialDocuments={initialDocuments}
      initialFilters={filters}
    />
  )
}
```

### Component Rendering Order
```
PageHeader (title + upload button + bulk download)
  └── DocumentsFilterBar (search + category + client + therapist + date + file type)
      └── DocumentsViewToggle (Grid | List)
          ├── BulkActionsBar (shown when items selected)
          ├── DocumentUploadZone (drag & drop — always visible at top)
          ├── [grid view] → DocumentsGrid → DocumentCard[]
          └── [list view] → DocumentsTable (TanStack Table)
```

---

## State Management

### Zustand Store — `useDocumentStore.ts`
```ts
interface DocumentStore {
  // View
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void

  // Selection (for bulk actions)
  selectedIds: Set<string>
  toggleSelect: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void

  // Modals
  isUploadModalOpen: boolean
  isPreviewModalOpen: boolean
  isRenameModalOpen: boolean
  isAuditModalOpen: boolean
  activeDocumentId: string | null

  openUploadModal: () => void
  closeUploadModal: () => void
  openPreviewModal: (id: string) => void
  closePreviewModal: () => void
  openRenameModal: (id: string) => void
  closeRenameModal: () => void
  openAuditModal: (id: string) => void
  closeAuditModal: () => void
}
```

### React Query Hooks
```ts
// Paginated document list with filters
useDocuments(filters: DocumentFilters)

// Audit log for a single document
useDocumentAuditLog(documentId: string)

// Mutations
useUploadDocument()
useRenameDocument()
useDeleteDocument()
useDeleteDocuments()        // bulk delete
useBulkDownload()           // download as ZIP
useToggleConfidential()

// Query key constants
export const DOCUMENT_KEYS = {
  all: ['documents'],
  list: (filters) => ['documents', 'list', filters],
  audit: (id) => ['documents', 'audit', id],
}
```

### URL Search Params
```
?search=referral&category=assessment&clientId=abc&therapistId=xyz
&fileType=pdf&from=2025-01-01&to=2025-12-31&page=1&perPage=20&view=grid
// All filters + view mode + pagination in URL — fully bookmarkable
```

---

## Types — `documents.types.ts`

```ts
export type DocumentCategory =
  | 'referral'
  | 'assessment'
  | 'consent_form'
  | 'progress_report'
  | 'invoice'
  | 'other'

export type FileType = 'pdf' | 'jpg' | 'png' | 'docx'

export type DocumentSortBy =
  | 'uploadedAt'
  | 'name'
  | 'fileSize'
  | 'clientName'

export interface Document {
  id: string
  name: string
  originalName: string
  fileType: FileType
  fileSize: number              // bytes
  fileUrl: string               // signed URL for download/preview
  thumbnailUrl: string | null   // for images
  category: DocumentCategory
  tags: string[]
  isConfidential: boolean
  // Relations
  clientId: string | null
  client: Pick<Client, 'id' | 'fullName' | 'avatar'> | null
  therapistId: string | null
  therapist: Pick<Therapist, 'id' | 'fullName' | 'avatar'> | null
  // Meta
  uploadedBy: string
  uploadedByName: string
  uploadedAt: string
  updatedAt: string
}

export interface DocumentFilters {
  search?: string
  category?: DocumentCategory
  clientId?: string
  therapistId?: string
  fileType?: FileType
  from?: string
  to?: string
  isConfidential?: boolean
  page: number
  perPage: number
  sortBy?: DocumentSortBy
  sortDir?: 'asc' | 'desc'
}

export interface AuditLogEntry {
  id: string
  documentId: string
  action: 'viewed' | 'downloaded' | 'renamed' | 'deleted' | 'uploaded' | 'confidential_toggled'
  performedBy: string
  performedByName: string
  performedAt: string
  meta: Record<string, string> | null   // e.g. old name → new name for rename
}

export interface UploadProgress {
  fileId: string
  fileName: string
  progress: number              // 0-100
  status: 'uploading' | 'done' | 'error'
  error?: string
}
```

---

## Validators

### `uploadDocument.schema.ts`
```ts
const MAX_FILE_SIZE = 20 * 1024 * 1024    // 20MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export const uploadDocumentSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, 'Select at least one file')
    .refine(
      (files) => files.every((f) => f.size <= MAX_FILE_SIZE),
      'Each file must be under 20MB'
    )
    .refine(
      (files) => files.every((f) => ALLOWED_TYPES.includes(f.type)),
      'Only PDF, JPG, PNG, and DOCX files are allowed'
    ),
  category: z.enum([
    'referral', 'assessment', 'consent_form',
    'progress_report', 'invoice', 'other'
  ]),
  clientId: z.string().optional(),
  therapistId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isConfidential: z.boolean().default(false),
})

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>
```

### `renameDocument.schema.ts`
```ts
export const renameDocumentSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(120, 'Name too long')
    .refine((n) => !n.includes('/'), 'Name cannot contain slashes'),
})

export type RenameDocumentInput = z.infer<typeof renameDocumentSchema>
```

---

## Section 1 — Page Header

### `DocumentsHeader.tsx`
```tsx
<PageHeader
  title="Documents"
  rightContent={
    <div className="flex items-center gap-2">
      {/* Shown only when items are selected */}
      {selectedIds.size > 0 && (
        <Button variant="outline" onClick={handleBulkDownload} disabled={isBulkDownloading}>
          {isBulkDownloading
            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            : <Archive className="mr-2 h-4 w-4" />
          }
          Download ZIP ({selectedIds.size})
        </Button>
      )}
      <Button className="bg-[#4acf7f] text-white" onClick={openUploadModal}>
        <Upload className="mr-2 h-4 w-4" />
        Upload Documents
      </Button>
    </div>
  }
/>
```

---

## Section 2 — Filter Bar

### `DocumentsFilterBar.tsx` — `'use client'`
All filters sync to URL search params on change (debounced where appropriate).

```tsx
<div className="flex flex-wrap items-center gap-3">

  {/* Search */}
  <Input
    placeholder="Search by name or client..."
    className="w-64"
    // debounced 300ms → updates ?search= param
  />

  {/* Category */}
  <Select
    placeholder="All Categories"
    options={DOCUMENT_CATEGORIES}
    // maps to ?category= param
  />

  {/* Client */}
  <Combobox
    placeholder="All Clients"
    searchable
    // maps to ?clientId= param
  />

  {/* Therapist */}
  <Select
    placeholder="All Therapists"
    options={therapists}
    // maps to ?therapistId= param
  />

  {/* File Type */}
  <Select
    placeholder="All Types"
    options={[
      { label: 'PDF', value: 'pdf' },
      { label: 'Image (JPG/PNG)', value: 'image' },
      { label: 'Word (DOCX)', value: 'docx' },
    ]}
    // maps to ?fileType= param
  />

  {/* Date uploaded */}
  <DateRangePicker
    placeholder="Upload date"
    // maps to ?from= and ?to= params
  />

  {/* Sort */}
  <Select
    placeholder="Sort by"
    options={[
      { label: 'Newest first', value: 'uploadedAt_desc' },
      { label: 'Oldest first', value: 'uploadedAt_asc' },
      { label: 'Name A–Z', value: 'name_asc' },
      { label: 'Largest first', value: 'fileSize_desc' },
      { label: 'Client name', value: 'clientName_asc' },
    ]}
  />

  <Button variant="ghost" onClick={clearFilters}>
    <X className="mr-2 h-4 w-4" />
    Clear
  </Button>

</div>
```

---

## Section 3 — View Toggle

### `DocumentsViewToggle.tsx` — `'use client'`
```tsx
// Synced with Zustand viewMode + URL ?view= param
<div className="flex border rounded-lg overflow-hidden">
  <button
    className={cn('p-2', viewMode === 'grid' ? 'bg-[#4acf7f] text-white' : 'text-muted-foreground')}
    onClick={() => setViewMode('grid')}
  >
    <LayoutGrid className="h-4 w-4" />
  </button>
  <button
    className={cn('p-2', viewMode === 'list' ? 'bg-[#4acf7f] text-white' : 'text-muted-foreground')}
    onClick={() => setViewMode('list')}
  >
    <List className="h-4 w-4" />
  </button>
</div>
```

---

## Section 4 — Upload Zone

### `DocumentUploadZone.tsx` — `'use client'`
Always visible at the top of the document library. Compact, collapsible.

```tsx
// Uses react-dropzone under the hood
<div
  {...getRootProps()}
  className={cn(
    'border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer',
    isDragActive
      ? 'border-[#4acf7f] bg-[#f0fdf4]'
      : 'border-muted-foreground/30 hover:border-[#4acf7f] hover:bg-[#f0fdf4]'
  )}
>
  <input {...getInputProps()} />
  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
  <p className="text-sm font-medium">
    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
  </p>
  <p className="text-xs text-muted-foreground mt-1">
    PDF, JPG, PNG, DOCX — max 20MB per file
  </p>
  <Button variant="outline" size="sm" className="mt-3">
    Browse Files
  </Button>
</div>
```

**On drop / file select:**
- Opens `DocumentUploadModal` with files pre-loaded
- Does NOT auto-upload — user must fill category + client + confirm

**Upload progress (shown after modal submit):**
```tsx
// Floating progress panel bottom-right while uploading
<div className="fixed bottom-4 right-4 w-72 rounded-xl bg-white shadow-lg border p-4 space-y-3">
  <p className="text-sm font-medium">Uploading {count} files...</p>
  {uploads.map((upload) => (
    <div key={upload.fileId}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs truncate">{upload.fileName}</span>
        <span className="text-xs text-muted-foreground">{upload.progress}%</span>
      </div>
      <Progress value={upload.progress} className="h-1" />
      {upload.status === 'error' && (
        <p className="text-xs text-destructive mt-1">{upload.error}</p>
      )}
    </div>
  ))}
</div>
```

---

## Section 5 — Upload Modal

### `DocumentUploadModal.tsx` — `'use client'`
- shadcn `<Dialog>` controlled by `useDocumentStore`
- React Hook Form + `uploadDocumentSchema`
- Files passed from upload zone via Zustand or props

**Layout:**
```
Files to upload (read-only list):
  📄 referral-john.pdf     2.4 MB  ✓
  🖼 assessment-scan.jpg   1.1 MB  ✓
  ❌ huge-file.zip         55 MB   (rejected — too large)

─────────────────────────────────────

Category *        ← Select (required)
Assign to Client  ← Combobox (optional)
Assign to Therapist ← Select (optional)
Tags              ← Tag input (optional, freeform)
Confidential      ← Switch — "Restrict to admin only"

[Cancel]  [Upload X files]
```

**Submit behavior:**
- Calls `useUploadDocument()` for each file sequentially
- Shows floating progress panel during upload
- On all complete: `toast.success('X files uploaded')` + invalidate `DOCUMENT_KEYS.list`
- On partial failure: `toast.error('X of Y files failed')` with error details

---

## Section 6 — Grid View

### `DocumentsGrid.tsx` — `'use client'`
```tsx
// Responsive grid: 2 cols sm, 3 cols md, 4 cols lg, 5 cols xl
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  {documents.map((doc) => (
    <DocumentCard key={doc.id} document={doc} />
  ))}
</div>
```

### `DocumentCard.tsx` — CVA variant card
```tsx
interface DocumentCardProps {
  document: Document
}
```

**Card layout:**
```
┌──────────────────────────┐
│  [checkbox top-left]     │
│                          │
│  🔒  (if confidential)   │
│                          │
│  [FILE ICON or THUMB]    │
│     PDF / JPG / DOCX     │
│                          │
│  Document Name.pdf       │
│  John Smith · 2.4 MB     │
│  Jun 9, 2025             │
│                          │
│  [Assessment badge]      │
│                          │
│  [Preview][↓][···]       │
└──────────────────────────┘
```

**File icon by type:**
```ts
const fileIcons: Record<FileType, LucideIcon> = {
  pdf: FileText,
  jpg: Image,
  png: Image,
  docx: FileType,
}

const fileColors: Record<FileType, string> = {
  pdf: 'text-red-500 bg-red-50',
  jpg: 'text-blue-500 bg-blue-50',
  png: 'text-blue-500 bg-blue-50',
  docx: 'text-indigo-500 bg-indigo-50',
}
```

**Card hover:** `hover:shadow-md hover:border-[#4acf7f]/30` transition

**Card actions (bottom row):**
- **Preview** eye icon → `openPreviewModal(doc.id)`
- **Download** arrow icon → `useDownloadDocument(doc.id)`
- **More** `<DropdownMenu>`:
  - Rename → `openRenameModal(doc.id)`
  - Toggle Confidential → `useToggleConfidential(doc.id)` (Admin only via `<AccessControl>`)
  - View Audit Log → `openAuditModal(doc.id)` (Admin only)
  - Delete → `<AlertDialog>` confirmation

**Checkbox selection:**
- Shown on hover or when any doc is selected
- `toggleSelect(doc.id)` → updates Zustand `selectedIds`
- Selected state: card border `border-[#4acf7f]` + light green bg

---

## Section 7 — List View

### `DocumentsTable.tsx` — `'use client'`
TanStack Table + shadcn `<Table>` + `DataTable<Document>`

**Column definitions (colocated):**
| Column | Render |
|---|---|
| Select | `<Checkbox>` — syncs with Zustand `selectedIds` |
| Name | file icon + document name + confidential lock icon |
| Category | `<DocumentCategoryBadge>` |
| Client | avatar + client name (link to client page) |
| Therapist | avatar + therapist name |
| File Type | uppercase badge — PDF / JPG / DOCX |
| File Size | formatted — `2.4 MB` |
| Uploaded By | uploader name |
| Uploaded At | formatted date |
| Actions | Preview / Download / `<DropdownMenu>` |

**Features:**
- Sortable columns: name, uploadedAt, fileSize, clientName
- Alternating rows: `even:bg-muted/30`
- Row hover: `hover:bg-[#f0fdf4]`
- Click row → opens preview modal
- Skeleton: 8 rows during loading
- Header checkbox: select all on current page

---

## Section 8 — Bulk Actions Bar

### `BulkActionsBar.tsx` — `'use client'`
Shown as a sticky bar at the bottom when `selectedIds.size > 0`:

```tsx
<div className="fixed bottom-0 left-64 right-0 z-50 border-t bg-white px-6 py-3
  flex items-center justify-between animate-in slide-in-from-bottom">
  <div className="flex items-center gap-3">
    <Button variant="ghost" size="sm" onClick={clearSelection}>
      <X className="mr-2 h-4 w-4" />
      Deselect all
    </Button>
    <span className="text-sm text-muted-foreground">
      {selectedIds.size} document{selectedIds.size > 1 ? 's' : ''} selected
    </span>
  </div>
  <div className="flex items-center gap-2">
    <Button variant="outline" onClick={handleBulkDownload} disabled={isBulkDownloading}>
      {isBulkDownloading
        ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        : <Archive className="mr-2 h-4 w-4" />
      }
      Download as ZIP
    </Button>
    <Button variant="destructive" onClick={handleBulkDelete}>
      <Trash2 className="mr-2 h-4 w-4" />
      Delete ({selectedIds.size})
    </Button>
  </div>
</div>
```

**Bulk delete:** `<AlertDialog>` — "Delete X documents? This cannot be undone."
**Bulk download:** `useBulkDownload(selectedIds)` → triggers ZIP download via blob

---

## Section 9 — Document Preview Modal

### `DocumentPreviewModal.tsx` — `'use client'`
- shadcn `<Dialog>` full-screen (`max-w-5xl`)
- Renders preview based on `fileType`

**PDF preview:**
```tsx
// Embed PDF in iframe using signed URL
<iframe
  src={document.fileUrl}
  className="w-full h-[70vh] rounded-lg border"
  title={document.name}
/>
```

**Image preview:**
```tsx
// Next.js <Image> with object-contain
<div className="flex items-center justify-center h-[70vh] bg-muted rounded-lg">
  <Image
    src={document.fileUrl}
    alt={document.name}
    fill
    className="object-contain"
  />
</div>
```

**DOCX preview:**
```tsx
// DOCX cannot be previewed in browser — show placeholder
<div className="flex flex-col items-center justify-center h-[70vh] gap-4">
  <FileType className="h-16 w-16 text-indigo-500" />
  <p className="text-muted-foreground">Word documents cannot be previewed in browser</p>
  <Button onClick={() => downloadDocument(document.id)}>
    <Download className="mr-2 h-4 w-4" />
    Download to view
  </Button>
</div>
```

**Modal header:**
```tsx
<DialogHeader>
  <div className="flex items-center justify-between">
    <div>
      <DialogTitle>{document.name}</DialogTitle>
      <p className="text-sm text-muted-foreground mt-1">
        {document.client?.fullName ?? 'No client'} · {formatFileSize(document.fileSize)} · {document.fileType.toUpperCase()}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleRename}>
        <Pencil className="mr-2 h-4 w-4" />
        Rename
      </Button>
      <Button size="sm" className="bg-[#4acf7f] text-white" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
    </div>
  </div>
</DialogHeader>
```

---

## Section 10 — Rename Modal

### `DocumentRenameModal.tsx` — `'use client'`
- shadcn `<Dialog>`
- React Hook Form + `renameDocumentSchema`

```tsx
<FormField name="name">
  <Input
    defaultValue={document.name}
    placeholder="Enter document name"
    autoFocus
  />
  <FormMessage />
</FormField>
```

- Submit: `useRenameDocument({ id, name })` mutation
- Success: `toast.success('Document renamed')` + invalidate `DOCUMENT_KEYS.list`
- Error: `toast.error(message)`

---

## Section 11 — Audit Log Modal

### `DocumentAuditModal.tsx` — `'use client'`
Admin-only via `<AccessControl allowedRoles={['admin']}>`.

- shadcn `<Dialog>` (`max-w-lg`)
- Fetches `useDocumentAuditLog(documentId)`

**Header:** Document name + "Audit Log" subtitle

**Audit entries list (chronological, newest first):**
```tsx
{auditLog.map((entry) => (
  <div key={entry.id} className="flex items-start gap-3 py-3 border-b last:border-0">
    <Avatar src={entry.performedByAvatar} size="sm" />
    <div className="flex-1">
      <p className="text-sm">
        <span className="font-medium">{entry.performedByName}</span>
        {' '}{actionLabels[entry.action]}
        {/* e.g. "renamed this document from 'old.pdf' to 'new.pdf'" */}
        {entry.meta && (
          <span className="text-muted-foreground"> — {formatMeta(entry.action, entry.meta)}</span>
        )}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {formatRelative(entry.performedAt)}
      </p>
    </div>
    <AuditActionIcon action={entry.action} />
  </div>
))}
```

**Action labels:**
```ts
const actionLabels: Record<AuditLogEntry['action'], string> = {
  uploaded: 'uploaded this document',
  viewed: 'viewed this document',
  downloaded: 'downloaded this document',
  renamed: 'renamed this document',
  deleted: 'deleted this document',
  confidential_toggled: 'changed confidential status',
}
```

**Empty state:** "No audit activity yet"
**Skeleton:** 4 skeleton rows while loading

---

## API Module — `documents.api.ts`

```ts
export const documentsApi = {
  getAll: (filters: DocumentFilters) =>
    http.get<ResponseByPagination<Document>>('/documents', {
      params: buildParams(filters),
    }),

  upload: (formData: FormData) =>
    http.post<Document[]>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
        )
        // Update Zustand upload progress state
      },
    }),

  rename: (id: string, name: string) =>
    http.patch<Document>(`/documents/${id}/rename`, { name }),

  delete: (id: string) =>
    http.delete(`/documents/${id}`),

  deleteBulk: (ids: string[]) =>
    http.post('/documents/bulk-delete', { ids }),

  download: (id: string) =>
    http.get(`/documents/${id}/download`, { responseType: 'blob' }),

  downloadBulk: (ids: string[]) =>
    http.post('/documents/bulk-download', { ids }, { responseType: 'blob' }),

  toggleConfidential: (id: string, isConfidential: boolean) =>
    http.patch(`/documents/${id}/confidential`, { isConfidential }),

  getAuditLog: (id: string) =>
    http.get<AuditLogEntry[]>(`/documents/${id}/audit`),
}
```

---

## Loading States

- `loading.tsx`: skeleton grid (15 cards) or skeleton table (8 rows)
- Grid view: skeleton cards with `<Skeleton>` for icon, name, badge
- List view: skeleton rows per TanStack Table pattern
- Upload progress: floating panel with `<Progress>` per file
- Audit modal: 4 skeleton rows while fetching
- Combobox (client): spinner while fetching options

---

## Error Handling

- `error.tsx`: retry button + back to dashboard
- Upload validation: inline rejected file list in modal with reason per file
- File too large: shown in upload zone as red chip with size
- Wrong file type: shown in upload zone as red chip with type info
- Bulk delete `<AlertDialog>`: lists count + "This cannot be undone"
- Rename `<FormMessage>`: inline Zod error under input
- Download failure: `toast.error('Download failed — please try again')`
- Audit log fetch error: inline error state inside modal with retry

---

## Access & Security Rules

```tsx
// Confidential documents — hidden from non-admin roles in list
// Filtered server-side based on user role

// Toggle confidential button — admin only
<AccessControl allowedRoles={['admin']}>
  <DropdownMenuItem onClick={handleToggleConfidential}>
    {doc.isConfidential ? <Unlock /> : <Lock />}
    {doc.isConfidential ? 'Remove confidential' : 'Mark as confidential'}
  </DropdownMenuItem>
</AccessControl>

// Audit log — admin only
<AccessControl allowedRoles={['admin']}>
  <DropdownMenuItem onClick={() => openAuditModal(doc.id)}>
    <ClipboardList className="mr-2 h-4 w-4" />
    View audit log
  </DropdownMenuItem>
</AccessControl>

// Therapist role: sees only documents linked to their own clients
// Filtered server-side in API — not just hidden in UI
```

---

## Key Principles Applied

- `page.tsx` is a Server Component — reads `searchParams`, fetches initial documents
- All filters + view mode + pagination in URL — fully bookmarkable library
- Upload zone never auto-uploads — always routes through modal for category + client assignment
- Bulk actions managed via Zustand `selectedIds` Set — efficient toggle without re-renders
- Download triggers blob response + browser save — no separate download route needed
- Confidential flag filtered server-side — not just hidden in UI (security by default)
- Audit log fetched lazily — only when modal is opened (`enabled: isAuditModalOpen`)
- Domain hooks wrap all mutations — no direct API calls from components
- All user-facing strings use i18n translation keys
