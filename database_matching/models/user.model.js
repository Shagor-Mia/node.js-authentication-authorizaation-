const mongoose = require("mongoose");
const useSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  createOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User1", useSchema);
