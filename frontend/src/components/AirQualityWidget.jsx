import ErrorFallback from "./ErrorFallback";

function AirQualityWidget({ airQuality }) {
  if (!airQuality) {
    return <ErrorFallback />;
  }

  const qualityTone = getQualityTone(airQuality.current.usAqi);

  return (
    <section
      className={`rounded-3xl border p-6 shadow-soft transition ${qualityTone.containerClassName}`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p
            className={`text-sm font-semibold uppercase tracking-[0.24em] ${qualityTone.accentClassName}`}
          >
            Qualità dell'aria
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Indice e particolato
          </h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${qualityTone.badgeClassName}`}
        >
          {airQuality.current.label}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricBox
          label="PM2.5"
          value={formatNumeric(airQuality.current.pm2_5, " µg/m³")}
        />
        <MetricBox
          label="PM10"
          value={formatNumeric(airQuality.current.pm10, " µg/m³")}
        />
        <MetricBox
          label="AQI"
          value={airQuality.current.usAqi ?? "Non disponibile"}
        />
      </div>
    </section>
  );
}

function MetricBox({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/70 p-4 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function formatNumeric(value, suffix) {
  if (value == null) {
    return "Non disponibile";
  }

  return `${value}${suffix}`;
}

function getQualityTone(aqiValue) {
  if (aqiValue == null || aqiValue <= 50) {
    return {
      containerClassName: "bg-emerald-50 border-emerald-200",
      accentClassName: "text-emerald-700",
      badgeClassName: "bg-emerald-200 text-emerald-900",
    };
  }

  if (aqiValue <= 100) {
    return {
      containerClassName: "bg-amber-50 border-amber-200",
      accentClassName: "text-amber-700",
      badgeClassName: "bg-amber-200 text-amber-900",
    };
  }

  return {
    containerClassName: "bg-rose-50 border-rose-200",
    accentClassName: "text-rose-700",
    badgeClassName: "bg-rose-200 text-rose-900",
  };
}

export default AirQualityWidget;
