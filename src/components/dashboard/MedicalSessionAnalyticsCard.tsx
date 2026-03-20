import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PRIMARY, SESSION_CHART_DATA } from "./medicalDashboardData";

interface MedicalSessionAnalyticsCardProps {
  chartPeriod: string;
  onChartPeriodChange: (value: string) => void;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-(--border) rounded-[10px] px-3.5 py-2.5 text-xs shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <p className="font-semibold text-slate-800 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="mb-0.5" style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
}

export function MedicalSessionAnalyticsCard({
  chartPeriod,
  onChartPeriodChange,
}: MedicalSessionAnalyticsCardProps) {
  return (
    <div className="border border-(--border) rounded-[14px] bg-(--panel) p-5 px-[22px]">
      <div className="flex justify-between items-center mb-3.5">
        <h2 className="text-[15px] font-semibold text-slate-800">Session Analytics</h2>
        <div className="dashboard-select">
          <select
            value={chartPeriod}
            onChange={(e) => onChartPeriodChange(e.target.value)}
            className="text-[13px] font-medium"
          >
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6 mb-4">
        <div>
          <span className="text-[20px] font-bold text-[#4acf7f]">1,760</span>
          <span className="text-[13px] text-slate-500 ml-1.5">Income</span>
        </div>
        <div>
          <span className="text-[20px] font-bold text-slate-800">345</span>
          <span className="text-[13px] text-slate-500 ml-1.5">Sessions</span>
        </div>
        <div>
          <span className="text-[20px] font-bold text-slate-800">3.5%</span>
          <span className="text-[13px] text-slate-500 ml-1.5">Completion Rate</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={SESSION_CHART_DATA} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 500]}
            ticks={[0, 250, 500, 750, 1000]}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="sessions" name="Sessions" fill={PRIMARY} radius={[4, 4, 0, 0]} barSize={20} />
          <Line type="monotone" dataKey="patients" name="Patients" stroke="#94a3b8" strokeWidth={2} dot={false} />
          <Line
            type="monotone"
            dataKey="appointments"
            name="Appointments"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex gap-[18px] justify-center text-[11px] text-slate-400 mt-2.5">
        {[
          { color: PRIMARY, label: "Sessions" },
          { color: "#94a3b8", label: "Patients" },
          { color: "#fbbf24", label: "Appointments" },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
