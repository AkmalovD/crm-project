"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import { ClientsBulkBar } from "./ClientsBulkBar";
import { ClientsFiltersBar } from "./ClientsFiltersBar";
import { ClientsPageHeader } from "./ClientsPageHeader";
import { ClientsTableCard } from "./ClientsTableCard";
import styles from "./ClientsDashboardPage.module.css";
import { CLIENTS, PAGE_SIZE, THERAPISTS } from "@/data/clientsData/clientsDashboardData"
import { downloadCsv, NUMBER } from "../../utils/clientsDashboardUtils";
import { ClientStatus, SortBy, SortDir, TherapyType } from "../../types/clientsDashboardTypes";

export function ClientsDashboardPage() {
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
        <ClientsPageHeader totalClients={NUMBER.format(filteredClients.length)} />
        <ClientsFiltersBar
          searchInput={searchInput}
          statusFilter={statusFilter}
          therapistFilter={therapistFilter}
          therapyTypeFilter={therapyTypeFilter}
          sortBy={sortBy}
          sortDir={sortDir}
          therapists={THERAPISTS}
          onSearchInputChange={(value) => {
            setSearchInput(value);
            setPage(1);
          }}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          onTherapistFilterChange={(value) => {
            setTherapistFilter(value);
            setPage(1);
          }}
          onTherapyTypeFilterChange={(value) => {
            setTherapyTypeFilter(value);
            setPage(1);
          }}
          onSortChange={(nextSortBy, nextSortDir) => {
            setSortBy(nextSortBy);
            setSortDir(nextSortDir);
            setPage(1);
          }}
          onClearFilters={() => {
            setSearchInput("");
            setStatusFilter("");
            setTherapistFilter("");
            setTherapyTypeFilter("");
            setSortBy("name");
            setSortDir("asc");
            setPage(1);
          }}
          onExportCsv={() => downloadCsv(filteredClients, "clients-export.csv")}
        />

        {selectedClients.length > 0 && (
          <ClientsBulkBar
            selectedCount={NUMBER.format(selectedClients.length)}
            therapists={THERAPISTS}
            onBulkExport={() => downloadCsv(selectedClients, "selected-clients.csv")}
          />
        )}

        <ClientsTableCard
          paginated={paginated}
          selectedIds={selectedIds}
          allOnCurrentPageSelected={allOnCurrentPageSelected}
          safePage={safePage}
          totalPages={totalPages}
          onToggleSelectAllPage={(checked) => {
            setSelectedIds((previous) => {
              const next = new Set(previous);
              paginated.forEach((client) => {
                if (checked) next.add(client.id);
                else next.delete(client.id);
              });
              return next;
            });
          }}
          onToggleSelectClient={(clientId, checked) => {
            setSelectedIds((previous) => {
              const next = new Set(previous);
              if (checked) next.add(clientId);
              else next.delete(clientId);
              return next;
            });
          }}
          onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
          onNextPage={() => setPage((current) => Math.min(totalPages, current + 1))}
        />
      </div>
    </DashboardScaffold>
  );
}
