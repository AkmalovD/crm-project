import { PAGE_SIZE } from "../../data/dashboardData/medicalDashboardData";
import { Patient } from "../../types/medicalDashboardTypes";

interface MedicalPatientsTableCardProps {
  patients: Patient[];
  totalCount: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  page: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function MedicalPatientsTableCard({
  patients,
  totalCount,
  sortBy,
  onSortChange,
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
}: MedicalPatientsTableCardProps) {
  return (
    <div className="dashboard-orders-card">
      <div className="px-5 pt-[18px] pb-2.5 flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-800">Information by patients ({totalCount})</h2>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Sort By</span>
          <div className="dashboard-select">
            <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
              <option>Progress</option>
              <option>Name</option>
              <option>Status</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th className="w-10">
                <input type="checkbox" className="accent-[#4acf7f]" />
              </th>
              <th>PATIENT</th>
              <th>THERAPIST</th>
              <th>PROGRESS ↕</th>
              <th>NEXT SESSION</th>
              <th>COMPLETED ↕</th>
              <th>SESSIONS</th>
              <th>STATUS ↕</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <input type="checkbox" className="accent-[#4acf7f]" />
                </td>
                <td>
                  <a href="#" className="text-[#4acf7f] font-medium no-underline text-sm hover:underline">
                    {patient.name}
                  </a>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-[25px] h-[25px] rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0"
                      style={{ background: patient.therapist.color }}
                    >
                      {patient.therapist.initials}
                    </div>
                    <span className="text-sm text-slate-600">{patient.therapist.name}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded bg-gray-200 shrink-0">
                      <div className="h-full rounded bg-[#4acf7f]" style={{ width: `${patient.progress}%` }} />
                    </div>
                    <span className="text-[13px]">{patient.progress}%</span>
                  </div>
                </td>
                <td>{patient.nextSession}</td>
                <td>{patient.completed}%</td>
                <td>{patient.visits.toLocaleString()} sessions</td>
                <td>
                  <span
                    className={
                      patient.status === "Active"
                        ? "dashboard-status dashboard-status-approved"
                        : "dashboard-status dashboard-status-refunded"
                    }
                  >
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-table-footer">
        <span className="text-[13px]">Rows per page: {PAGE_SIZE}</span>
        <span className="text-[13px]">
          {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
        </span>
        <div className="flex gap-2">
          <button type="button" className="dashboard-pager-button" onClick={onPreviousPage} disabled={page === 0}>
            ← Previous
          </button>
          <button
            type="button"
            className="dashboard-pager-button"
            onClick={onNextPage}
            disabled={page === totalPages - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
