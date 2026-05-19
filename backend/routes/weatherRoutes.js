const express = require("express");

const {
  getAggregatedWeatherByCity,
  getWeatherComparison,
} = require("../controllers/weatherController");

const weatherRouter = express.Router();

weatherRouter.get("/weather/:city", getAggregatedWeatherByCity);
weatherRouter.get("/compare", getWeatherComparison);

module.exports = { weatherRouter };
