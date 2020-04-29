const express = require("express");
const router = express.Router();
const User = require("../models/user");

const { signout, signup, signin } = require("../controllers/auth");

const { check } = require("express-validator");

const signupCheck = [
  check("name")
    .isLength({ min: 3 })
    .withMessage("Name should be of minimun 3 chars"),
  check("email", "Email is required").isEmail(),
  check("password", "Password length should be minumux of 6 chars").isLength({
    min: 3,
  }),
];

const signinCheck = [
  check("email", "Email is required").isEmail(),
  check("password", "Password length should be minumux of 6 chars").isLength({
    min: 3,
  }),
];

router.get("/signout", signout);
router.post("/signup", signupCheck, signup);
router.post("/signin", signinCheck, signin);

module.exports = router;
