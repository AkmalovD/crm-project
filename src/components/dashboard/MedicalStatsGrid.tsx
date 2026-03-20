import { STAT_CARDS } from "../../data/dashboardData/medicalDashboardData";
import { MedicalStatCard } from "./MedicalStatCard";

export function MedicalStatsGrid() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {STAT_CARDS.map((card) => (
        <MedicalStatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
