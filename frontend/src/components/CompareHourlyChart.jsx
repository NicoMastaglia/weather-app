import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ErrorFallback from "./ErrorFallback";

function CompareHourlyChart({
  cityAName,
  cityBName,
  cityAHourly,
  cityBHourly,
}) {
  if (!cityAHourly || !cityBHourly) {
    return <ErrorFallback />;
  }

  const chartData = cityAHourly.map((hourEntry, index) => ({
    label: hourEntry.label,
    cityA: hourEntry.temperature ?? null,
    cityB: cityBHourly[index]?.temperature ?? null,
  }));

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-soft">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Temperature a confronto
          </p>
          <h2 className="mt-1 text-2xl font-bold">Andamento prossime 24 ore</h2>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <span className="rounded-full bg-sky-500/20 px-3 py-1 text-sky-200">
            {cityAName}
          </span>
          <span className="rounded-full bg-orange-500/20 px-3 py-1 text-orange-200">
            {cityBName}
          </span>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
            <Line
              type="monotone"
              dataKey="cityA"
              name={cityAName}
              stroke="#38bdf8"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cityB"
              name={cityBName}
              stroke="#fb923c"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default CompareHourlyChart;
