require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Passport_local is connected to mongoDB");
  })
  .catch((error) => console.log("connection failed"));
