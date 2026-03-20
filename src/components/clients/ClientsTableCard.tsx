import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./ClientsDashboardPage.module.css";
import { Client, ClientStatus } from "../../types/clientsDashboardTypes";
import { PAGE_SIZE, STATUS_LABELS, THERAPY_LABELS } from "@/data/clientsData/clientsDashboardData";
import { cx, formatDate, NUMBER } from "../../utils/clientsDashboardUtils";

interface ClientsTableCardProps {
  paginated: Client[];
  selectedIds: Set<string>;
  allOnCurrentPageSelected: boolean;
  safePage: number;
  totalPages: number;
  onToggleSelectAllPage: (checked: boolean) => void;
  onToggleSelectClient: (clientId: string, checked: boolean) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

function StatusBadge({ status }: { status: ClientStatus }) {
  return <span className={cx(styles.statusBadge, styles[`status_${status}`])}>{STATUS_LABELS[status]}</span>;
}

export function ClientsTableCard({
  paginated,
  selectedIds,
  allOnCurrentPageSelected,
  safePage,
  totalPages,
  onToggleSelectAllPage,
  onToggleSelectClient,
  onPreviousPage,
  onNextPage,
}: ClientsTableCardProps) {
  const router = useRouter();

  return (
    <section className={styles.tableCard}>
      <div className="overflow-x-auto">
        <table className={styles.clientsTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allOnCurrentPageSelected}
                  onChange={(event) => onToggleSelectAllPage(event.target.checked)}
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
                    onChange={(event) => onToggleSelectClient(client.id, event.target.checked)}
                    aria-label={`Select ${client.fullName}`}
                  />
                </td>
                <td onClick={() => router.push(`/clients/${client.id}`)}>
                  <div className={styles.clientCell}>
                    <span className={styles.avatar}>
                      {client.firstName[0]}
                      {client.lastName[0]}
                    </span>
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
                    <span className={styles.therapistAvatar}>
                      {client.assignedTherapist.name
                        .replace("Dr. ", "")
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
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
        <button type="button" className={styles.pagerButton} disabled={safePage <= 1} onClick={onPreviousPage}>
          Previous
        </button>
        <span>
          {safePage} / {totalPages}
        </span>
        <button type="button" className={styles.pagerButton} disabled={safePage >= totalPages} onClick={onNextPage}>
          Next
        </button>
      </footer>
    </section>
  );
}
