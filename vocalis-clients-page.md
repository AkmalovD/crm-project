# Vocalis — Clients Page Implementation Prompt

## Stack Reference (from .cursorrules)
- **Framework**: Next.js App Router + TypeScript
- **UI**: Tailwind CSS + shadcn/ui (new-york) + CVA
- **State**: TanStack React Query (server state) + Zustand (UI state)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table
- **Icons**: Lucide React
- **Toasts**: Sonner

---

## Route & File Structure

```
src/
└── app/
    └── (dashboard)/
        └── clients/
            ├── page.tsx                      ← Server Component, list view
            ├── loading.tsx                   ← Skeleton loading
            ├── error.tsx                     ← Error boundary
            ├── [id]/
            │   ├── page.tsx                  ← Client detail/profile page
            │   ├── loading.tsx
            │   └── _components/
            │       ├── ClientProfileHeader.tsx
            │       ├── ClientMedicalInfo.tsx
            │       ├── ClientAppointments.tsx
            │       ├── ClientProgressGoals.tsx
            │       ├── ClientBilling.tsx
            │       ├── ClientDocuments.tsx
            │       └── ClientNotes.tsx
            └── _components/
                ├── ClientsHeader.tsx
                ├── ClientsFilterBar.tsx
                ├── ClientsTable.tsx
                └── ClientStatusBadge.tsx

src/
├── features/
│   └── clients/
│       ├── api/
│       │   └── clients.api.ts
│       ├── hooks/
│       │   ├── useClients.ts
│       │   ├── useClient.ts
│       │   ├── useCreateClient.ts
│       │   ├── useUpdateClient.ts
│       │   ├── useDeleteClient.ts
│       │   └── useClientFilters.ts
│       ├── types/
│       │   └── clients.types.ts
│       └── validators/
│           ├── createClient.schema.ts
│           └── updateClient.schema.ts
└── store/
    └── useClientStore.ts             ← Zustand: modal state, selected client
```

---

## Page Architecture

### `page.tsx` — Server Component
```tsx
// Reads searchParams for filters/pagination
// Passes as initialData to React Query for instant render
export default async function ClientsPage({ searchParams }) {
  const filters = parseClientFilters(searchParams)
  const initialData = await fetchClients(filters)
  return <ClientsClientShell initialData={initialData} filters={filters} />
}
```

### Component Rendering Order (List Page)
```
PageHeader (title "Clients" + total count badge + "Add Client" button)
  └── ClientsFilterBar (search + status filter + therapist filter + sort)
      └── ClientsTable (TanStack Table + shadcn Table)
          └── Pagination (URL search params synced)
```

### Component Rendering Order (Detail Page)
```
PageHeader (back button + client name + status badge + action buttons)
  └── ClientProfileTabs
      ├── Overview
      │   ├── ClientProfileHeader (avatar, name, key info)
      │   └── ClientMedicalInfo (diagnosis, history, assigned therapist)
      ├── Appointments (upcoming + past sessions)
      ├── Progress & Goals (goals list + progress charts)
      ├── Billing (invoices + payment history)
      ├── Documents (uploaded files)
      └── Notes (therapist + internal notes)
```

---

## State Management

### Zustand Store — `useClientStore.ts`
```ts
interface ClientStore {
  isCreateModalOpen: boolean
  isDeleteModalOpen: boolean
  selectedClientId: string | null
  openCreateModal: () => void
  closeCreateModal: () => void
  openDeleteModal: (id: string) => void
  closeDeleteModal: () => void
}
```

### React Query Hooks
```ts
// List with filters + pagination
useClients(filters: ClientFilters)

// Single client detail
useClient(id: string)

// Mutations
useCreateClient()      // POST /clients
useUpdateClient()      // PATCH /clients/:id
useDeleteClient()      // DELETE /clients/:id

// Query key constants
export const CLIENT_KEYS = {
  all: ['clients'],
  list: (filters) => ['clients', 'list', filters],
  detail: (id) => ['clients', 'detail', id],
}
```

### URL Search Params (filter + pagination state)
```
?search=John&status=active&therapist=dr-smith&page=1&perPage=10&sortBy=name&sortDir=asc
```

---

## Types — `clients.types.ts`

```ts
export type ClientStatus = 'active' | 'inactive' | 'new' | 'discharged' | 'on_hold'

export type TherapyType = 'individual' | 'group' | 'online'

export interface Client {
  id: string
  // Personal
  firstName: string
  lastName: string
  fullName: string
  avatar: string | null
  dateOfBirth: string
  age: number
  gender: 'male' | 'female' | 'other'
  language: string
  // Contact
  phone: string
  email: string
  address: string
  // Guardian (for children)
  guardianName?: string
  guardianPhone?: string
  guardianRelation?: string
  // Medical
  primaryDiagnosis: string
  secondaryDiagnoses: string[]
  medicalHistory: string
  allergies: string[]
  // CRM
  assignedTherapistId: string
  assignedTherapist: Therapist
  therapyType: TherapyType
  treatmentStartDate: string
  referralSource: string
  clientCode: string
  status: ClientStatus
  tags: string[]
  // Meta
  createdAt: string
  updatedAt: string
  lastSessionDate: string | null
  totalSessions: number
}

export interface ClientFilters {
  search?: string
  status?: ClientStatus
  therapistId?: string
  therapyType?: TherapyType
  page: number
  perPage: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}
```

---

## Validators — `createClient.schema.ts`

```ts
export const createClientSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  phone: z.string().min(7, 'Valid phone required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  language: z.string().min(1, 'Language is required'),
  primaryDiagnosis: z.string().min(1, 'Diagnosis is required'),
  assignedTherapistId: z.string().min(1, 'Therapist is required'),
  therapyType: z.enum(['individual', 'group', 'online']),
  // Guardian — required if age < 18
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianRelation: z.string().optional(),
  referralSource: z.string().optional(),
})
.superRefine((data, ctx) => {
  const age = calculateAge(data.dateOfBirth)
  if (age < 18 && !data.guardianName) {
    ctx.addIssue({ path: ['guardianName'], message: 'Guardian required for minors', code: 'custom' })
  }
})

export const updateClientSchema = createClientSchema.partial()

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
```

---

## Section 1 — Clients List Page

### `ClientsHeader.tsx`
```tsx
<PageHeader
  title="Clients"
  rightContent={
    <>
      <Badge variant="secondary">{totalCount} clients</Badge>
      <Button onClick={openCreateModal} className="bg-[#4acf7f] text-white">
        <Plus className="mr-2 h-4 w-4" />
        Add Client
      </Button>
    </>
  }
/>
```

### `ClientsFilterBar.tsx` — `'use client'`
```tsx
// All filters sync to URL search params
<Input placeholder="Search by name, ID, phone..." />    // debounced 300ms
<Select placeholder="Status" options={CLIENT_STATUSES} />
<Select placeholder="Therapist" options={therapists} />  // fetched via useTherapists()
<Select placeholder="Therapy Type" options={THERAPY_TYPES} />
<Button variant="ghost">Clear Filters</Button>
<Button variant="outline">
  <Download className="mr-2 h-4 w-4" />
  Export CSV
</Button>
```

### `ClientsTable.tsx` — `'use client'`

**Column definitions:**
| Column | Render |
|---|---|
| Client | `<Avatar>` + full name + client code (muted) |
| Age / DOB | age number + DOB muted below |
| Diagnosis | primary diagnosis text, truncated |
| Therapist | therapist name + avatar |
| Therapy Type | `<Badge>` Individual / Group / Online |
| Last Session | formatted date or "No sessions yet" |
| Total Sessions | number |
| Status | `<ClientStatusBadge>` |
| Actions | `<DropdownMenu>` View / Edit / Delete |

**Features:**
- Row click → navigate to `/clients/[id]`
- Sortable columns: name, age, lastSession, totalSessions
- Bulk select checkboxes → bulk export or bulk assign therapist
- Alternating row: `even:bg-muted/30`
- Hover: `hover:bg-[#f0fdf4] cursor-pointer`
- Skeleton: 8 rows during loading
- Empty state: illustration + "No clients found" + "Add your first client" button

### `ClientStatusBadge.tsx` — CVA variant component
```ts
const statusVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    status: {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-600',
      new: 'bg-blue-100 text-blue-700',
      discharged: 'bg-purple-100 text-purple-700',
      on_hold: 'bg-yellow-100 text-yellow-700',
    }
  }
})
```

---

## Section 2 — Client Detail Page `/clients/[id]`

### `ClientProfileHeader.tsx`
- Large avatar (80px) + upload button on hover
- Full name `text-2xl font-bold`
- Client code badge + Status badge
- Key stats row: Age, Assigned Therapist, Start Date, Total Sessions
- Action buttons: "Book Session" (`#4acf7f`) | "Edit Profile" (outline) | `<DropdownMenu>` more actions

### Profile Tabs
```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="appointments">Appointments</TabsTrigger>
    <TabsTrigger value="progress">Progress & Goals</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
    <TabsTrigger value="notes">Notes</TabsTrigger>
  </TabsList>
</Tabs>
```

---

## Tab: Overview

### Left column (60%)
**Personal Information card:**
- Full name, DOB, age, gender, language
- Phone, email, address
- Emergency contact / guardian section (conditional — shown if age < 18)
- Edit button top right

**Medical Information card:**
- Primary diagnosis (highlighted)
- Secondary diagnoses list
- Medical history textarea (read-only, expandable)
- Allergies & contraindications tags
- Referral source

### Right column (40%)
**CRM Info card:**
- Assigned therapist (avatar + name + link)
- Therapy type badge
- Treatment start date
- Client tags (editable inline)
- Referral source

**Quick Stats card:**
- Total sessions, Completed, Cancelled
- Last session date
- Next upcoming session

---

## Tab: Appointments

- Upcoming sessions: card list (date, time, therapist, type, status badge)
- "Book New Session" button top right
- Past sessions: table with columns — Date, Therapist, Type, Duration, Status, Notes icon
- Filter: All / Upcoming / Completed / Cancelled
- Rescheduling history section (collapsible)

---

## Tab: Progress & Goals

### Goals List
```ts
interface TherapyGoal {
  id: string
  title: string
  description: string
  category: 'speech' | 'language' | 'fluency' | 'voice' | 'cognitive'
  targetDate: string
  progress: number       // 0-100
  status: 'active' | 'achieved' | 'paused'
  createdAt: string
}
```
- Each goal: title + category badge + `<Progress>` bar `#4acf7f` + percentage + status
- "Add Goal" button
- Achieved goals collapsible section

### Progress Chart
- Recharts `LineChart` — progress % over time per goal
- Filter by goal
- X axis: session dates

---

## Tab: Billing

### Summary row (3 mini cards):
- Total Invoiced | Total Paid | Outstanding Balance (red if > 0)

### Active Package card (if applicable):
- Package name, sessions remaining, expiry date, progress bar

### Invoices table:
| Column | Details |
|---|---|
| Invoice # | link to view |
| Date | formatted |
| Sessions | count |
| Amount | currency |
| Status | Paid (green) / Pending (yellow) / Overdue (red) |
| Actions | View PDF / Send reminder |

- "Generate Invoice" button top right
- Filter: All / Paid / Pending / Overdue

---

## Tab: Documents

- Upload button: drag & drop zone using `uploadthing`
- Documents grid (card per file):
  - File icon (PDF/image/doc)
  - File name
  - Upload date
  - Uploader name
  - Download + Delete buttons
- Filter by type: All / Referrals / Reports / Consent Forms / Other
- Empty state: upload illustration

---

## Tab: Notes

### Therapist Session Notes (visible to staff only)
- Chronological list, newest first
- Each note: session date + therapist avatar + note text + SOAP structure (optional)
- "Add Note" button → inline textarea

### Internal Staff Notes (not visible to client)
- Separate section with lock icon indicator
- Same structure as therapist notes
- Warning badge: "Not visible to client"

---

## Create Client Modal

### `CreateClientModal.tsx` — `'use client'`
- shadcn `<Dialog>` controlled by `useClientStore`
- Multi-section form using React Hook Form + Zod
- Sections (not wizard, single scrollable form):
  1. Personal Information
  2. Contact Details
  3. Guardian Information (conditional: shown if age < 18)
  4. Medical Information
  5. CRM Settings (therapist, therapy type)
- Submit: `useCreateClient()` mutation
- Success: `toast.success('Client added')` + invalidate `CLIENT_KEYS.list` + close modal
- Error: `toast.error(message)`

---

## API Module — `clients.api.ts`

```ts
export const clientsApi = {
  getAll: (filters: ClientFilters) =>
    http.get<ResponseByPagination<Client>>('/clients', { params: buildParams(filters) }),

  getById: (id: string) =>
    http.get<Client>(`/clients/${id}`),

  create: (data: CreateClientInput) =>
    http.post<Client>('/clients', data),

  update: (id: string, data: UpdateClientInput) =>
    http.patch<Client>(`/clients/${id}`, normalizeBodyValues(data)),

  delete: (id: string) =>
    http.delete(`/clients/${id}`),

  exportCsv: (filters: ClientFilters) =>
    http.get('/clients/export', { params: buildParams(filters), responseType: 'blob' }),
}
```

---

## Loading States

- List page: `loading.tsx` with skeleton table (8 rows)
- Detail page: skeleton for header + tab content
- Each tab: skeleton matching content structure
- Mutations: button spinner via `isPending` from `useMutation`

---

## Error Handling

- `error.tsx`: retry button + back to clients list link
- Form errors: `<FormMessage>` under each field via shadcn form composition
- Delete confirmation: `<AlertDialog>` with client name in message
- Mutation errors: `toast.error()` with server message fallback

---

## Key Principles Applied

- `'use client'` only on interactive components (table, filters, modals, forms)
- Server Component at page level for fast initial data load
- All filters in URL — client list is bookmarkable and shareable
- Domain hooks wrap all queries — no direct API calls in components
- Zod schemas in `validators/` — reused across create/edit forms and API validation
- Role-based visibility: internal notes hidden from client-role users via `<AccessControl>`
- i18n keys for all user-facing strings — no hardcoded text
