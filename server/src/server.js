const http = require("http");
require("dotenv").config({path:"./src/config.env"}); // load env variables
const app = require("./app");
const {loadPlanets} = require("./models/planets.model");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { mongoConnect } = require("./services/mongo");

// console.log(MONGO_URI, process.env); 
const server = http.createServer(app);



async function startServer(){
  await mongoConnect()
  await loadPlanets()
  server.listen(PORT, () => {
    console.log("listening on port: " + PORT);
  });
}

// async function startServer(){
//   await mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   })
// }

startServer()


