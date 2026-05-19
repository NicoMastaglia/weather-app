import ErrorFallback from "./ErrorFallback";

function MarineWidget({ marine }) {
  if (!marine) {
    return <ErrorFallback />;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
          Stato del mare
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Onde e superficie
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MarineMetric
          label="Altezza onda"
          value={formatNumeric(marine.current.waveHeight, " m")}
        />
        <MarineMetric
          label="Temperatura mare"
          value={formatNumeric(marine.current.seaSurfaceTemperature, " °C")}
        />
        <MarineMetric
          label="Swell"
          value={formatNumeric(marine.current.swellWaveHeight, " m")}
        />
        <MarineMetric
          label="Wind wave"
          value={formatNumeric(marine.current.windWaveHeight, " m")}
        />
      </div>
    </section>
  );
}

function MarineMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function formatNumeric(value, suffix) {
  if (value == null) {
    return "Non disponibile";
  }

  return `${value}${suffix}`;
}

export default MarineWidget;
