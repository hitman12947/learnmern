const mongoose = require("mongoose");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const signin = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    res.status(422).json({
      error: errors.array().map((err) => {
        console.log(err);
        return err.msg;
      }),
    });
  }

  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      console.log(user);
      if (user === null || !user.authenticate(password)) {
        return res.status(401).json({
          error: "Email and password did not match",
        });
      }

      // token create

      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.SECRET
      );

      // cookie

      res.cookie("token", token, { expire: new Date() + 9999 });

      const { _id, name, email, role } = user;
      res.status(200).json({
        token,
        user: {
          _id,
          name,
          email,
          role,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    });
};

const signout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Sign out",
  });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    res.status(422).json({
      error: errors.array().map((err) => {
        console.log(err);
        return err.msg;
      }),
    });
  }
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  user
    .save()
    .then((u) => res.status(201).json(u))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

const isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

const isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

const isAdmin = (req, res, next) => {

  if (req.auth.role !== 1) {
    return res.status(403).json({
      error: "You are not authorized person",
    });
  }
  next();
};

module.exports = {
  signout,
  signup,
  signin,
  isAuthenticated,
  isSignedIn,
  isAdmin,
};
