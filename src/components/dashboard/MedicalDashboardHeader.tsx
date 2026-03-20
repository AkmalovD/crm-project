import { BarChart2, UserPlus } from "lucide-react";

export function MedicalDashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-[32px] font-bold text-[#131d35] leading-tight">Dashboard</h1>
      <div className="flex gap-2.5 items-center">
        <button
          type="button"
          className="h-[38px] rounded-[10px] border-0 bg-[#4acf7f] text-white text-sm font-semibold px-4 shadow-[0_8px_20px_rgba(74,207,127,0.28)] flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus size={15} />
          + Add Patient
        </button>
        <button type="button" className="dashboard-icon-button rounded-[10px] w-[38px]">
          <BarChart2 size={16} />
        </button>
      </div>
    </div>
  );
}
