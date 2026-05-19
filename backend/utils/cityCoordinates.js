const cityCoordinates = {
  genova: {
    name: "Genova",
    latitude: 44.4056,
    longitude: 8.9463,
    timezone: "Europe/Rome",
  },
  "la spezia": {
    name: "La Spezia",
    latitude: 44.1025,
    longitude: 9.8241,
    timezone: "Europe/Rome",
  },
  savona: {
    name: "Savona",
    latitude: 44.3099,
    longitude: 8.4772,
    timezone: "Europe/Rome",
  },
  imperia: {
    name: "Imperia",
    latitude: 43.8898,
    longitude: 8.0396,
    timezone: "Europe/Rome",
  },
  sanremo: {
    name: "Sanremo",
    latitude: 43.8157,
    longitude: 7.7768,
    timezone: "Europe/Rome",
  },
  rapallo: {
    name: "Rapallo",
    latitude: 44.3492,
    longitude: 9.2273,
    timezone: "Europe/Rome",
  },
};

function getCityCoordinates(cityName) {
  const normalizedCityName = cityName.trim().toLowerCase();
  const city = cityCoordinates[normalizedCityName];

  if (!city) {
    const allowedCities = Object.values(cityCoordinates).map(
      (item) => item.name,
    );
    const error = new Error(
      `Città non supportata. Valori ammessi: ${allowedCities.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }

  return city;
}

module.exports = { getCityCoordinates, cityCoordinates };
