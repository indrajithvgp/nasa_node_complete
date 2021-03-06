const planetsModel = require("./planets.mongo.js");
const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanets() {
  return new Promise(function (resolve, reject) {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data/kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await planetsModel.create({
            keplerName: data["kepler_name"], 
          });
          // habitablePlanets.push(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", () => {
        // console.log(
        //   habitablePlanets.map((planet) => {
        //     return planet["kepler_name"];
        //   })
        // );
        // console.log(`${habitablePlanets.length} habitable planets found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planetsModel.find({});
  // return await planets.updateOne({
  //   keplerName:""
  // }, {
  //   keplerName:"HH"
  // }, {
  //   upsert:true
  // });
  // return planets.find({
  //   keplerName: 'Kepler-62F',

  // }, '-keplerName')
  // return habitablePlanets
}

module.exports = {
  loadPlanets,
  getAllPlanets: getAllPlanets,
};
