import styles from "./ClientsDashboardPage.module.css";
import { Therapist } from "../../types/clientsDashboardTypes";

interface ClientsBulkBarProps {
  selectedCount: string;
  therapists: Therapist[];
  onBulkExport: () => void;
}

export function ClientsBulkBar({ selectedCount, therapists, onBulkExport }: ClientsBulkBarProps) {
  return (
    <section className={styles.bulkBar}>
      <p className="text-sm font-medium text-slate-700">{selectedCount} selected</p>
      <div className="flex items-center gap-2">
        <button type="button" className={styles.bulkButton} onClick={onBulkExport}>
          Bulk Export
        </button>
        <select className={styles.select}>
          <option>Bulk assign therapist</option>
          {therapists.map((therapist) => (
            <option key={`bulk-${therapist.id}`}>{therapist.name}</option>
          ))}
        </select>
      </div>
    </section>
  );
}
