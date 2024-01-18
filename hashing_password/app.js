require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const md5 = require("md5");

// console.log(md5("hello"));

const User = require("./models/user.model");
const app = express();
const PORT = process.env.PORT || 3000;
const DB = process.env.DB_URL;

mongoose
  .connect(DB)
  .then(() => {
    console.log("mongoDB atlas connected.");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/./views/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: md5(req.body.password),
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = md5(req.body.password);
    const user = await User.findOne({ email: email });
    if (user && user.password === password) {
      res.status(200).json({ status: "valid user." });
    } else {
      res.status(404).json({ status: " not a valid user!" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});
// routing errors:
app.use("*", (req, res, next) => {
  res.status(404).json({ message: "route not found!" });
  next();
});
//server errors:
app.use((err, req, res, next) => {
  res.status(500).json({ message: "something broke!" });
  next();
});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
