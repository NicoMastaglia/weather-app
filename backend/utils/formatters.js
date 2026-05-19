function formatWeatherCode(weatherCode) {
  const weatherDescriptions = {
    0: "Sereno",
    1: "Prevalentemente sereno",
    2: "Parzialmente nuvoloso",
    3: "Coperto",
    45: "Nebbioso",
    48: "Brina e nebbia",
    51: "Pioviggine leggera",
    53: "Pioviggine moderata",
    55: "Pioviggine intensa",
    56: "Pioviggine gelata leggera",
    57: "Pioviggine gelata intensa",
    61: "Pioggia debole",
    63: "Pioggia moderata",
    65: "Pioggia forte",
    66: "Pioggia gelata leggera",
    67: "Pioggia gelata intensa",
    71: "Neve debole",
    73: "Neve moderata",
    75: "Neve forte",
    77: "Granuli di neve",
    80: "Rovesci deboli",
    81: "Rovesci moderati",
    82: "Rovesci violenti",
    85: "Rovesci di neve deboli",
    86: "Rovesci di neve forti",
    95: "Temporale",
    96: "Temporale con grandine debole",
    99: "Temporale con grandine forte",
  };

  return weatherDescriptions[weatherCode] || "Dato meteo non classificato";
}

function formatAirQualityLabel(aqiValue) {
  if (aqiValue == null) {
    return "Non disponibile";
  }

  if (aqiValue <= 50) {
    return "Buono";
  }

  if (aqiValue <= 100) {
    return "Moderato";
  }

  if (aqiValue <= 150) {
    return "Scadente per gruppi sensibili";
  }

  if (aqiValue <= 200) {
    return "Scadente";
  }

  if (aqiValue <= 300) {
    return "Molto scadente";
  }

  return "Pericoloso";
}

function formatChartLabel(timeString) {
  return timeString ? timeString.slice(11, 16) : "--:--";
}

module.exports = {
  formatAirQualityLabel,
  formatChartLabel,
  formatWeatherCode,
};
