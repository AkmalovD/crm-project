import { Download, Search } from "lucide-react";
import styles from "./ClientsDashboardPage.module.css";
import { ClientStatus, SortBy, SortDir, Therapist, TherapyType } from "../../types/clientsDashboardTypes";

interface ClientsFiltersBarProps {
  searchInput: string;
  statusFilter: "" | ClientStatus;
  therapistFilter: string;
  therapyTypeFilter: "" | TherapyType;
  sortBy: SortBy;
  sortDir: SortDir;
  therapists: Therapist[];
  onSearchInputChange: (value: string) => void;
  onStatusFilterChange: (value: "" | ClientStatus) => void;
  onTherapistFilterChange: (value: string) => void;
  onTherapyTypeFilterChange: (value: "" | TherapyType) => void;
  onSortChange: (sortBy: SortBy, sortDir: SortDir) => void;
  onClearFilters: () => void;
  onExportCsv: () => void;
}

export function ClientsFiltersBar({
  searchInput,
  statusFilter,
  therapistFilter,
  therapyTypeFilter,
  sortBy,
  sortDir,
  therapists,
  onSearchInputChange,
  onStatusFilterChange,
  onTherapistFilterChange,
  onTherapyTypeFilterChange,
  onSortChange,
  onClearFilters,
  onExportCsv,
}: ClientsFiltersBarProps) {
  return (
    <section className={styles.filterBar}>
      <label className={styles.searchInput}>
        <Search size={15} className="text-slate-400" />
        <input
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          placeholder="Search by name, ID, phone..."
        />
      </label>

      <select
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value as "" | ClientStatus)}
        className={styles.select}
      >
        <option value="">Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="new">New</option>
        <option value="discharged">Discharged</option>
        <option value="on_hold">On Hold</option>
      </select>

      <select
        value={therapistFilter}
        onChange={(event) => onTherapistFilterChange(event.target.value)}
        className={styles.select}
      >
        <option value="">Therapist</option>
        {therapists.map((therapist) => (
          <option key={therapist.id} value={therapist.id}>
            {therapist.name}
          </option>
        ))}
      </select>

      <select
        value={therapyTypeFilter}
        onChange={(event) => onTherapyTypeFilterChange(event.target.value as "" | TherapyType)}
        className={styles.select}
      >
        <option value="">Therapy Type</option>
        <option value="individual">Individual</option>
        <option value="group">Group</option>
        <option value="online">Online</option>
      </select>

      <select
        className={styles.select}
        value={`${sortBy}:${sortDir}`}
        onChange={(event) => {
          const [nextSortBy, nextSortDir] = event.target.value.split(":") as [SortBy, SortDir];
          onSortChange(nextSortBy, nextSortDir);
        }}
      >
        <option value="name:asc">Sort: Name (A-Z)</option>
        <option value="name:desc">Sort: Name (Z-A)</option>
        <option value="age:asc">Sort: Age (Low to high)</option>
        <option value="age:desc">Sort: Age (High to low)</option>
        <option value="lastSession:desc">Sort: Last session (Newest)</option>
        <option value="lastSession:asc">Sort: Last session (Oldest)</option>
        <option value="totalSessions:desc">Sort: Total sessions (High to low)</option>
        <option value="totalSessions:asc">Sort: Total sessions (Low to high)</option>
      </select>

      <button type="button" className={styles.ghostButton} onClick={onClearFilters}>
        Clear Filters
      </button>

      <button type="button" className={styles.exportButton} onClick={onExportCsv}>
        <Download size={14} />
        Export CSV
      </button>
    </section>
  );
}
