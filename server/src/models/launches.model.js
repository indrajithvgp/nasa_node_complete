const axios = require("axios");
const launchesModel = require("./launches.mongo");
const planetsModel = require("./planets.mongo");

// const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 100;

// const launch = {
//   flightNumber: 300, //flight_number
//   mission: "Kepler Exploration X", //name
//   rocket: "Explorer IS1", //rocket.name
//   launchDate: new Date("December 23, 2030"), //date_local
//   target: "Kepler-422 b", //not applicable
//   customer: ["NASA", "SpaceX", "Google", "Boeing", "AT&T"], //payload.customer from payload
//   upcoming: true, //upcoming
//   success: true, //success
// };
// // saveLaunch(launch)
// launches.set(launch.flightNumber, launch);

async function getAllLaunches(skip, limit) {
  // return Array.from(launches.values());
  return await launchesModel
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit);
}

async function findLaunch(filter) {
  return await launchesModel.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  // return await findLaunch({ flightNumber: launchId });
  return findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesModel.findOne({}).sort("-flightNumber");
  if (!latestLaunch) { 
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  
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

async function scheduleNewLaunch() {
  const planet = await planetsModel.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error(`No matching planet found`);
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    flightNumber: newFlightNumber,
    customers: ["NASA", "SpaceX", "Google", "Boeing", "AT&T"],
  });
  await saveLaunch(newLaunch);
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
  const aborted = await launchesModel.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.ok === 1 && aborted.nModified === 1;
  // return aborted.modifiedCount === 1;
}

// function abortLaunchById(launchId){
//   const aborted = launches.get(launchId)
//   aborted.upcoming = false
//   aborted.success = false

//   return aborted
// }
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";
async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payload",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if(response.status !== 200) {
    throw new Error(`Error loading SpaceX data: ${response.status}`);
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payload"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    await saveLaunch(launch)
  }

}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if(firstLaunch){
    return;
  }else{
    await populateLaunches();
  }
}

module.exports = {
  loadLaunchData,
  abortLaunchById,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
};
