const launches = new Map();

const launch = {
  flightNumber: 300,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 23, 2030"),
  detination: "Kepler-422 b",
  customer: ["NASA", "SpaceX", "Google", "Boeing", "AT&T"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

module.exports = { launches };
