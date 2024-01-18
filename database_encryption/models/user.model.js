const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");

const userSchema = new mongoose.Schema({
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

var encKey = process.env.ENC_KEY;

userSchema.plugin(encrypt, {
  secret: encKey,
  encryptedFields: ["password"],
});

module.exports = mongoose.model("User2", userSchema);
