"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import styles from "./ClientsDashboardPage.module.css";

type ClientStatus = "active" | "inactive" | "new" | "discharged" | "on_hold";
type TherapyType = "individual" | "group" | "online";
type SortBy = "name" | "age" | "lastSession" | "totalSessions";
type SortDir = "asc" | "desc";

type Therapist = {
  id: string;
  name: string;
};

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  clientCode: string;
  age: number;
  dateOfBirth: string;
  primaryDiagnosis: string;
  assignedTherapist: Therapist;
  therapyType: TherapyType;
  status: ClientStatus;
  phone: string;
  lastSessionDate: string | null;
  totalSessions: number;
};

const THERAPISTS: Therapist[] = [
  { id: "t-1", name: "Dr. Mia Carter" },
  { id: "t-2", name: "Dr. Liam Evans" },
  { id: "t-3", name: "Dr. Ava Pierce" },
  { id: "t-4", name: "Dr. Noah Wells" },
];

const CLIENTS: Client[] = [
  { id: "c-1001", firstName: "John", lastName: "Parker", fullName: "John Parker", clientCode: "CL-1001", age: 8, dateOfBirth: "2017-06-11", primaryDiagnosis: "Articulation disorder", assignedTherapist: THERAPISTS[0], therapyType: "individual", status: "active", phone: "+1 202-555-0101", lastSessionDate: "2026-03-12", totalSessions: 36 },
  { id: "c-1002", firstName: "Ariana", lastName: "Lopez", fullName: "Ariana Lopez", clientCode: "CL-1002", age: 12, dateOfBirth: "2013-01-22", primaryDiagnosis: "Fluency disorder", assignedTherapist: THERAPISTS[1], therapyType: "group", status: "active", phone: "+1 202-555-0119", lastSessionDate: "2026-03-10", totalSessions: 42 },
  { id: "c-1003", firstName: "Ethan", lastName: "Morris", fullName: "Ethan Morris", clientCode: "CL-1003", age: 16, dateOfBirth: "2009-08-30", primaryDiagnosis: "Voice disorder", assignedTherapist: THERAPISTS[2], therapyType: "online", status: "on_hold", phone: "+1 202-555-0134", lastSessionDate: "2026-02-19", totalSessions: 18 },
  { id: "c-1004", firstName: "Sophia", lastName: "Reed", fullName: "Sophia Reed", clientCode: "CL-1004", age: 7, dateOfBirth: "2018-03-07", primaryDiagnosis: "Language delay", assignedTherapist: THERAPISTS[3], therapyType: "individual", status: "new", phone: "+1 202-555-0178", lastSessionDate: null, totalSessions: 0 },
  { id: "c-1005", firstName: "Oliver", lastName: "Shaw", fullName: "Oliver Shaw", clientCode: "CL-1005", age: 10, dateOfBirth: "2015-11-19", primaryDiagnosis: "Childhood apraxia of speech", assignedTherapist: THERAPISTS[0], therapyType: "individual", status: "active", phone: "+1 202-555-0163", lastSessionDate: "2026-03-13", totalSessions: 51 },
  { id: "c-1006", firstName: "Nora", lastName: "Kim", fullName: "Nora Kim", clientCode: "CL-1006", age: 19, dateOfBirth: "2006-09-14", primaryDiagnosis: "Aphasia support", assignedTherapist: THERAPISTS[2], therapyType: "online", status: "inactive", phone: "+1 202-555-0154", lastSessionDate: "2025-12-03", totalSessions: 23 },
  { id: "c-1007", firstName: "Mateo", lastName: "Hughes", fullName: "Mateo Hughes", clientCode: "CL-1007", age: 14, dateOfBirth: "2011-02-25", primaryDiagnosis: "Stuttering management", assignedTherapist: THERAPISTS[1], therapyType: "group", status: "active", phone: "+1 202-555-0180", lastSessionDate: "2026-03-11", totalSessions: 39 },
  { id: "c-1008", firstName: "Maya", lastName: "Davis", fullName: "Maya Davis", clientCode: "CL-1008", age: 28, dateOfBirth: "1997-05-10", primaryDiagnosis: "Adult articulation", assignedTherapist: THERAPISTS[3], therapyType: "individual", status: "discharged", phone: "+1 202-555-0124", lastSessionDate: "2026-01-14", totalSessions: 64 },
  { id: "c-1009", firstName: "Noah", lastName: "Stone", fullName: "Noah Stone", clientCode: "CL-1009", age: 9, dateOfBirth: "2016-04-18", primaryDiagnosis: "Phonological disorder", assignedTherapist: THERAPISTS[0], therapyType: "individual", status: "active", phone: "+1 202-555-0192", lastSessionDate: "2026-03-09", totalSessions: 27 },
  { id: "c-1010", firstName: "Layla", lastName: "Turner", fullName: "Layla Turner", clientCode: "CL-1010", age: 11, dateOfBirth: "2014-10-05", primaryDiagnosis: "Expressive language disorder", assignedTherapist: THERAPISTS[2], therapyType: "group", status: "new", phone: "+1 202-555-0147", lastSessionDate: null, totalSessions: 0 },
  { id: "c-1011", firstName: "Benjamin", lastName: "Cook", fullName: "Benjamin Cook", clientCode: "CL-1011", age: 31, dateOfBirth: "1994-07-03", primaryDiagnosis: "Voice rehabilitation", assignedTherapist: THERAPISTS[3], therapyType: "online", status: "active", phone: "+1 202-555-0111", lastSessionDate: "2026-03-08", totalSessions: 16 },
  { id: "c-1012", firstName: "Amelia", lastName: "Price", fullName: "Amelia Price", clientCode: "CL-1012", age: 6, dateOfBirth: "2019-01-12", primaryDiagnosis: "Speech sound disorder", assignedTherapist: THERAPISTS[1], therapyType: "individual", status: "active", phone: "+1 202-555-0188", lastSessionDate: "2026-03-15", totalSessions: 33 },
];

const PAGE_SIZE = 8;

const STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  new: "New",
  discharged: "Discharged",
  on_hold: "On Hold",
};

const THERAPY_LABELS: Record<TherapyType, string> = {
  individual: "Individual",
  group: "Group",
  online: "Online",
};

const NUMBER = new Intl.NumberFormat("en-US");

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatDate(date: string | null) {
  if (!date) return "No sessions yet";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toCsv(rows: Client[]) {
  const header = [
    "Client Code",
    "Full Name",
    "Age",
    "Date of Birth",
    "Diagnosis",
    "Therapist",
    "Therapy Type",
    "Status",
    "Phone",
    "Last Session",
    "Total Sessions",
  ];
  const body = rows.map((row) => [
    row.clientCode,
    row.fullName,
    String(row.age),
    row.dateOfBirth,
    row.primaryDiagnosis,
    row.assignedTherapist.name,
    THERAPY_LABELS[row.therapyType],
    STATUS_LABELS[row.status],
    row.phone,
    row.lastSessionDate ?? "",
    String(row.totalSessions),
  ]);

  return [header, ...body]
    .map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

function downloadCsv(rows: Client[], fileName: string) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }: { status: ClientStatus }) {
  return <span className={cx(styles.statusBadge, styles[`status_${status}`])}>{STATUS_LABELS[status]}</span>;
}

export function ClientsDashboardPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ClientStatus>("");
  const [therapistFilter, setTherapistFilter] = useState("");
  const [therapyTypeFilter, setTherapyTypeFilter] = useState<"" | TherapyType>("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const filteredClients = useMemo(() => {
    const list = CLIENTS.filter((client) => {
      const searchMatch =
        !search ||
        client.fullName.toLowerCase().includes(search) ||
        client.clientCode.toLowerCase().includes(search) ||
        client.phone.toLowerCase().includes(search);
      const statusMatch = !statusFilter || client.status === statusFilter;
      const therapistMatch = !therapistFilter || client.assignedTherapist.id === therapistFilter;
      const therapyTypeMatch = !therapyTypeFilter || client.therapyType === therapyTypeFilter;
      return searchMatch && statusMatch && therapistMatch && therapyTypeMatch;
    });

    list.sort((left, right) => {
      let comparison = 0;
      if (sortBy === "name") comparison = left.fullName.localeCompare(right.fullName);
      if (sortBy === "age") comparison = left.age - right.age;
      if (sortBy === "lastSession") comparison = (left.lastSessionDate ?? "").localeCompare(right.lastSessionDate ?? "");
      if (sortBy === "totalSessions") comparison = left.totalSessions - right.totalSessions;
      return sortDir === "asc" ? comparison : -comparison;
    });

    return list;
  }, [search, sortBy, sortDir, statusFilter, therapistFilter, therapyTypeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filteredClients.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const allOnCurrentPageSelected = paginated.length > 0 && paginated.every((client) => selectedIds.has(client.id));

  const selectedClients = filteredClients.filter((client) => selectedIds.has(client.id));

  return (
    <DashboardScaffold>
      <div className={styles.clientsPage}>
        <header className={styles.clientsHeader}>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-[#1a1a2e]">Clients</h1>
            <span className={styles.totalBadge}>{NUMBER.format(filteredClients.length)} clients</span>
          </div>
          <button type="button" className={styles.addClientButton}>
            <Plus size={16} />
            Add Client
          </button>
        </header>

        <section className={styles.filterBar}>
          <label className={styles.searchInput}>
            <Search size={15} className="text-slate-400" />
            <input
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                setPage(1);
              }}
              placeholder="Search by name, ID, phone..."
            />
          </label>

          <select value={statusFilter} onChange={(event) => {
            setStatusFilter(event.target.value as "" | ClientStatus);
            setPage(1);
          }} className={styles.select}>
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="new">New</option>
            <option value="discharged">Discharged</option>
            <option value="on_hold">On Hold</option>
          </select>

          <select value={therapistFilter} onChange={(event) => {
            setTherapistFilter(event.target.value);
            setPage(1);
          }} className={styles.select}>
            <option value="">Therapist</option>
            {THERAPISTS.map((therapist) => (
              <option key={therapist.id} value={therapist.id}>
                {therapist.name}
              </option>
            ))}
          </select>

          <select value={therapyTypeFilter} onChange={(event) => {
            setTherapyTypeFilter(event.target.value as "" | TherapyType);
            setPage(1);
          }} className={styles.select}>
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
              setSortBy(nextSortBy);
              setSortDir(nextSortDir);
              setPage(1);
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

          <button
            type="button"
            className={styles.ghostButton}
            onClick={() => {
              setSearchInput("");
              setStatusFilter("");
              setTherapistFilter("");
              setTherapyTypeFilter("");
              setSortBy("name");
              setSortDir("asc");
              setPage(1);
            }}
          >
            Clear Filters
          </button>

          <button type="button" className={styles.exportButton} onClick={() => downloadCsv(filteredClients, "clients-export.csv")}>
            <Download size={14} />
            Export CSV
          </button>
        </section>

        {selectedClients.length > 0 && (
          <section className={styles.bulkBar}>
            <p className="text-sm font-medium text-slate-700">
              {NUMBER.format(selectedClients.length)} selected
            </p>
            <div className="flex items-center gap-2">
              <button type="button" className={styles.bulkButton} onClick={() => downloadCsv(selectedClients, "selected-clients.csv")}>
                Bulk Export
              </button>
              <select className={styles.select}>
                <option>Bulk assign therapist</option>
                {THERAPISTS.map((therapist) => (
                  <option key={`bulk-${therapist.id}`}>{therapist.name}</option>
                ))}
              </select>
            </div>
          </section>
        )}

        <section className={styles.tableCard}>
          <div className="overflow-x-auto">
            <table className={styles.clientsTable}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={allOnCurrentPageSelected}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        setSelectedIds((previous) => {
                          const next = new Set(previous);
                          paginated.forEach((client) => {
                            if (checked) next.add(client.id);
                            else next.delete(client.id);
                          });
                          return next;
                        });
                      }}
                      aria-label="Select all clients"
                    />
                  </th>
                  <th>Client</th>
                  <th>Age / DOB</th>
                  <th>Diagnosis</th>
                  <th>Therapist</th>
                  <th>Therapy Type</th>
                  <th>Last Session</th>
                  <th>Total Sessions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={10}>
                      <div className={styles.emptyState}>
                        <p className="text-lg font-semibold text-slate-700">No clients found</p>
                        <p className="mt-1 text-sm text-slate-500">Try adjusting filters or add your first client.</p>
                        <button type="button" className={styles.addClientButton}>
                          <Plus size={16} />
                          Add your first client
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {paginated.map((client) => (
                    <tr key={client.id} className={styles.tableRow}>
                      <td onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(client.id)}
                          onChange={(event) => {
                            const checked = event.target.checked;
                            setSelectedIds((previous) => {
                              const next = new Set(previous);
                              if (checked) next.add(client.id);
                              else next.delete(client.id);
                              return next;
                            });
                          }}
                          aria-label={`Select ${client.fullName}`}
                        />
                      </td>
                      <td onClick={() => router.push(`/clients/${client.id}`)}>
                        <div className={styles.clientCell}>
                          <span className={styles.avatar}>{client.firstName[0]}{client.lastName[0]}</span>
                          <div>
                            <p className="font-semibold text-[#1a1a2e]">{client.fullName}</p>
                            <p className="text-xs text-slate-500">{client.clientCode}</p>
                          </div>
                        </div>
                      </td>
                      <td onClick={() => router.push(`/clients/${client.id}`)}>
                        <p className="font-semibold text-[#334155]">{client.age}</p>
                        <p className="text-xs text-slate-500">{formatDate(client.dateOfBirth)}</p>
                      </td>
                      <td onClick={() => router.push(`/clients/${client.id}`)} className={styles.truncateCell}>
                        {client.primaryDiagnosis}
                      </td>
                      <td onClick={() => router.push(`/clients/${client.id}`)}>
                        <div className={styles.therapistCell}>
                          <span className={styles.therapistAvatar}>{client.assignedTherapist.name.replace("Dr. ", "").split(" ").map((part) => part[0]).join("")}</span>
                          {client.assignedTherapist.name}
                        </div>
                      </td>
                      <td onClick={() => router.push(`/clients/${client.id}`)}>
                        <span className={styles.therapyBadge}>{THERAPY_LABELS[client.therapyType]}</span>
                      </td>
                      <td onClick={() => router.push(`/clients/${client.id}`)}>{formatDate(client.lastSessionDate)}</td>
                      <td onClick={() => router.push(`/clients/${client.id}`)}>{NUMBER.format(client.totalSessions)}</td>
                      <td onClick={() => router.push(`/clients/${client.id}`)}>
                        <StatusBadge status={client.status} />
                      </td>
                      <td onClick={(event) => event.stopPropagation()}>
                        <div className={styles.actionsCell}>
                          <button type="button" className={styles.rowButton} onClick={() => router.push(`/clients/${client.id}`)}>
                            View
                          </button>
                          <button type="button" className={styles.rowButton}>
                            Edit
                          </button>
                          <button type="button" className={styles.rowButtonDanger}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <footer className={styles.tableFooter}>
            <span>Rows per page: {PAGE_SIZE}</span>
            <button type="button" className={styles.pagerButton} disabled={safePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
              Previous
            </button>
            <span>
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              className={styles.pagerButton}
              disabled={safePage >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Next
            </button>
          </footer>
        </section>
      </div>
    </DashboardScaffold>
  );
}
