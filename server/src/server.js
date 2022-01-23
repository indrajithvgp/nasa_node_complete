const http = require("http");
require("dotenv").config({ path: "./config.env" }); // load env variables
const app = require("./app");
const {loadPlanets} = require("./models/planets.model");
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function startServer(){
  await loadPlanets()
  server.listen(PORT, () => {
    console.log("listening on port: " + PORT);
  });
}

startServer()


