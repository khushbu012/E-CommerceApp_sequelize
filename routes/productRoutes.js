const express = require("express");
const productController = require("../controllers/productController");
const Auth = require("../middleware/authorization");
const { requireSignIn } = require("../middleware/authentication");
const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  Auth("seller"),
  productController.createProduct
);
router.get(
  "/get-allproducts",
  requireSignIn,
  Auth("seller"),
  productController.getAllProducts
);
router.get(
  "/get-productbyId/:id",
  requireSignIn,
  Auth("seller"),
  productController.getProductById
);
router.put(
  "/update-product/:id",
  requireSignIn,
  Auth("seller"),
  productController.updateProduct
);
router.delete(
  "/delete-product/:id",
  requireSignIn,
  Auth("seller"),
  productController.deleteProduct
);

module.exports = router;
