const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const {
  getAllUser,
  getUserById,
  getUser,
  updateUser,
} = require("../controllers/user");

router.param("userId", getUserById); //middleware
router.get("/", getAllUser);
router.get("/:userId", isSignedIn, isAuthenticated, getUser); //:userId will automatically call the getUserById middleware

router.put("/:userId", isSignedIn, isAuthenticated, updateUser);

module.exports = router;
