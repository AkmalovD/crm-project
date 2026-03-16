"use client";

import { useMemo, useState } from "react";

import { mockOrders } from "@/data/mockOrders";

import { DashboardScaffold } from "./DashboardScaffold";
import { OrdersTable } from "./OrdersTable";
import { Topbar } from "../../layout/Topbar";

type StatusFilter = "All" | "Approved" | "Refunded" | "Unpaid";
type DateRangeFilter = "7d" | "30d" | "90d";

export function OrdersDashboardPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("7d");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filteredOrders = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();

    return mockOrders.filter((order) => {
      const matchesSearch =
        lowerSearch.length === 0 ||
        order.id.toLowerCase().includes(lowerSearch) ||
        order.customer.toLowerCase().includes(lowerSearch) ||
        order.location.toLowerCase().includes(lowerSearch);
      const matchesStatus = status === "All" || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const maxPage = Math.max(0, Math.ceil(filteredOrders.length / pageSize) - 1);
  const safePage = Math.min(page, maxPage);

  const pagedOrders = useMemo(() => {
    const start = safePage * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, safePage, pageSize]);

  const handleToggleAllVisible = (checked: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      for (const order of pagedOrders) {
        if (checked) {
          next.add(order.id);
        } else {
          next.delete(order.id);
        }
      }
      return next;
    });
  };

  const handleToggleOne = (id: string, checked: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(0);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(Math.max(0, Math.min(nextPage, maxPage)));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value);
    setPage(0);
  };

  return (
    <DashboardScaffold>
        <Topbar
          search={search}
          status={status}
          dateRange={dateRange}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onDateRangeChange={setDateRange}
        />
        <OrdersTable
          orders={pagedOrders}
          selectedIds={selectedIds}
          totalCount={filteredOrders.length}
          page={safePage}
          pageSize={pageSize}
          onToggleAllVisible={handleToggleAllVisible}
          onToggleOne={handleToggleOne}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
    </DashboardScaffold>
  );
}
