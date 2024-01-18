const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config();
require("./config/database");
require("./config/passport");

const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB,
      collectionName: "session01",
    }),
    // cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index");
});

//register
app.get("/register", (req, res) => {
  res.render("register");
});
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
      await newUser.save();
      res.status(201).redirect("/login");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const checkedLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  next();
};

//login
app.get("/login", checkedLoggedIn, (req, res) => {
  res.render("login");
});
// app.post("/login", (req, res) => {
//   try {
//     res.status(200).send("user logged in.");
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  })
);

const checkedAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
//profile
app.get("/profile", checkedAuthenticated, (req, res) => {
  res.render("profile");
});
//logout
app.get("/logout", (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;
