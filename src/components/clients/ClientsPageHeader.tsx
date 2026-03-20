import { Plus } from "lucide-react";
import styles from "./ClientsDashboardPage.module.css";

interface ClientsPageHeaderProps {
  totalClients: string;
}

export function ClientsPageHeader({ totalClients }: ClientsPageHeaderProps) {
  return (
    <header className={styles.clientsHeader}>
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-bold text-[#1a1a2e]">Clients</h1>
        <span className={styles.totalBadge}>{totalClients} clients</span>
      </div>
      <button type="button" className={styles.addClientButton}>
        <Plus size={16} />
        Add Client
      </button>
    </header>
  );
}
