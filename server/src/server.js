const http = require("http");
require("dotenv").config({ path: "./config.env" }); // load env variables
const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("listening on port: " + PORT);
});
