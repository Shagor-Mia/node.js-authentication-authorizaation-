require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("JWT is connected to mongoDB");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
