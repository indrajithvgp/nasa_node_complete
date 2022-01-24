const { getAllPlanets } = require("../../models/planets.model");

const planets = []

const httpGetAllPlanets = (req, res) => {
  return res.status(201).json(getAllPlanets())
}

module.exports = {
  httpGetAllPlanets,
};