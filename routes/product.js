const router = require("express").Router();
const {
  getProductById,
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// middlewares
router.param("userId", getUserById);
router.param("productId", getProductById);

// routes
router.get("/getProduct/:productId", getProduct);
router.get("/allproducts", getAllProducts);

router.post(
  "/createProduct/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

router.delete(
  "/deleteProduct/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

router.put(
  "/updateProduct/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

module.exports = router;
