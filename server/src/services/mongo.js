
const mongoose = require('mongoose');
// require("dotenv").config({ path: "../config.env" });

// const MONGO_URI = process.env.MONGO_URI;
// console.log(MONGO_URI)

//BUG: this is a test file, do not run it in production

let MONGO_URI =
  "mongodb+srv://Indrajith:7HdCyR6bKjBNxZw6@hackrio-rev.350go.mongodb.net/NASA";
  //BUG: this is a test file, do not run it in production

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB error ");
  console.error(err);
});

async function mongoConnect(){
    await mongoose.connect(
    MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};