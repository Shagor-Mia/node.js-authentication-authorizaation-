require("dotenv").config();
const User = require("../models/user.model");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const data = await User.findOne({ id: jwt_payload.sub });

      if (!data) {
        console.log("user not found");
      }

      if (data) {
        return done(null, data);
      }
    } catch (error) {
      console.log(error);
    }
  })
);
