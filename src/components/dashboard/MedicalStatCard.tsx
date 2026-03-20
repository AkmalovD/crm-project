import { StatCardConfig } from "../../types/medicalDashboardTypes";

export function MedicalStatCard({ label, value, delta, deltaPositive, link, Icon }: StatCardConfig) {
  return (
    <div className="border border-(--border) rounded-[14px] bg-(--panel) px-5 py-[18px] flex flex-col gap-1.5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase tracking-[0.06em] text-(--soft-text) font-bold mb-0.5">
            {label}
          </p>
          <span className={`text-xs font-semibold ${deltaPositive ? "text-green-500" : "text-red-500"}`}>
            {delta}
          </span>
        </div>
        <div className="w-[34px] h-[34px] rounded-full bg-[#edfaf3] flex items-center justify-center text-[#4acf7f] shrink-0">
          <Icon size={16} />
        </div>
      </div>
      <p className="text-[26px] font-bold text-[#131d35] leading-tight">{value}</p>
      <a href="#" className="text-xs text-[#4acf7f] no-underline hover:underline">
        {link}
      </a>
    </div>
  );
}
