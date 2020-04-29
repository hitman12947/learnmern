const express = require("express");
const router = express.Router();
const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

const {
  deleteCategory,
  getCategoryById,
  addCategory,
  updateCategory,
  getAllCategories,
  getCategory,
} = require("../controllers/category");

router.param("categoryId", getCategoryById);
router.param("userId", getUserById);

// All checked

router.post(
  "/addcategory/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  addCategory
);
router.get("/categories", getAllCategories);
router.get("/:categoryId", getCategory);
router.put("/:categoryId", isSignedIn, isAdmin, updateCategory);

router.delete("/:categoryId", isSignedIn, isAdmin, deleteCategory);

module.exports = router;
