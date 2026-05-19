import { useEffect, useMemo, useState } from "react";
import { Cloud, RefreshCcw } from "lucide-react";

import { cities } from "../data/cities";
import { fetchCityComparison, fetchCityWeather } from "../services/api";

import AirQualityWidget from "./AirQualityWidget";
import CompareDashboard from "./CompareDashboard";
import CompareSelector from "./CompareSelector";
import CityMap from "./CityMap";
import CurrentWeatherCard from "./CurrentWeatherCard";
import EarthquakeList from "./EarthquakeList";
import HourlyChart from "./HourlyChart";
import MarineWidget from "./MarineWidget";

function Dashboard() {
  const [selectedCity, setSelectedCity] = useState("Genova");
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [cityA, setCityA] = useState("Genova");
  const [cityB, setCityB] = useState("La Spezia");
  const [aggregatedData, setAggregatedData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);

  // La citta selezionata guida sia la mappa sia tutte le richieste al backend.
  const selectedCityCoordinates = useMemo(
    () => cities.find((city) => city.name === selectedCity) ?? cities[0],
    [selectedCity],
  );

  useEffect(() => {
    let isMounted = true;

    // Il refresh manuale e il cambio citta riattivano la stessa pipeline di caricamento.
    async function loadData() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = isCompareMode
          ? await fetchCityComparison(cityA, cityB)
          : await fetchCityWeather(selectedCity);

        if (!isMounted) {
          return;
        }

        if (isCompareMode) {
          setComparisonData(response);
          setAggregatedData(null);
        } else {
          setAggregatedData(response);
          setComparisonData(null);
        }
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(fetchError.message);
        setAggregatedData(null);
        setComparisonData(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedCity, refreshToken, isCompareMode, cityA, cityB]);

  const weatherSection = aggregatedData?.data?.weather ?? null;
  const airQualitySection = aggregatedData?.data?.airQuality ?? null;
  const marineSection = aggregatedData?.data?.marine ?? null;
  const earthquakeSection = aggregatedData?.data?.earthquakes ?? null;

  function getDifferentCityName(preferredCityName, excludedCityName) {
    if (preferredCityName !== excludedCityName) {
      return preferredCityName;
    }

    return (
      cities.find((city) => city.name !== excludedCityName)?.name ??
      preferredCityName
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="overflow-hidden rounded-[2rem] border border-white/40 bg-liguria-gradient p-6 text-white shadow-soft sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-cyan-100 backdrop-blur-sm">
                <Cloud size={16} />
                Monitoraggio ambientale in tempo reale per la Liguria
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                Meteo, aria, mare e terremoti in un'unica schermata.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-cyan-50/90 sm:text-base">
                Seleziona una città ligure dalla lista o dalla mappa e
                visualizza i dati aggregati con cache lato server, fallback
                elegante e componenti reattivi.
              </p>
            </div>

            <div className="grid gap-3 rounded-3xl bg-white/10 p-4 backdrop-blur-sm sm:grid-cols-2 lg:min-w-[360px]">
              <InfoChip
                label="Città selezionata"
                value={selectedCityCoordinates.name}
              />
              <InfoChip
                label="Coordinate"
                value={`${selectedCityCoordinates.latitude.toFixed(2)}, ${selectedCityCoordinates.longitude.toFixed(2)}`}
              />
            </div>
          </div>
        </header>

        <CompareSelector
          isCompareMode={isCompareMode}
          onToggleCompareMode={() =>
            setIsCompareMode((currentValue) => !currentValue)
          }
          cityA={cityA}
          cityB={cityB}
          onChangeCityA={(nextCity) => {
            const resolvedCityA = getDifferentCityName(nextCity, cityB);
            setCityA(resolvedCityA);

            if (resolvedCityA === cityB) {
              setCityB(getDifferentCityName(selectedCity, resolvedCityA));
            }
          }}
          onChangeCityB={(nextCity) => {
            const resolvedCityB = getDifferentCityName(nextCity, cityA);
            setCityB(resolvedCityB);

            if (resolvedCityB === cityA) {
              setCityA(getDifferentCityName(selectedCity, resolvedCityB));
            }
          }}
        />

        <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-soft backdrop-blur-sm">
            {cities.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => setSelectedCity(city.name)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  !isCompareMode && selectedCity === city.name
                    ? "bg-sky-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setRefreshToken((currentValue) => currentValue + 1)}
            className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 font-semibold text-slate-700 shadow-soft transition hover:bg-white"
          >
            <RefreshCcw size={16} />
            Ricarica dati della città
          </button>
        </section>

        {errorMessage ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-800 shadow-sm">
            {errorMessage}
          </div>
        ) : null}

        {!isCompareMode ? (
          <CityMap selectedCity={selectedCity} onSelectCity={setSelectedCity} />
        ) : null}

        {/* Ogni widget gestisce il proprio fallback quando il backend restituisce null. */}
        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-10 text-center text-slate-600 shadow-soft">
            Caricamento dei dati ambientali in corso...
          </div>
        ) : isCompareMode ? (
          <CompareDashboard
            comparisonData={comparisonData}
            cityAName={cityA}
            cityBName={cityB}
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            <CurrentWeatherCard weather={weatherSection} />
            <AirQualityWidget airQuality={airQualitySection} />
            <div className="xl:col-span-2">
              <HourlyChart hourlyWeather={weatherSection?.hourly ?? []} />
            </div>
            <MarineWidget marine={marineSection} />
            <EarthquakeList earthquakes={earthquakeSection} />
          </div>
        )}
      </div>
    </main>
  );
}

function InfoChip({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export default Dashboard;
