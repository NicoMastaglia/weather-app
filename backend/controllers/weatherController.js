const {
  getWeatherBundleByCity,
  getWeatherComparisonByCities,
} = require("../services/dataService");

async function getAggregatedWeatherByCity(request, response, next) {
  try {
    const { city } = request.params;
    const aggregatedWeather = await getWeatherBundleByCity(city);

    response.json(aggregatedWeather);
  } catch (error) {
    next(error);
  }
}

async function getWeatherComparison(request, response, next) {
  try {
    const { city1, city2 } = request.query;

    if (!city1 || !city2) {
      return response.status(400).json({
        success: false,
        message: "Parametri city1 e city2 obbligatori",
      });
    }

    const comparison = await getWeatherComparisonByCities(city1, city2);

    response.json(comparison);
  } catch (error) {
    next(error);
  }
}

module.exports = { getAggregatedWeatherByCity, getWeatherComparison };
