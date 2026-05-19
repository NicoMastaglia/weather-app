import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ErrorFallback from "./ErrorFallback";

function HourlyChart({ hourlyWeather }) {
  if (!hourlyWeather || hourlyWeather.length === 0) {
    return <ErrorFallback />;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-soft">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Prossime 24 ore
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            Evoluzione termica e vento
          </h2>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cyan-100">
          Aggiornamento continuo
        </span>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyWeather}>
            <defs>
              <linearGradient
                id="temperatureGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="rgba(255,255,255,0.12)"
              strokeDasharray="4 6"
            />
            <XAxis dataKey="label" tick={{ fill: "#e2e8f0", fontSize: 12 }} />
            <YAxis tick={{ fill: "#e2e8f0", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "16px",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#22d3ee"
              fill="url(#temperatureGradient)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="windSpeed"
              stroke="#f59e0b"
              fillOpacity={0}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default HourlyChart;
