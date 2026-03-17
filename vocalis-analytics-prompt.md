# Vocalis — Analytics Page Design Prompt

## Project Overview
Design a dedicated **Analytics page** for **Vocalis** — a medical SaaS CRM system built for logopedists (speech therapists) and clinic administrators. The page should be data-rich, clean, and medically professional. Primary accent color is `#4acf7f`.

---

## Design System

| Property | Value |
|---|---|
| Primary color | `#4acf7f` |
| Background | `#f4f6f9` |
| Card background | `#ffffff` |
| Heading text | `#1a1a2e` |
| Label/muted text | `#6b7280` |
| Danger/cancel | `#ef4444` |
| Warning/pending | `#f59e0b` |
| Border radius (cards) | `12px` |
| Border radius (buttons) | `8px` |
| Font | Plus Jakarta Sans or DM Sans |
| Card padding | `24px` |
| Design width | `1440px` desktop |

---

## Page Header

- **Left**: Page title "Analytics" in bold `#1a1a2e`
- **Right**: Date range picker (e.g. "Jan 2025 — Dec 2025") + "Export Report" button filled with `#4acf7f`, white text, download icon
- **Below header**: Horizontal tab switcher — `Overview` | `Sessions` | `Revenue` | `Clients` | `Therapists`
- Active tab: underline + text in `#4acf7f`

---

## Section 1 — KPI Summary Row (5 stat cards in a row)

Each card contains:
- Small label on top (gray)
- Large bold number in center
- Trend indicator: green arrow up or red arrow down + percentage vs previous period
- Small sparkline chart in bottom right corner
- Thin left border in `#4acf7f`

### Cards:
1. **Total Sessions** — e.g. `1,284` | +12% vs last month
2. **Average Sessions Per Day** — e.g. `42` | +5% vs last month
3. **Total Revenue** — e.g. `$24,500` | +8.3% vs last month
4. **Client Retention Rate** — e.g. `87%` | -2% vs last month (red arrow)
5. **Average Session Duration** — e.g. `48 min` | +3 min vs last month

---

## Section 2 — Main Charts Row (two charts side by side)

### Left Chart (60% width) — Revenue & Sessions Over Time
- Combined bar + line chart
- **Bars**: monthly session count — soft blue/purple `#a5b4fc`
- **Line**: revenue trend — `#4acf7f` with smooth curve
- X axis: months of selected year (Jan–Dec)
- Y axis left: session count | Y axis right: revenue
- Toggle buttons top right: `Sessions` | `Revenue` | `Both`
- Sort by: Weekly / Monthly / Yearly dropdown
- Tooltip on hover: sessions count + revenue for that period

### Right Chart (40% width) — Client Age Group Distribution
- Horizontal bar chart
- Age groups:
  - 3–6 years (Early childhood)
  - 7–12 years (School age)
  - 13–17 years (Adolescent)
  - 18–35 years (Young adult)
  - 35+ years (Adult)
- Bars filled with `#4acf7f` gradient (light to dark)
- Percentage label shown at end of each bar
- Client count shown inside each bar

---

## Section 3 — Second Charts Row (two charts side by side)

### Left Chart (50% width) — Session Outcomes Donut Chart
- **Segments**:
  - Completed — `#4acf7f`
  - Cancelled — `#ef4444`
  - No-show — `#f59e0b`
  - Rescheduled — `#60a5fa`
- Center of donut: total sessions number in bold + label "Total Sessions"
- Legend below with color dots, label, count and percentage
- Hover: segment lifts with tooltip

### Right Chart (50% width) — Top Services by Revenue
- Vertical bar chart
- Services:
  - Individual Therapy
  - Group Therapy
  - Assessment
  - Consultation
  - Online Session
- Bars in `#4acf7f` with 60% opacity, hover full opacity
- Hover tooltip: exact revenue amount
- Y axis: revenue in currency
- Sorted by highest revenue descending

---

## Section 4 — Booking Analytics Row (two cards side by side)

### Left Card — Peak Booking Hours Heatmap
- Grid: Days of week (rows) × Hours of day (columns, 8am–8pm)
- Cell color: light `#e6f9f0` (low) → dark `#4acf7f` (high activity)
- Tooltip: exact booking count on hover
- Title: "Peak Booking Hours"

### Right Card — Cancellation Reasons Breakdown
- Horizontal donut or pie chart
- Reasons:
  - Client illness
  - Schedule conflict
  - No reason given
  - Therapist unavailable
  - Emergency
- Each segment different shade/color
- Legend with percentages on the right side of chart

---

## Section 5 — Therapist Performance Table (full width)

- Title: "Therapist Performance Breakdown" + total therapist count badge
- Top right: search input + Sort By dropdown + Export icon button

### Columns:
| Column | Details |
|---|---|
| Therapist | Avatar + full name + specialization tag |
| Total Sessions | Number |
| Completed | Number + green text |
| Cancelled | Number + red text |
| No-show | Number + orange text |
| Revenue | Currency formatted |
| Avg Duration | Minutes |
| Completion Rate | Progress bar filled `#4acf7f` + percentage text |
| Status | Badge: Active (green) / On Leave (yellow) |

- Alternating row background
- Hover: row highlight with `#f0fdf4`
- Sortable columns with arrow icons
- Pagination bottom right: rows per page selector + Previous / Next buttons

---

## Section 6 — Client Analytics Row (two cards side by side)

### Left Card — New vs Returning Clients (monthly)
- Grouped bar chart
- Two bars per month: New clients (light green) + Returning clients (`#4acf7f`)
- X axis: last 6 months
- Legend top right

### Right Card — Client Retention Funnel
- Vertical funnel chart
- Stages:
  - Total New Clients
  - Completed First Session
  - Booked 2nd Session
  - Active (5+ sessions)
  - Long-term (3+ months)
- Each stage in progressively darker `#4acf7f`
- Percentage drop shown between each stage

---

## Section 7 — Revenue Analytics Row (two cards side by side)

### Left Card — Revenue by Service Type (pie or donut)
- Services: Individual, Group, Assessment, Consultation, Online
- Colorful segments with legend
- Center: total revenue

### Right Card — Monthly Revenue Growth
- Line chart, single line in `#4acf7f`
- X axis: last 12 months
- Shaded area under line in `#4acf7f` at 15% opacity
- Reference line: previous year average (dashed gray)
- Growth percentage badge top right of card

---

## Section 8 — Activity Heatmap (full width card)

- Title: "Annual Booking Activity"
- GitHub-style contribution calendar heatmap
- Full year view (52 weeks × 7 days)
- Color scale:
  - 0 sessions: `#f3f4f6`
  - Low: `#bbf7d0`
  - Medium: `#4acf7f`
  - High: `#15803d`
- Month labels on top, day labels on left (Mo, We, Fr)
- Tooltip on hover: date + session count
- Legend bottom right: Less → More with color scale

---

## UI & Interaction Details

- Every chart card has:
  - Title top left
  - Info icon (tooltip with metric explanation)
  - Export icon top right
  - Dropdown filter (Weekly / Monthly / Yearly)
- All charts animate on page load (bars grow up, lines draw, donuts spin)
- Cards have subtle hover shadow lift: `box-shadow: 0 8px 24px rgba(0,0,0,0.08)`
- Skeleton loading state for all charts while data loads
- Empty state illustration if no data available
- All numbers use locale formatting (1,284 not 1284)
- Currency formatted with symbol ($, €, etc.)
- Percentages show +/- sign and color (green positive, red negative)

---

## Sidebar

- Left fixed sidebar (same as dashboard reference)
- **Analytics** item is active: `#4acf7f` background tint, bold text, colored icon
- Sidebar sections: Pages, Clients, Management, Apps, Settings

---

## Responsive Notes

- Designed for 1440px desktop
- At 1280px: charts stack to single column
- Table horizontally scrollable on smaller screens
- KPI cards wrap to 2×3 grid on tablet

---

*This is a pure analytics and reporting page. No booking actions, no patient editing — data visualization and clinic performance insights only.*
