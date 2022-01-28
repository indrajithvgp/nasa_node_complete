const http = require("http");
require("dotenv").config({ path: "./config.env" }); // load env variables
const app = require("./app");
const {loadPlanets} = require("./models/planets.model");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose")

const MONGO_URI = process.env.MONGO_URI;
const server = http.createServer(app);

mongoose.connection.once("open",()=>{
  console.log("MongoDB connection ready")
})

mongoose.connection.on("error", (err) => {
  console.log("MongoDB error " );
  console.error(err);
});


async function startServer(){
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
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


