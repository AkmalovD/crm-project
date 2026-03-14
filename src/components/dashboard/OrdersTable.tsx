import type { Order } from "@/data/mockOrders";

type OrdersTableProps = {
  orders: Order[];
  selectedIds: Set<string>;
  totalCount: number;
  page: number;
  pageSize: number;
  onToggleAllVisible: (checked: boolean) => void;
  onToggleOne: (id: string, checked: boolean) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function OrdersTable({
  orders,
  selectedIds,
  totalCount,
  page,
  pageSize,
  onToggleAllVisible,
  onToggleOne,
  onPageChange,
  onPageSizeChange,
}: OrdersTableProps) {
  const startRow = totalCount === 0 ? 0 : page * pageSize + 1;
  const endRow = Math.min((page + 1) * pageSize, totalCount);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const allVisibleSelected = orders.length > 0 && orders.every((order) => selectedIds.has(order.id));

  return (
    <section className="dashboard-orders-card">
      <div className="dashboard-orders-header">
        <h1>Orders</h1>
      </div>

      <div className="dashboard-orders-subheader">
        <h2>All Orders {totalCount}</h2>
        <div className="flex items-center gap-6">
          <span className="text-sm text-slate-500">{selectedIds.size} item selected</span>
          <button className="text-sm font-medium text-rose-500 hover:text-rose-600">Delete</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  aria-label="Select all visible orders"
                  checked={allVisibleSelected}
                  onChange={(event) => onToggleAllVisible(event.target.checked)}
                />
              </th>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Items</th>
              <th>Locations</th>
              <th>Payment Type</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={selectedIds.has(order.id) ? "is-selected" : ""}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Select order ${order.id}`}
                    checked={selectedIds.has(order.id)}
                    onChange={(event) => onToggleOne(order.id, event.target.checked)}
                  />
                </td>
                <td className="font-medium text-indigo-500">{order.id}</td>
                <td>{order.date}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="dashboard-customer-avatar">
                      {order.customer
                        .split(" ")
                        .map((part) => part[0] ?? "")
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span className="text-slate-700">{order.customer}</span>
                  </div>
                </td>
                <td>${order.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>
                  <span className={`dashboard-status dashboard-status-${order.status.toLowerCase()}`}>{order.status}</span>
                </td>
                <td>{order.items}</td>
                <td>{order.location}</td>
                <td>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">◌</span>
                    {order.paymentType}
                  </span>
                </td>
                <td className="text-slate-400">⋮</td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-500">
                  No orders match the selected filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <footer className="dashboard-table-footer">
        <label className="inline-flex items-center gap-2 text-sm text-slate-500">
          Rows per page:
          <select
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
        <div className="flex items-center gap-5 text-sm text-slate-500">
          <span>
            {startRow}-{endRow} of {totalCount}
          </span>
          <button
            className="dashboard-pager-button"
            disabled={page <= 0}
            onClick={() => onPageChange(Math.max(0, page - 1))}
          >
            ← Previous
          </button>
          <button
            className="dashboard-pager-button"
            disabled={page >= totalPages - 1 || totalCount === 0}
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          >
            Next →
          </button>
        </div>
      </footer>
    </section>
  );
}
