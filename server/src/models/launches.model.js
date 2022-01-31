const launchesModel = require('./launches.mongo')
const planetsModel = require("./planets.mongo");

const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 100


const launch = {
  flightNumber: 300,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 23, 2030"),
  target: "Kepler-422 b",
  customer: ["NASA", "SpaceX", "Google", "Boeing", "AT&T"],
  upcoming: true,
  success: true,
};
// saveLaunch(launch)
launches.set(launch.flightNumber, launch);


async function getAllLaunches() {
  // return Array.from(launches.values());
  return await launchesModel.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function existsLaunchWithId(launchId) {
  return await launchesModel.findOne({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesModel.findOne({}).sort('-flightNumber')
  if(!latestLaunch){
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  const planet = await planetsModel.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error(`No matching planet found`);
  }
  await launchesModel.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}


async function scheduleNewLaunch(){
  const newFlightNumber = await getLatestFlightNumber() + 1
  const newLaunch = Object.assign(launch, {
    success:true,
    upcoming:true,
    flightNumber:newFlightNumber,
    customers:["NASA", "SpaceX", "Google", "Boeing", "AT&T"],
  })
  await saveLaunch(newLaunch)
}

// function addNewLaunch(launch){
//   latestFlightNumber++
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       flightNumber: latestFlightNumber,
//       customers: ["ZTM", "ISRO"],
//       upcoming: true,
//       success: true,
//     })
//   );
// }

async function abortLaunchById(launchId) {
  const aborted = await launchesModel.updateOne({
    flightNumber: launchId,
  },{
    upcoming: false,
    success: false
  });
  

  return aborted.ok === 1 && aborted.nModified === 1;
  // return aborted.modifiedCount === 1;
}


// function abortLaunchById(launchId){
//   const aborted = launches.get(launchId)
//   aborted.upcoming = false
//   aborted.success = false

//   return aborted
// }

module.exports = {
  abortLaunchById,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
};
