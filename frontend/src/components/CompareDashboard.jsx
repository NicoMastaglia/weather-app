import { Droplets, Gauge, Thermometer, Waves } from "lucide-react";

import CompareHourlyChart from "./CompareHourlyChart";
import ErrorFallback from "./ErrorFallback";

function CompareDashboard({ comparisonData, cityAName, cityBName }) {
  if (!comparisonData) {
    return <ErrorFallback />;
  }

  const [cityA, cityB] = comparisonData.cities;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <CityComparisonColumn
        cityResult={cityA}
        otherCityResult={cityB}
        label={`Città A - ${cityAName}`}
      />
      <CityComparisonColumn
        cityResult={cityB}
        otherCityResult={cityA}
        label={`Città B - ${cityBName}`}
      />

      <div className="xl:col-span-2">
        {cityA.success && cityB.success ? (
          <CompareHourlyChart
            cityAName={cityAName}
            cityBName={cityBName}
            cityAHourly={cityA.data?.weather?.hourly ?? []}
            cityBHourly={cityB.data?.weather?.hourly ?? []}
          />
        ) : (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 shadow-soft">
            Il grafico comparativo viene mostrato solo quando entrambe le città
            hanno dati meteo completi.
          </div>
        )}
      </div>
    </div>
  );
}

function CityComparisonColumn({ cityResult, otherCityResult, label }) {
  if (!cityResult?.success) {
    return (
      <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-700">
          {label}
        </p>
        <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-medium">
          {cityResult?.error || "Dati non disponibili per questa città"}
        </div>
      </section>
    );
  }

  const weatherWinner = getHigherTemperatureWinner(cityResult, otherCityResult);
  const airQualityWinner = getLowerAqiWinner(cityResult, otherCityResult);
  const calmSeaWinner = getCalmestSeaWinner(cityResult, otherCityResult);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            {label}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {cityResult.city.name}
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Aggiornato {formatTime(cityResult.updatedAt)}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ComparisonMetric
          icon={Thermometer}
          label="Temperatura corrente"
          value={formatNumber(
            cityResult.data.weather?.current?.temperature,
            "°C",
          )}
          isWinner={weatherWinner === cityResult.city.name}
        />
        <ComparisonMetric
          icon={Droplets}
          label="Qualità aria AQI"
          value={formatNumber(cityResult.data.airQuality?.current?.usAqi, "")}
          isWinner={airQualityWinner === cityResult.city.name}
        />
        <ComparisonMetric
          icon={Waves}
          label="Altezza mare"
          value={formatNumber(cityResult.data.marine?.current?.waveHeight, "m")}
          isWinner={calmSeaWinner === cityResult.city.name}
        />
        <ComparisonMetric
          icon={Gauge}
          label="Vento"
          value={formatNumber(
            cityResult.data.weather?.current?.windSpeed,
            "km/h",
          )}
          isWinner={false}
        />
      </div>

      <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4">
        <ComparisonLine
          label="Meteo"
          value={
            cityResult.data.weather?.current?.weatherDescription ??
            "Non disponibile"
          }
        />
        <ComparisonLine
          label="Aria"
          value={
            cityResult.data.airQuality?.current?.label ?? "Non disponibile"
          }
        />
        <ComparisonLine
          label="Mare"
          value={
            cityResult.data.marine?.current?.seaSurfaceTemperature != null
              ? `${cityResult.data.marine.current.seaSurfaceTemperature} °C`
              : "Non disponibile"
          }
        />
      </div>

      {otherCityResult?.success ? null : (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Il confronto completo non e disponibile, ma questa colonna rimane
          visibile.
        </div>
      )}
    </section>
  );
}

function ComparisonMetric({ icon: Icon, label, value, isWinner }) {
  return (
    <div
      className={`rounded-2xl p-4 ${isWinner ? "border border-emerald-200 bg-emerald-50" : "bg-slate-50"}`}
    >
      <div className="mb-3 inline-flex rounded-xl bg-white p-2 text-sky-700 shadow-sm">
        <Icon size={18} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 text-lg font-bold ${isWinner ? "text-emerald-700" : "text-slate-900"}`}
      >
        {value}
      </p>
      {isWinner ? (
        <p className="mt-2 text-xs font-semibold text-emerald-700">
          Valore migliore nel confronto
        </p>
      ) : null}
    </div>
  );
}

function ComparisonLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function getHigherTemperatureWinner(cityResult, otherCityResult) {
  const cityTemperature = cityResult.data.weather?.current?.temperature;
  const otherCityTemperature =
    otherCityResult?.data?.weather?.current?.temperature;

  if (cityTemperature == null || otherCityTemperature == null) {
    return null;
  }

  if (cityTemperature > otherCityTemperature) {
    return cityResult.city.name;
  }

  if (otherCityTemperature > cityTemperature) {
    return otherCityResult.city.name;
  }

  return null;
}

function getLowerAqiWinner(cityResult, otherCityResult) {
  const cityAqi = cityResult.data.airQuality?.current?.usAqi;
  const otherCityAqi = otherCityResult?.data?.airQuality?.current?.usAqi;

  if (cityAqi == null || otherCityAqi == null) {
    return null;
  }

  if (cityAqi < otherCityAqi) {
    return cityResult.city.name;
  }

  if (otherCityAqi < cityAqi) {
    return otherCityResult.city.name;
  }

  return null;
}

function getCalmestSeaWinner(cityResult, otherCityResult) {
  const cityWaveHeight = cityResult.data.marine?.current?.waveHeight;
  const otherCityWaveHeight =
    otherCityResult?.data?.marine?.current?.waveHeight;

  if (cityWaveHeight == null || otherCityWaveHeight == null) {
    return null;
  }

  if (cityWaveHeight < otherCityWaveHeight) {
    return cityResult.city.name;
  }

  if (otherCityWaveHeight < cityWaveHeight) {
    return otherCityResult.city.name;
  }

  return null;
}

function formatNumber(value, suffix) {
  if (value == null) {
    return "Non disponibile";
  }

  return `${value}${suffix ? ` ${suffix}` : ""}`;
}

function formatTime(isoString) {
  if (!isoString) {
    return "ora";
  }

  return new Date(isoString).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default CompareDashboard;
