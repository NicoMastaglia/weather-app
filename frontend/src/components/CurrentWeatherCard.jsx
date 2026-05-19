import { Droplets, Thermometer, Wind } from "lucide-react";

import ErrorFallback from "./ErrorFallback";

function CurrentWeatherCard({ weather }) {
  if (!weather) {
    return <ErrorFallback />;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Meteo attuale
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Condizioni in tempo reale
          </h2>
        </div>
        <div className="rounded-2xl bg-sky-50 px-4 py-2 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-700">
            Temperatura
          </p>
          <p className="text-3xl font-bold text-sky-900">
            {formatValue(weather.current.temperature, "°")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatItem
          icon={Thermometer}
          label="Temperatura percepita"
          value={formatValue(weather.current.apparentTemperature, "°")}
        />
        <StatItem
          icon={Droplets}
          label="Umidità"
          value={formatValue(weather.current.humidity, "%")}
        />
        <StatItem
          icon={Wind}
          label="Vento"
          value={formatValue(weather.current.windSpeed, " km/h")}
        />
        <StatItem
          icon={Wind}
          label="Stato del cielo"
          value={weather.current.weatherDescription ?? "Non disponibile"}
        />
      </div>
    </section>
  );
}

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="mb-3 inline-flex rounded-xl bg-white p-2 text-sky-700 shadow-sm">
        <Icon size={18} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function formatValue(value, suffix) {
  if (value == null) {
    return "Non disponibile";
  }

  return `${value}${suffix}`;
}

export default CurrentWeatherCard;
