# Vocalis — Reports Page Implementation Prompt

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
        └── reports/
            ├── page.tsx                          ← Server Component
            ├── loading.tsx                       ← Skeleton loading
            ├── error.tsx                         ← Error boundary
            └── _components/
                ├── ReportsHeader.tsx
                ├── ReportsPageTabs.tsx
                ├── CustomReportBuilder.tsx
                ├── ComparisonReport.tsx
                ├── SavedReportsList.tsx
                ├── SavedReportCard.tsx
                ├── SaveReportModal.tsx
                ├── ShareReportModal.tsx
                ├── ReportHistoryList.tsx
                ├── ScheduledReportsList.tsx
                ├── CreateScheduleModal.tsx
                └── EditScheduleModal.tsx

src/
├── features/
│   └── reports/
│       ├── api/
│       │   └── reports.api.ts
│       ├── hooks/
│       │   ├── useSavedReports.ts
│       │   ├── useSaveReport.ts
│       │   ├── useDeleteSavedReport.ts
│       │   ├── useDuplicateSavedReport.ts
│       │   ├── useShareReport.ts
│       │   ├── useReportHistory.ts
│       │   ├── useScheduledReports.ts
│       │   ├── useCreateSchedule.ts
│       │   ├── useUpdateSchedule.ts
│       │   └── useDeleteSchedule.ts
│       ├── types/
│       │   └── reports.types.ts
│       └── validators/
│           ├── saveReport.schema.ts
│           ├── customReport.schema.ts
│           └── scheduleReport.schema.ts
└── store/
    └── useReportStore.ts         ← Zustand: active tab, modal states
```

---

## Page Architecture

### `page.tsx` — Server Component
```tsx
// Read active tab from searchParams
// Fetch initial data for default tab (saved reports)
export default async function ReportsPage({ searchParams }) {
  const tab = searchParams.tab ?? 'saved'
  const initialSaved = await fetchSavedReports()
  const initialSchedules = await fetchScheduledReports()

  return (
    <ReportsClientShell
      initialSaved={initialSaved}
      initialSchedules={initialSchedules}
      initialTab={tab}
    />
  )
}
```

### Component Rendering Order
```
PageHeader (title "Reports")
  └── ReportsPageTabs (Saved Reports | Custom Builder | Comparison | Schedules | History)
      ├── [saved]       → SavedReportsList
      ├── [builder]     → CustomReportBuilder
      ├── [comparison]  → ComparisonReport
      ├── [schedules]   → ScheduledReportsList
      └── [history]     → ReportHistoryList
```

---

## State Management

### Zustand Store — `useReportStore.ts`
```ts
interface ReportStore {
  activeTab: ReportPageTab
  setActiveTab: (tab: ReportPageTab) => void

  isSaveModalOpen: boolean
  isShareModalOpen: boolean
  isCreateScheduleModalOpen: boolean
  isEditScheduleModalOpen: boolean
  selectedSavedReportId: string | null
  selectedScheduleId: string | null

  openSaveModal: () => void
  closeSaveModal: () => void
  openShareModal: (reportId: string) => void
  closeShareModal: () => void
  openCreateScheduleModal: () => void
  closeCreateScheduleModal: () => void
  openEditScheduleModal: (scheduleId: string) => void
  closeEditScheduleModal: () => void
}
```

### React Query Hooks
```ts
useSavedReports()
useReportHistory(filters)
useScheduledReports()

// Mutations
useSaveReport()
useDeleteSavedReport()
useDuplicateSavedReport()
useShareReport()
useCreateSchedule()
useUpdateSchedule()
useDeleteSchedule()
useToggleSchedule()

// Query key constants
export const REPORT_KEYS = {
  saved: ['reports', 'saved'],
  history: ['reports', 'history'],
  schedules: ['reports', 'schedules'],
}
```

### URL Search Params
```
?tab=schedules
// Active tab persisted in URL — page state is bookmarkable
```

---

## Types — `reports.types.ts`

```ts
export type ReportPageTab = 'saved' | 'builder' | 'comparison' | 'schedules' | 'history'

export type ReportType =
  | 'sessions'
  | 'revenue'
  | 'clients'
  | 'therapists'
  | 'cancellations'
  | 'goals'

export type ExportFormat = 'pdf' | 'excel' | 'csv'

export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly'

export type ReportMetric =
  | 'totalSessions'
  | 'completedSessions'
  | 'cancelledSessions'
  | 'noShowSessions'
  | 'totalRevenue'
  | 'avgRevenue'
  | 'totalClients'
  | 'newClients'
  | 'returningClients'
  | 'retentionRate'
  | 'avgSessionDuration'
  | 'completionRate'

export interface ReportFilters {
  type: ReportType
  from: string
  to: string
  therapistId?: string
  clientId?: string
  sessionType?: string
  status?: string
}

export interface SavedReport {
  id: string
  name: string
  type: ReportType
  filters: ReportFilters
  metrics: ReportMetric[]
  isPinned: boolean
  shareToken: string | null
  createdAt: string
  createdBy: string
}

export interface ReportHistoryEntry {
  id: string
  type: ReportType
  filters: ReportFilters
  generatedAt: string
  generatedBy: string
  exportFormat: ExportFormat | null
  fileUrl: string | null
}

export interface ScheduledReport {
  id: string
  name: string
  type: ReportType
  filters: ReportFilters
  frequency: ScheduleFrequency
  recipients: string[]
  exportFormat: ExportFormat
  nextRunAt: string
  lastRunAt: string | null
  isEnabled: boolean
  createdAt: string
  createdBy: string
}

export interface ComparisonPeriod {
  label: string
  from: string
  to: string
}
```

---

## Validators

### `saveReport.schema.ts`
```ts
export const saveReportSchema = z.object({
  name: z.string().min(2, 'Name is required').max(80),
  type: z.enum(['sessions', 'revenue', 'clients', 'therapists', 'cancellations', 'goals']),
  filters: z.object({
    from: z.string().min(1),
    to: z.string().min(1),
    therapistId: z.string().optional(),
    clientId: z.string().optional(),
    sessionType: z.string().optional(),
    status: z.string().optional(),
  }),
  metrics: z.array(z.string()).min(1, 'Select at least one metric'),
})

export type SaveReportInput = z.infer<typeof saveReportSchema>
```

### `customReport.schema.ts`
```ts
export const customReportSchema = z.object({
  type: z.enum(['sessions', 'revenue', 'clients', 'therapists', 'cancellations', 'goals']),
  from: z.string().min(1, 'Start date required'),
  to: z.string().min(1, 'End date required'),
  therapistId: z.string().optional(),
  clientId: z.string().optional(),
  sessionType: z.string().optional(),
  status: z.string().optional(),
  metrics: z.array(z.string()).min(1, 'Select at least one metric'),
  groupBy: z.enum(['day', 'week', 'month']).default('month'),
})
.refine((d) => new Date(d.from) <= new Date(d.to), {
  message: 'Start date must be before end date',
  path: ['from'],
})

export type CustomReportInput = z.infer<typeof customReportSchema>
```

### `scheduleReport.schema.ts`
```ts
export const scheduleReportSchema = z.object({
  name: z.string().min(2, 'Schedule name is required').max(80),
  type: z.enum(['sessions', 'revenue', 'clients', 'therapists', 'cancellations', 'goals']),
  filters: z.object({
    relativePeriod: z.enum(['last_week', 'last_month', 'last_quarter', 'last_year']),
    therapistId: z.string().optional(),
  }),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  recipients: z
    .array(z.string().email('Invalid email'))
    .min(1, 'At least one recipient required'),
  exportFormat: z.enum(['pdf', 'excel', 'csv']),
})

export type ScheduleReportInput = z.infer<typeof scheduleReportSchema>
```

---

## Section 1 — Page Header

### `ReportsHeader.tsx`
```tsx
<PageHeader
  title="Reports"
  rightContent={
    <Badge variant="outline" className="text-muted-foreground">
      <Clock className="mr-1 h-3 w-3" />
      {scheduledCount} active schedules
    </Badge>
  }
/>
```

---

## Section 2 — Page Tabs

### `ReportsPageTabs.tsx` — `'use client'`
```tsx
// Synced with ?tab= URL param + Zustand activeTab
<Tabs value={activeTab} onValueChange={handleTabChange}>
  <TabsList>
    <TabsTrigger value="saved">
      <Bookmark className="mr-2 h-4 w-4" />
      Saved Reports
      {savedCount > 0 && <Badge className="ml-2">{savedCount}</Badge>}
    </TabsTrigger>
    <TabsTrigger value="builder">
      <Settings2 className="mr-2 h-4 w-4" />
      Custom Builder
    </TabsTrigger>
    <TabsTrigger value="comparison">
      <GitCompare className="mr-2 h-4 w-4" />
      Comparison
    </TabsTrigger>
    <TabsTrigger value="schedules">
      <CalendarClock className="mr-2 h-4 w-4" />
      Schedules
      {scheduledCount > 0 && <Badge className="ml-2">{scheduledCount}</Badge>}
    </TabsTrigger>
    <TabsTrigger value="history">
      <History className="mr-2 h-4 w-4" />
      History
    </TabsTrigger>
  </TabsList>
</Tabs>
```

---

## Section 3 — Saved Reports Tab

### `SavedReportsList.tsx` — `'use client'`

**Header row:**
```tsx
<div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-2">
    <Input placeholder="Search saved reports..." className="w-64" />
    <Select placeholder="Filter by type" options={REPORT_TYPES} />
  </div>
  <Button className="bg-[#4acf7f] text-white" onClick={openSaveModal}>
    <Plus className="mr-2 h-4 w-4" />
    New Saved Report
  </Button>
</div>
```

**Pinned section** (if any pinned):
```
📌 Pinned
[SavedReportCard] [SavedReportCard]
```

**All reports grid:**
```
All Reports (12)
[SavedReportCard] [SavedReportCard] [SavedReportCard]
[SavedReportCard] [SavedReportCard] [SavedReportCard]
```

### `SavedReportCard.tsx`
```tsx
interface SavedReportCardProps {
  report: SavedReport
}
```

**Card layout:**
```
┌─────────────────────────────────────┐
│ [ReportType badge]    [Pin] [More ▾]│
│                                     │
│ Report Name (bold, lg)              │
│ Jan 2025 – Dec 2025 (muted)         │
│                                     │
│ Therapist: All    Status: Completed │
│                                     │
│ Metrics: Sessions, Revenue, +2 more │
│                                     │
│ Created by Avatar · Jun 9           │
│                                     │
│ [Run Report]  [Share]  [Duplicate]  │
└─────────────────────────────────────┘
```

**Card actions:**
- **Pin / Unpin** — toggle `isPinned` via `useUpdateSavedReport()`
- **Run Report** — navigates to Analytics page with filters pre-applied via URL params
- **Share** — opens `ShareReportModal`
- **Duplicate** — `useDuplicateSavedReport()` → `toast.success('Report duplicated')` → invalidate `REPORT_KEYS.saved`
- **Delete** — `<AlertDialog>` confirmation → `useDeleteSavedReport()`

**More `<DropdownMenu>`:**
- Edit name
- Duplicate
- Share link
- Delete

**Empty state:** illustration + "No saved reports yet" + "Create your first saved report" button

---

## Section 4 — Save Report Modal

### `SaveReportModal.tsx` — `'use client'`
- shadcn `<Dialog>` controlled by `useReportStore`
- React Hook Form + `saveReportSchema`

**Form fields:**
```
Report Name       ← text input

Report Type       ← Select: Sessions / Revenue / Clients /
                    Therapists / Cancellations / Goals

Date Range        ← DateRangePicker with presets:
                    This Month / Last Month / This Quarter / This Year

Therapist         ← Select (optional)
Client            ← Combobox (optional)
Session Type      ← Select (optional)
Status            ← Select (optional)

── Metrics ───────────────────────────
(checkboxes shown based on selected Report Type)

Sessions type shows:
  ☑ Total Sessions
  ☑ Completed
  ☐ Cancelled
  ☑ No-show
  ☐ Avg Duration
  ☑ Completion Rate

Revenue type shows:
  ☑ Total Revenue
  ☑ Avg per Session
  ☐ Revenue by Service
  ☑ Revenue Growth
```

**Submit:**
- `useSaveReport()` mutation
- Success: `toast.success('Report saved')` + invalidate `REPORT_KEYS.saved` + close modal
- Error: `toast.error(message)`

---

## Section 5 — Share Report Modal

### `ShareReportModal.tsx` — `'use client'`
- shadcn `<Dialog>`
- Generates a shareable link for the report config

```tsx
// Share link row
<div className="flex items-center gap-2">
  <Input
    readOnly
    value={`${baseUrl}/reports/shared/${report.shareToken}`}
    className="font-mono text-sm"
  />
  <Button variant="outline" size="icon" onClick={copyToClipboard}>
    <Copy className="h-4 w-4" />
  </Button>
</div>

// Copy feedback
{copied && (
  <p className="text-sm text-[#4acf7f]">
    <Check className="inline mr-1 h-3 w-3" />
    Link copied to clipboard
  </p>
)}

// Info note
<p className="text-sm text-muted-foreground">
  Recipients must be logged in to view data.
  This link shares configuration only, not raw data.
</p>

// Revoke link
<Button variant="ghost" size="sm" className="text-destructive">
  <Trash2 className="mr-2 h-3 w-3" />
  Revoke link
</Button>
```

- `useShareReport()` generates token on first open if `shareToken === null`
- Revoke: sets `shareToken = null` via `useUpdateSavedReport()`
- Revoke triggers `<AlertDialog>` — "Anyone with the current link will lose access"

---

## Section 6 — Custom Report Builder Tab

### `CustomReportBuilder.tsx` — `'use client'`
Two-column layout: left config panel + right live preview.

**Left panel (form, `w-96`):**
```
Report Type       ← Select
Date Range        ← DateRangePicker
Group By          ← Select: Day / Week / Month
Therapist         ← Select (optional)
Client            ← Combobox (optional)
Session Type      ← Select (optional)
Status            ← Select (optional)

── Select Metrics ────────────────────
(checkboxes change based on Report Type)
[metric checkboxes list]

[Run Report ▶]   [Save Report 🔖]
```

**Right panel (preview):**
- Shows skeleton placeholder until "Run Report" is clicked
- After run: summary row + Recharts chart + data table
- "Save Report" pre-fills `SaveReportModal` with current form values

**State:** `useState` for form values + `useQuery` triggered on Run click — no URL persistence (transient builder state)

**Metrics per type:**
```ts
const metricsByType: Record<ReportType, ReportMetric[]> = {
  sessions: ['totalSessions', 'completedSessions', 'cancelledSessions', 'noShowSessions', 'avgSessionDuration', 'completionRate'],
  revenue: ['totalRevenue', 'avgRevenue'],
  clients: ['totalClients', 'newClients', 'returningClients', 'retentionRate'],
  therapists: ['totalSessions', 'completionRate', 'totalRevenue', 'avgSessionDuration'],
  cancellations: ['cancelledSessions', 'noShowSessions'],
  goals: ['completionRate'],
}
```

---

## Section 7 — Comparison Report Tab

### `ComparisonReport.tsx` — `'use client'`
Side-by-side comparison of two custom periods.

**Period selector:**
```tsx
<div className="grid grid-cols-2 gap-6 mb-6">
  <div className="rounded-xl border p-4">
    <p className="text-sm font-medium mb-2">Period A</p>
    <DateRangePicker value={periodA} onChange={setPeriodA} />
    <Input placeholder='Label e.g. "Q1 2025"' className="mt-2" />
  </div>
  <div className="rounded-xl border p-4">
    <p className="text-sm font-medium mb-2">Period B</p>
    <DateRangePicker value={periodB} onChange={setPeriodB} />
    <Input placeholder='Label e.g. "Q1 2024"' className="mt-2" />
  </div>
</div>

<div className="flex gap-3 mb-6">
  <Select placeholder="Report Type" />
  <Select placeholder="Therapist (optional)" />
  <Button className="bg-[#4acf7f] text-white">Compare</Button>
</div>
```

**Comparison results table:**
```
┌──────────────────────────────────────────────────────┐
│ Metric               │ Period A  │ Period B │  Diff  │
│──────────────────────────────────────────────────────│
│ Total Sessions       │  1,284    │  1,102   │ +16.5% │
│ Completed            │  1,140    │   980    │ +16.3% │
│ Revenue              │ $24,500   │ $19,800  │ +23.7% │
│ Completion Rate      │   88%     │   89%    │  -1.1% │
│ Avg Session Duration │  48 min   │  45 min  │  +6.7% │
└──────────────────────────────────────────────────────┘
```

- Diff column: green if positive, red if negative + arrow icon
- Recharts `BarChart` grouped below table: Period A (`#a5b4fc`) vs Period B (`#4acf7f`)
- Export button top right: exports comparison as PDF / Excel

**State:** `useState` for periodA, periodB, type — transient, no URL persistence needed

---

## Section 8 — Scheduled Reports Tab

### `ScheduledReportsList.tsx` — `'use client'`

**Header:**
```tsx
<div className="flex items-center justify-between mb-4">
  <p className="text-sm text-muted-foreground">
    {enabledCount} of {totalCount} schedules active
  </p>
  <Button className="bg-[#4acf7f] text-white" onClick={openCreateScheduleModal}>
    <Plus className="mr-2 h-4 w-4" />
    New Schedule
  </Button>
</div>
```

**Schedule card:**
```
┌─────────────────────────────────────────────┐
│ [Switch]  Schedule Name            [More ▾] │
│                                             │
│ Type: Revenue Report                        │
│ Frequency: Monthly — every 1st of month     │
│ Format: PDF                                 │
│ Recipients: admin@clinic.com, +2 more       │
│                                             │
│ Next run: Jul 1, 2025  Last run: Jun 1      │
└─────────────────────────────────────────────┘
```

**Toggle (`<Switch>`):**
- `useToggleSchedule()` mutation
- Enabled: green, "Active" label
- Disabled: gray, "Paused" label
- `isPending`: disabled with spinner

**More `<DropdownMenu>`:**
- Edit schedule → opens `EditScheduleModal`
- Run now → `useRunScheduleNow()` + `toast.success('Report sent')`
- Delete → `<AlertDialog>` — "This will stop all future automated emails"

**Empty state:** "No scheduled reports yet" + "Set up your first schedule" button

---

## Section 9 — Create / Edit Schedule Modals

### `CreateScheduleModal.tsx` — `'use client'`
- shadcn `<Dialog>` controlled by `useReportStore`
- React Hook Form + `scheduleReportSchema`

**Form fields:**
```
Schedule Name     ← text input

Report Type       ← Select

Relative Period   ← Select (relative dates only — not absolute):
                    Last Week / Last Month / Last Quarter / Last Year

Therapist         ← Select (optional)

Frequency         ← Radio group:
                    ○ Daily   ○ Weekly   ○ Monthly

Export Format     ← Radio group:
                    ○ PDF   ○ Excel   ○ CSV

Recipients        ← Tag input (email chips)
                    Press Enter or comma to add
                    Each email validated on add
                    Shows chips with × remove button
```

**Submit:**
- `useCreateSchedule()` mutation
- Success: `toast.success('Schedule created')` + invalidate `REPORT_KEYS.schedules` + close modal

### `EditScheduleModal.tsx` — `'use client'`
- Same form pre-filled with existing schedule data
- Uses `useUpdateSchedule()` mutation
- `scheduleReportSchema.partial()` for validation

---

## Section 10 — Report History Tab

### `ReportHistoryList.tsx` — `'use client'`

**Filter bar:**
```tsx
<div className="flex gap-3 mb-4">
  <Select placeholder="All Types" options={REPORT_TYPES} />
  <Select placeholder="All Formats" options={EXPORT_FORMATS} />
  <DateRangePicker placeholder="Filter by date" />
  <Button variant="ghost" onClick={clearFilters}>
    <X className="mr-2 h-4 w-4" />
    Clear
  </Button>
</div>
```

**TanStack Table columns:**
| Column | Details |
|---|---|
| Generated At | formatted date + time |
| Report Type | `<Badge>` with color per type |
| Period | from – to range (muted) |
| Generated By | avatar + name |
| Export Format | PDF / Excel / CSV badge or `—` if only viewed |
| Actions | Download + Re-run |

**Row actions:**
- **Download**: shown only if `fileUrl !== null` — triggers blob download
- **Re-run**: switches to Custom Builder tab with same filters pre-filled

**Pagination:** URL search params `?historyPage=1&historyPerPage=20`

**Empty state:** "No report history yet — run your first report from Custom Builder"

---

## API Module — `reports.api.ts`

```ts
export const reportsApi = {
  // Saved reports
  getSaved: () =>
    http.get<SavedReport[]>('/reports/saved'),

  save: (data: SaveReportInput) =>
    http.post<SavedReport>('/reports/saved', data),

  updateSaved: (id: string, data: Partial<SaveReportInput & { isPinned: boolean; shareToken: null }>) =>
    http.patch<SavedReport>(`/reports/saved/${id}`, data),

  deleteSaved: (id: string) =>
    http.delete(`/reports/saved/${id}`),

  duplicateSaved: (id: string) =>
    http.post<SavedReport>(`/reports/saved/${id}/duplicate`),

  shareReport: (id: string) =>
    http.post<{ shareToken: string }>(`/reports/saved/${id}/share`),

  // History
  getHistory: (filters?: HistoryFilters) =>
    http.get<ResponseByPagination<ReportHistoryEntry>>('/reports/history', {
      params: buildParams(filters),
    }),

  // Schedules
  getSchedules: () =>
    http.get<ScheduledReport[]>('/reports/schedules'),

  createSchedule: (data: ScheduleReportInput) =>
    http.post<ScheduledReport>('/reports/schedules', data),

  updateSchedule: (id: string, data: Partial<ScheduleReportInput>) =>
    http.patch<ScheduledReport>(`/reports/schedules/${id}`, normalizeBodyValues(data)),

  toggleSchedule: (id: string, isEnabled: boolean) =>
    http.patch(`/reports/schedules/${id}/toggle`, { isEnabled }),

  deleteSchedule: (id: string) =>
    http.delete(`/reports/schedules/${id}`),

  runScheduleNow: (id: string) =>
    http.post(`/reports/schedules/${id}/run`),
}
```

---

## Loading States

- `loading.tsx`: skeleton tabs + card grid
- Saved reports tab: 6 skeleton cards in grid
- Schedules tab: 3 skeleton schedule cards
- History tab: 8 skeleton table rows
- Custom builder preview: `<Skeleton className="h-64 w-full rounded-xl" />`
- Toggle switch: disabled + spinner during `isPending`
- Modal selects: spinner while fetching therapists/clients

---

## Error Handling

- `error.tsx`: retry + back to dashboard
- Form errors: `<FormMessage>` inline per field
- Recipients tag input: per-chip email validation inline
- Delete saved report: `<AlertDialog>` showing report name
- Delete schedule: `<AlertDialog>` — "This will stop all future automated emails"
- Revoke share link: `<AlertDialog>` — "Anyone with the link will lose access"
- Mutation errors: `toast.error(error.response?.data?.message ?? 'Something went wrong')`

---

## Key Principles Applied

- `page.tsx` is a Server Component — fetches saved + schedules for fast first paint
- Active tab in URL `?tab=` — page state is always bookmarkable
- Saved reports store filter configs only — data always re-fetched fresh on Run
- Custom Builder uses local `useState` — transient, not persisted in URL
- Comparison report uses local `useState` for both periods — session-only state
- Schedule forms use relative date ranges only (`last_month` etc.) — never absolute dates
- Toggle schedule uses optimistic UI — switch flips immediately, reverts on API failure
- Role-based access: only Admin can create/edit/delete schedules via `<AccessControl>`
- Recipients tag input validates each email on entry — prevents bad schedule delivery
- All user-facing strings use i18n translation keys
