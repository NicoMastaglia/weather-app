export async function fetchCityWeather(cityName) {
  const response = await fetch(`/api/weather/${encodeURIComponent(cityName)}`);

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(
      errorPayload?.message || "Impossibile recuperare i dati ambientali",
    );
  }

  return response.json();
}

export async function fetchCityComparison(cityNameA, cityNameB) {
  const comparisonUrl = new URL("/api/compare", window.location.origin);
  comparisonUrl.searchParams.set("city1", cityNameA);
  comparisonUrl.searchParams.set("city2", cityNameB);

  const response = await fetch(comparisonUrl.toString());

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(
      errorPayload?.message || "Impossibile recuperare i dati di confronto",
    );
  }

  return response.json();
}
