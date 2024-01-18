const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const passport = require("passport");
require("./config/user.database");
require("dotenv").config();
require("./config/user.passport");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.status(200).send("<h1>this is server.</h1>");
});

// register:
app.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).send("user already exist!");
    }
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      const newUser = new User({
        username: req.body.username,
        password: hash,
      });
      await newUser
        .save()
        .then((user) => {
          res.send({
            success: true,
            message: "User is created successfully.",
            user: {
              id: user._id,
              username: user.username,
            },
          });
        })
        .catch((err) => {
          res.send({
            success: false,
            message: "User is not created.",
            error: err,
          });
        });
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// login:
app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(401).send({
      success: false,
      message: "user not found!",
    });
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).send({
      success: false,
      message: "incorrect password!",
    });
  }

  const payload = {
    id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "2d",
  });
  return res.status(200).send({
    success: true,
    message: "login successful.",
    token: "Bearer " + token,
  });
});
//profile:
app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    return res.status(200).send({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
      },
    });
  }
);

//route errors:
app.use((req, res, next) => {
  res.status(404).json({ message: "route not found." });
  next();
});

//server errors:
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "server not found." });
  next();
});

module.exports = app;
