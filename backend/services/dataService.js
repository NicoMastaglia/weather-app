const { getCityCoordinates } = require("../utils/cityCoordinates");
const {
  formatAirQualityLabel,
  formatChartLabel,
  formatWeatherCode,
} = require("../utils/formatters");

const cacheStore = new Map();
const pendingRequests = new Map();
const comparisonCacheStore = new Map();
const comparisonPendingRequests = new Map();
const CACHE_DURATION_IN_MS = 10 * 60 * 1000;

// Wrapper unico per tutte le chiamate esterne: aggiunge timeout e parsing JSON.
async function fetchJson(url, timeoutInMilliseconds = 10000) {
  const abortController = new AbortController();
  const timeoutId = setTimeout(
    () => abortController.abort(),
    timeoutInMilliseconds,
  );

  try {
    const response = await fetch(url, { signal: abortController.signal });

    if (!response.ok) {
      throw new Error(`Richiesta fallita con status ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

function getCacheKey(cityName) {
  return cityName.trim().toLowerCase();
}

function getCachedBundle(cityName) {
  const cacheKey = getCacheKey(cityName);
  const cachedEntry = cacheStore.get(cacheKey);

  if (!cachedEntry) {
    return null;
  }

  // La cache scade dopo 10 minuti per bilanciare freschezza dei dati e carico esterno.
  if (Date.now() - cachedEntry.createdAt > CACHE_DURATION_IN_MS) {
    cacheStore.delete(cacheKey);
    return null;
  }

  return cachedEntry.bundle;
}

function saveBundleInCache(cityName, bundle) {
  cacheStore.set(getCacheKey(cityName), {
    bundle,
    createdAt: Date.now(),
  });
}

function getComparisonCacheKey(cityNameA, cityNameB) {
  return `${getCacheKey(cityNameA)}::${getCacheKey(cityNameB)}`;
}

function getCachedComparison(cityNameA, cityNameB) {
  const cacheKey = getComparisonCacheKey(cityNameA, cityNameB);
  const cachedEntry = comparisonCacheStore.get(cacheKey);

  if (!cachedEntry) {
    return null;
  }

  if (Date.now() - cachedEntry.createdAt > CACHE_DURATION_IN_MS) {
    comparisonCacheStore.delete(cacheKey);
    return null;
  }

  return cachedEntry.bundle;
}

function saveComparisonInCache(cityNameA, cityNameB, bundle) {
  comparisonCacheStore.set(getComparisonCacheKey(cityNameA, cityNameB), {
    bundle,
    createdAt: Date.now(),
  });
}

function normalizeWeatherPayload(weatherData, cityTimezone) {
  if (!weatherData) {
    return null;
  }

  // Limito il payload alle informazioni davvero utili alla dashboard.
  const hourlyEntries =
    weatherData.hourly?.time?.slice(0, 24).map((timeString, index) => ({
      time: timeString,
      label: formatChartLabel(timeString),
      temperature: weatherData.hourly.temperature_2m?.[index] ?? null,
      humidity: weatherData.hourly.relative_humidity_2m?.[index] ?? null,
      windSpeed: weatherData.hourly.wind_speed_10m?.[index] ?? null,
      precipitationProbability:
        weatherData.hourly.precipitation_probability?.[index] ?? null,
      weatherCode: weatherData.hourly.weather_code?.[index] ?? null,
      weatherDescription: formatWeatherCode(
        weatherData.hourly.weather_code?.[index],
      ),
    })) ?? [];

  return {
    timezone: weatherData.timezone || cityTimezone,
    current: {
      time: weatherData.current?.time ?? null,
      label: formatChartLabel(weatherData.current?.time),
      temperature: weatherData.current?.temperature_2m ?? null,
      apparentTemperature: weatherData.current?.apparent_temperature ?? null,
      humidity: weatherData.current?.relative_humidity_2m ?? null,
      windSpeed: weatherData.current?.wind_speed_10m ?? null,
      windDirection: weatherData.current?.wind_direction_10m ?? null,
      weatherCode: weatherData.current?.weather_code ?? null,
      weatherDescription: formatWeatherCode(weatherData.current?.weather_code),
    },
    hourly: hourlyEntries,
  };
}

function normalizeAirQualityPayload(airQualityData, cityTimezone) {
  if (!airQualityData) {
    return null;
  }

  return {
    timezone: airQualityData.timezone || cityTimezone,
    current: {
      time: airQualityData.current?.time ?? null,
      pm2_5: airQualityData.current?.pm2_5 ?? null,
      pm10: airQualityData.current?.pm10 ?? null,
      carbonMonoxide: airQualityData.current?.carbon_monoxide ?? null,
      nitrogenDioxide: airQualityData.current?.nitrogen_dioxide ?? null,
      ozone: airQualityData.current?.ozone ?? null,
      usAqi: airQualityData.current?.us_aqi ?? null,
      label: formatAirQualityLabel(airQualityData.current?.us_aqi),
    },
    hourly:
      airQualityData.hourly?.time?.slice(0, 24).map((timeString, index) => ({
        time: timeString,
        label: formatChartLabel(timeString),
        pm2_5: airQualityData.hourly.pm2_5?.[index] ?? null,
        pm10: airQualityData.hourly.pm10?.[index] ?? null,
        usAqi: airQualityData.hourly.us_aqi?.[index] ?? null,
      })) ?? [],
  };
}

function normalizeMarinePayload(marineData, cityTimezone) {
  if (!marineData) {
    return null;
  }

  return {
    timezone: marineData.timezone || cityTimezone,
    current: {
      time: marineData.current?.time ?? null,
      waveHeight: marineData.current?.wave_height ?? null,
      seaSurfaceTemperature:
        marineData.current?.sea_surface_temperature ?? null,
      swellWaveHeight: marineData.current?.swell_wave_height ?? null,
      windWaveHeight: marineData.current?.wind_wave_height ?? null,
      waveDirection: marineData.current?.wave_direction ?? null,
    },
    hourly:
      marineData.hourly?.time?.slice(0, 24).map((timeString, index) => ({
        time: timeString,
        label: formatChartLabel(timeString),
        waveHeight: marineData.hourly.wave_height?.[index] ?? null,
        seaSurfaceTemperature:
          marineData.hourly.sea_surface_temperature?.[index] ?? null,
        swellWaveHeight: marineData.hourly.swell_wave_height?.[index] ?? null,
      })) ?? [],
  };
}

function normalizeEarthquakePayload(earthquakeData, cityTimezone) {
  if (!earthquakeData) {
    return null;
  }

  return (
    earthquakeData.features?.slice(0, 10).map((feature) => ({
      magnitude: feature.properties?.mag ?? null,
      place: feature.properties?.place ?? "Posizione non disponibile",
      time: feature.properties?.time ?? null,
      formattedTime: feature.properties?.time
        ? new Date(feature.properties.time).toLocaleString("it-IT", {
            timeZone: cityTimezone,
          })
        : null,
      depthKm: feature.geometry?.coordinates?.[2] ?? null,
      distanceKm: feature.properties?.distanceKm ?? null,
      url: feature.properties?.url ?? null,
    })) ?? []
  );
}

async function fetchWeatherData(city) {
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.searchParams.set("latitude", city.latitude);
  weatherUrl.searchParams.set("longitude", city.longitude);
  weatherUrl.searchParams.set("timezone", city.timezone);
  weatherUrl.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code",
  );
  weatherUrl.searchParams.set(
    "hourly",
    "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability,weather_code",
  );
  weatherUrl.searchParams.set("forecast_days", "2");

  return fetchJson(weatherUrl.toString());
}

async function fetchAirQualityData(city) {
  const airQualityUrl = new URL(
    "https://air-quality-api.open-meteo.com/v1/air-quality",
  );
  airQualityUrl.searchParams.set("latitude", city.latitude);
  airQualityUrl.searchParams.set("longitude", city.longitude);
  airQualityUrl.searchParams.set("timezone", city.timezone);
  airQualityUrl.searchParams.set(
    "current",
    "pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone,us_aqi",
  );
  airQualityUrl.searchParams.set("hourly", "pm2_5,pm10,us_aqi");
  airQualityUrl.searchParams.set("forecast_days", "2");

  return fetchJson(airQualityUrl.toString());
}

async function fetchMarineData(city) {
  const marineUrl = new URL("https://marine-api.open-meteo.com/v1/marine");
  marineUrl.searchParams.set("latitude", city.latitude);
  marineUrl.searchParams.set("longitude", city.longitude);
  marineUrl.searchParams.set("timezone", city.timezone);
  marineUrl.searchParams.set(
    "current",
    "wave_height,sea_surface_temperature,swell_wave_height,wind_wave_height,wave_direction",
  );
  marineUrl.searchParams.set(
    "hourly",
    "wave_height,sea_surface_temperature,swell_wave_height",
  );
  marineUrl.searchParams.set("forecast_days", "2");

  return fetchJson(marineUrl.toString());
}

async function fetchEarthquakeData(city) {
  const earthquakeUrl = new URL(
    "https://earthquake.usgs.gov/fdsnws/event/1/query",
  );
  earthquakeUrl.searchParams.set("format", "geojson");
  earthquakeUrl.searchParams.set("latitude", city.latitude);
  earthquakeUrl.searchParams.set("longitude", city.longitude);
  earthquakeUrl.searchParams.set("maxradiuskm", "250");
  earthquakeUrl.searchParams.set("orderby", "time");
  earthquakeUrl.searchParams.set("minmagnitude", "1.5");
  earthquakeUrl.searchParams.set(
    "starttime",
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  );
  earthquakeUrl.searchParams.set("endtime", new Date().toISOString());

  return fetchJson(earthquakeUrl.toString());
}

async function getWeatherBundleByCity(cityName) {
  const cachedBundle = getCachedBundle(cityName);

  if (cachedBundle) {
    return cachedBundle;
  }

  const cacheKey = getCacheKey(cityName);

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const pendingRequest = (async () => {
    const city = getCityCoordinates(cityName);

    // Ogni fonte dati viene interrogata in parallelo: se una fallisce, le altre restano valide.
    const [weatherResult, airQualityResult, marineResult, earthquakeResult] =
      await Promise.allSettled([
        fetchWeatherData(city),
        fetchAirQualityData(city),
        fetchMarineData(city),
        fetchEarthquakeData(city),
      ]);

    const aggregatedWeather = {
      success: true,
      city: {
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
      },
      updatedAt: new Date().toISOString(),
      data: {
        // Degradazione controllata: ogni nodo può diventare null senza bloccare la risposta.
        weather: normalizeWeatherPayload(
          weatherResult.status === "fulfilled" ? weatherResult.value : null,
          city.timezone,
        ),
        airQuality: normalizeAirQualityPayload(
          airQualityResult.status === "fulfilled"
            ? airQualityResult.value
            : null,
          city.timezone,
        ),
        marine: normalizeMarinePayload(
          marineResult.status === "fulfilled" ? marineResult.value : null,
          city.timezone,
        ),
        earthquakes: normalizeEarthquakePayload(
          earthquakeResult.status === "fulfilled"
            ? earthquakeResult.value
            : null,
          city.timezone,
        ),
      },
      rawStatus: {
        weather: weatherResult.status,
        airQuality: airQualityResult.status,
        marine: marineResult.status,
        earthquakes: earthquakeResult.status,
      },
    };

    saveBundleInCache(cityName, aggregatedWeather);
    return aggregatedWeather;
  })();

  pendingRequests.set(cacheKey, pendingRequest);

  try {
    return await pendingRequest;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

async function getWeatherComparisonByCities(cityNameA, cityNameB) {
  const cachedComparison = getCachedComparison(cityNameA, cityNameB);

  if (cachedComparison) {
    return cachedComparison;
  }

  const comparisonCacheKey = getComparisonCacheKey(cityNameA, cityNameB);

  if (comparisonPendingRequests.has(comparisonCacheKey)) {
    return comparisonPendingRequests.get(comparisonCacheKey);
  }

  const comparisonRequest = (async () => {
    const [firstCityResult, secondCityResult] = await Promise.allSettled([
      getWeatherBundleByCity(cityNameA),
      getWeatherBundleByCity(cityNameB),
    ]);

    const comparisonResult = {
      success: true,
      updatedAt: new Date().toISOString(),
      cities: [
        buildComparisonCityResult(cityNameA, firstCityResult),
        buildComparisonCityResult(cityNameB, secondCityResult),
      ],
    };

    const firstCityIsSuccessful = comparisonResult.cities[0].success;
    const secondCityIsSuccessful = comparisonResult.cities[1].success;

    // La risposta combinata viene cache-ata solo quando entrambi i lati sono validi.
    if (firstCityIsSuccessful && secondCityIsSuccessful) {
      saveComparisonInCache(cityNameA, cityNameB, comparisonResult);
    }

    return comparisonResult;
  })();

  comparisonPendingRequests.set(comparisonCacheKey, comparisonRequest);

  try {
    return await comparisonRequest;
  } finally {
    comparisonPendingRequests.delete(comparisonCacheKey);
  }
}

function buildComparisonCityResult(cityName, settledResult) {
  if (settledResult.status === "fulfilled") {
    return {
      success: true,
      city: settledResult.value.city,
      updatedAt: settledResult.value.updatedAt,
      data: settledResult.value.data,
      rawStatus: settledResult.value.rawStatus,
    };
  }

  return {
    success: false,
    city: { name: cityName },
    error:
      settledResult.reason?.message || "Dati non disponibili per questa città",
    data: null,
  };
}

module.exports = {
  getWeatherBundleByCity,
  getWeatherComparisonByCities,
};
