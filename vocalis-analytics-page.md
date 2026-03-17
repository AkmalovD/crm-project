# Vocalis — Analytics Page Implementation Prompt

## Stack Reference (from .cursorrules)
- **Framework**: Next.js App Router + TypeScript
- **UI**: Tailwind CSS + shadcn/ui (new-york) + CVA
- **State**: TanStack React Query (server state) + Zustand (UI state)
- **Forms/Filters**: React Hook Form + Zod + URL search params
- **Tables**: TanStack Table
- **Icons**: Lucide React
- **Toasts**: Sonner
- **Charts**: Recharts (recommended for this page)

---

## Route & File Structure

```
src/
└── app/
    └── (dashboard)/
        └── analytics/
            ├── page.tsx               ← Server Component, fetches initial data
            ├── loading.tsx            ← Skeleton loading state
            ├── error.tsx              ← Error boundary
            └── _components/
                ├── AnalyticsHeader.tsx
                ├── AnalyticsTabs.tsx
                ├── KpiSummaryRow.tsx
                ├── KpiCard.tsx
                ├── RevenueSessionsChart.tsx
                ├── AgeGroupChart.tsx
                ├── SessionOutcomesChart.tsx
                ├── TopServicesChart.tsx
                ├── PeakHoursHeatmap.tsx
                ├── CancellationReasonsChart.tsx
                ├── TherapistPerformanceTable.tsx
                ├── NewVsReturningChart.tsx
                ├── RetentionFunnelChart.tsx
                ├── RevenueByServiceChart.tsx
                ├── RevenueGrowthChart.tsx
                └── AnnualActivityHeatmap.tsx

src/
├── features/
│   └── analytics/
│       ├── api/
│       │   └── analytics.api.ts       ← All analytics API calls
│       ├── hooks/
│       │   ├── useAnalyticsKpi.ts
│       │   ├── useSessionAnalytics.ts
│       │   ├── useRevenueAnalytics.ts
│       │   ├── useClientAnalytics.ts
│       │   └── useTherapistAnalytics.ts
│       ├── types/
│       │   └── analytics.types.ts
│       └── validators/
│           └── analytics.validators.ts
└── store/
    └── useAnalyticsStore.ts           ← Zustand: date range, active tab
```

---

## Page Architecture

### `page.tsx` — Server Component
```tsx
// Fetch initial KPI data server-side for fast first paint
// Pass as initialData to React Query hooks in child Client Components
export default async function AnalyticsPage() {
  const initialKpi = await fetchAnalyticsKpi()
  return <AnalyticsClientShell initialKpi={initialKpi} />
}
```

### Component Rendering Order
```
PageHeader (title + date range picker + export button)
  └── AnalyticsTabs (Overview | Sessions | Revenue | Clients | Therapists)
      └── [tab content]
          ├── KpiSummaryRow (5 KPI cards)
          ├── Row: RevenueSessionsChart + AgeGroupChart
          ├── Row: SessionOutcomesChart + TopServicesChart
          ├── Row: PeakHoursHeatmap + CancellationReasonsChart
          ├── TherapistPerformanceTable (full width)
          ├── Row: NewVsReturningChart + RetentionFunnelChart
          ├── Row: RevenueByServiceChart + RevenueGrowthChart
          └── AnnualActivityHeatmap (full width)
```

---

## State Management

### Zustand Store — `useAnalyticsStore.ts`
```ts
interface AnalyticsStore {
  activeTab: 'overview' | 'sessions' | 'revenue' | 'clients' | 'therapists'
  dateRange: { from: Date; to: Date }
  setActiveTab: (tab: string) => void
  setDateRange: (range: { from: Date; to: Date }) => void
}
```

### React Query Hooks
```ts
// Domain-specific hooks per section
useAnalyticsKpi(dateRange)           // KPI summary cards
useSessionAnalytics(dateRange)       // Charts sections
useRevenueAnalytics(dateRange)       // Revenue charts
useClientAnalytics(dateRange)        // Client charts
useTherapistAnalytics(dateRange)     // Therapist table

// Query key constants
export const ANALYTICS_KEYS = {
  kpi: (range) => ['analytics', 'kpi', range],
  sessions: (range) => ['analytics', 'sessions', range],
  revenue: (range) => ['analytics', 'revenue', range],
  clients: (range) => ['analytics', 'clients', range],
  therapists: (range) => ['analytics', 'therapists', range],
}
```

### URL Search Params
```ts
// Persist date range + active tab in URL for bookmarkable analytics views
// ?tab=revenue&from=2025-01-01&to=2025-12-31
// Use useSearchParams() to read, router.push() to update
```

---

## Section 1 — KPI Summary Row

### `KpiCard.tsx` — `'use client'`
```tsx
interface KpiCardProps {
  label: string
  value: string
  trend: number           // positive = green, negative = red
  trendLabel: string      // e.g. "vs last month"
  sparklineData: number[] // 7 data points for mini chart
  className?: string
}
```

**Design specs:**
- White card, `rounded-xl`, `p-6`, left border `4px solid #4acf7f`
- Label: `text-sm text-muted-foreground`
- Value: `text-3xl font-bold text-foreground`
- Trend: green `#4acf7f` if positive, red `#ef4444` if negative + Lucide `TrendingUp` / `TrendingDown` icon
- Sparkline: Recharts `<LineChart>` minimal, no axes, `h-12 w-20`, bottom right
- Skeleton: `<Skeleton className="h-32 w-full" />` during loading

### 5 KPI Cards:
| Label | Value | Trend |
|---|---|---|
| Total Sessions | `1,284` | `+12%` green |
| Avg Sessions / Day | `42` | `+5%` green |
| Total Revenue | `$24,500` | `+8.3%` green |
| Client Retention Rate | `87%` | `-2%` red |
| Avg Session Duration | `48 min` | `+3 min` green |

---

## Section 2 — Main Charts Row

### `RevenueSessionsChart.tsx` — `'use client'`
- **Type**: Recharts `ComposedChart` (Bar + Line)
- Bar: `fill="#a5b4fc"` — monthly session count
- Line: `stroke="#4acf7f"` — revenue, `strokeWidth={2}`, smooth curve
- X axis: Jan–Dec
- Dual Y axes (left: sessions, right: revenue)
- Toggle state: `'sessions' | 'revenue' | 'both'` via `useState`
- Sort By dropdown: Weekly / Monthly / Yearly — syncs with `useAnalyticsStore`
- Tooltip: custom styled, shows both metrics
- Export icon button top right: downloads chart as PNG

### `AgeGroupChart.tsx` — `'use client'`
- **Type**: Recharts `BarChart` horizontal
- Age groups: `3–6`, `7–12`, `13–17`, `18–35`, `35+`
- Bar fill: gradient `#a7f3d0` → `#4acf7f`
- `<LabelList>` showing percentage at bar end
- Client count label inside bar
- No Y axis grid lines, clean look

---

## Section 3 — Second Charts Row

### `SessionOutcomesChart.tsx` — `'use client'`
- **Type**: Recharts `PieChart` with `innerRadius`
- Segments:
  - Completed: `#4acf7f`
  - Cancelled: `#ef4444`
  - No-show: `#f59e0b`
  - Rescheduled: `#60a5fa`
- Center label: total sessions bold + "Total Sessions" muted
- Custom legend below: color dot + label + count + percentage
- `activeIndex` state for hover lift effect

### `TopServicesChart.tsx` — `'use client'`
- **Type**: Recharts `BarChart` vertical
- Services sorted descending by revenue
- Bar fill: `#4acf7f` at `opacity-60`, hover `opacity-100`
- Custom tooltip: service name + exact revenue
- Y axis: currency formatted (`$12,400`)

---

## Section 4 — Booking Analytics Row

### `PeakHoursHeatmap.tsx` — `'use client'`
- Grid: 7 rows (Mon–Sun) × 12 columns (8am–7pm)
- Cell component: `<div>` colored by booking count intensity
  - 0: `bg-[#f3f4f6]`
  - Low: `bg-[#bbf7d0]`
  - Medium: `bg-[#4acf7f]`
  - High: `bg-[#15803d]`
- Tooltip on hover: `shadcn Tooltip` showing day + hour + count
- Color intensity: normalize count to 0–1 scale, interpolate color

### `CancellationReasonsChart.tsx` — `'use client'`
- **Type**: Recharts `PieChart` donut
- Reasons: Client illness, Schedule conflict, No reason given, Therapist unavailable, Emergency
- Legend on right side with percentage
- Colorful segments (not all green — use varied palette for distinction)

---

## Section 5 — Therapist Performance Table

### `TherapistPerformanceTable.tsx` — `'use client'`

**Uses**: TanStack Table + shadcn `<Table>` + custom `<DataTable<TherapistRow>>`

```ts
interface TherapistRow {
  id: string
  name: string
  avatar: string
  specialization: string
  totalSessions: number
  completed: number
  cancelled: number
  noShow: number
  revenue: number
  avgDuration: number       // minutes
  completionRate: number    // 0-100
  status: 'active' | 'on_leave'
}
```

**Column definitions** (colocated in same file):
| Column | Render |
|---|---|
| Therapist | `<Avatar>` + name + `<Badge>` specialization |
| Total Sessions | formatted number |
| Completed | green text |
| Cancelled | red text |
| No-show | orange text |
| Revenue | `$` formatted |
| Avg Duration | `X min` |
| Completion Rate | `<Progress value={rate} className="w-24" />` + `%` |
| Status | `<Badge variant>` Active (green) / On Leave (yellow) |

**Features:**
- Search input → filters by therapist name (client-side)
- Sort By dropdown → column sort
- Export icon → CSV download
- Alternating row: `even:bg-muted/30`
- Row hover: `hover:bg-[#f0fdf4]`
- Sortable columns with Lucide `ChevronsUpDown` icon
- Pagination synced with URL search params (`?page=1&perPage=10`)
- Skeleton rows (5) during loading

---

## Section 6 — Client Analytics Row

### `NewVsReturningChart.tsx` — `'use client'`
- **Type**: Recharts `BarChart` grouped
- Two bars per month: New (`#a7f3d0`) + Returning (`#4acf7f`)
- Last 6 months on X axis
- Legend top right

### `RetentionFunnelChart.tsx` — `'use client'`
- **Type**: Custom CSS funnel (no library needed)
- Each stage: `<div>` with decreasing width percentage, progressively darker green
- Stages: Total New → First Session → 2nd Booking → Active (5+) → Long-term (3mo+)
- Drop percentage shown between stages in muted text
- Animate widths on mount with `animate-in`

---

## Section 7 — Revenue Analytics Row

### `RevenueByServiceChart.tsx` — `'use client'`
- **Type**: Recharts `PieChart` donut
- Services: Individual, Group, Assessment, Consultation, Online
- Colorful varied segments
- Center: total revenue bold
- Legend with percentages

### `RevenueGrowthChart.tsx` — `'use client'`
- **Type**: Recharts `AreaChart`
- Single line `stroke="#4acf7f"`, area fill `#4acf7f` at `15%` opacity
- Reference line: previous year average, dashed gray `stroke="#d1d5db"`
- X axis: last 12 months
- Growth badge top right: `+X%` in green pill

---

## Section 8 — Annual Activity Heatmap

### `AnnualActivityHeatmap.tsx` — `'use client'`
- **Type**: Custom CSS grid (52 × 7 cells)
- Cell size: `14px × 14px`, gap `2px`
- Color scale:
  - 0: `#f3f4f6`
  - 1–3: `#bbf7d0`
  - 4–7: `#4acf7f`
  - 8+: `#15803d`
- Month labels above (Jan–Dec)
- Day labels left (Mo, We, Fr)
- Tooltip: `shadcn Tooltip` — date + session count
- Legend bottom right: Less → More with 5 color squares

---

## Filters & Date Range Picker

```tsx
// Header controls
<DateRangePicker
  value={dateRange}
  onChange={(range) => {
    setDateRange(range)           // Zustand
    updateSearchParams(range)     // URL
    // React Query auto-refetches via dateRange dependency
  }}
/>
<Button className="bg-[#4acf7f] text-white">
  <Download className="mr-2 h-4 w-4" />
  Export Report
</Button>
```

---

## Types — `analytics.types.ts`

```ts
export interface KpiData {
  totalSessions: number
  avgSessionsPerDay: number
  totalRevenue: number
  clientRetentionRate: number
  avgSessionDuration: number
  trends: Record<keyof Omit<KpiData, 'trends'>, number>
}

export interface DateRange {
  from: Date
  to: Date
}

export type AnalyticsTab = 'overview' | 'sessions' | 'revenue' | 'clients' | 'therapists'

export interface TherapistPerformanceRow {
  id: string
  name: string
  avatar: string
  specialization: string
  totalSessions: number
  completed: number
  cancelled: number
  noShow: number
  revenue: number
  avgDuration: number
  completionRate: number
  status: 'active' | 'on_leave'
}
```

---

## Loading States

- `loading.tsx`: full page skeleton grid matching layout
- Each chart card: `<Skeleton className="h-64 w-full rounded-xl" />` while query is pending
- Table: 5 skeleton rows with `<Skeleton>` in each cell
- KPI cards: skeleton matching card dimensions

---

## Error Handling

- `error.tsx`: page-level error boundary with retry button
- Each query `onError`: `toast.error(error.response?.data?.message ?? 'Failed to load analytics')`
- Empty state per chart: illustration + "No data for selected period" message

---

## Design Tokens (globals.css)

```css
:root {
  --primary: #4acf7f;
  --primary-light: #e6f9f0;
  --primary-dark: #15803d;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #60a5fa;
  --card: #ffffff;
  --background: #f4f6f9;
  --foreground: #1a1a2e;
  --muted-foreground: #6b7280;
}
```

---

## Key Principles Applied

- All chart components are `'use client'` — data passed as props from server or React Query
- Filters and pagination in URL search params — analytics views are bookmarkable
- Domain hooks (`useAnalyticsKpi`, etc.) — no direct API calls in components
- All user-facing strings use i18n translation keys
- Zod validates all filter/date range inputs before API calls
- Export buttons trigger server actions or signed URL downloads
