import { Download } from "lucide-react";
import { CITIES } from "./medicalDashboardData";

function UkraineMap() {
  return (
    <div className="relative w-full pt-2">
      <svg viewBox="0 0 300 170" className="w-full h-auto" aria-hidden="true">
        <path
          d="M 8,85 L 12,70 L 22,57 L 33,50 L 50,40 L 70,35
             L 90,27 L 110,20 L 130,15 L 155,11 L 170,11
             L 188,15 L 205,22 L 220,28 L 232,38 L 243,50
             L 255,65 L 265,80 L 272,95 L 275,108 L 272,120
             L 265,132 L 255,142 L 243,150 L 228,157 L 213,161
             L 198,162 L 183,160 L 170,156 L 160,150
             L 148,155 L 135,160 L 118,162 L 100,160
             L 82,154 L 65,144 L 50,132 L 35,118
             L 20,103 L 10,93 Z"
          fill="#d8e4f0"
          stroke="#b8cfe4"
          strokeWidth="1.2"
        />
        {CITIES.map((city) => (
          <g key={city.name}>
            <circle cx={city.x} cy={city.y} r={3.5} fill={city.dot} opacity={0.9} />
            <text x={city.x + 5} y={city.y + 3.5} fontSize="7.5" fill="#475569" fontFamily="inherit">
              {city.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function MedicalAppointmentsMapCard() {
  return (
    <div className="border border-(--border) rounded-[14px] bg-(--panel) p-5 px-[22px] flex flex-col">
      <div className="flex justify-between items-start">
        <h2 className="text-[15px] font-semibold text-slate-800 max-w-[180px] leading-[1.35]">
          Upcoming Appointments Today
        </h2>
        <button
          type="button"
          className="bg-transparent border-0 text-slate-400 cursor-pointer p-0.5 hover:text-slate-600"
        >
          <Download size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <UkraineMap />
      </div>

      <div className="flex gap-3.5 flex-wrap text-[11px] mt-3">
        {CITIES.filter((city) => city.pct).map((city) => (
          <span key={city.name} className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: city.dot }} />
            {city.pct}
          </span>
        ))}
      </div>
    </div>
  );
}
