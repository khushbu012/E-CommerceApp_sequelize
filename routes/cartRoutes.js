const express = require("express");
const cartController = require("../controllers/cartController");
const { requireSignIn } = require("../middleware/authentication");
const Auth = require("../middleware/authorization");
const router = express.Router();

router.post(
  "/addtocart",
  requireSignIn,
  Auth("buyer"),
  cartController.addToCart
);
router.get(
  "/get-allproducts",
  requireSignIn,
  Auth("buyer"),
  cartController.getCartProducts
);
router.put(
  "/get-manageproducts",
  requireSignIn,
  Auth("buyer"),
  cartController.manageCartItems
);
router.delete(
  "/delete-product-fromcart",
  requireSignIn,
  Auth("buyer"),
  cartController.deleteItem
);

module.exports = router;
