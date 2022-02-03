// const launches = [];
const {
  getAllLaunches,
  existsLaunchWithId,
  scheduleNewLaunch,
  abortLaunchById,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

const httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
};

const httpAddNewLaunch = (req, res) => {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.launchDate ||
    !launch.rocket ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  } 

  launch.launchDate = new Date(launch.launchDate);
  // if(isNaN(launch.launchDate.toString())){
  //   return res.status(400).json({
  //     error: "Invalid launch date"
  //   })
  // }
  scheduleNewLaunch(launch);
  return res.status(201).json(launch);
};

const httpAbortLaunch = async (req , res) => {
  const launchId = Number(req.params.id);

  if (!(await existsLaunchWithId(launchId))) {
    return res.status(400).json({
      error: "Launch not found",
    });
  }
  const aborted = await abortLaunchById(launchId);
  if(! aborted){
    return res.status(400).json({
      error:"Launch not aborted"
    })
  }
  return res.status(200).json({ok:true});
}

module.exports = { 
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
