const express = require("express");
const orderController = require("../controllers/orderController");
const { requireSignIn } = require("../middleware/authentication");
const Auth = require("../middleware/authorization");

const router = express.Router();

router.post(
  "/placeorder",
  requireSignIn,
  Auth("buyer"),
  orderController.placeOrder
);
router.get(
  "/orderhistory",
  requireSignIn,
  Auth("buyer"),
  orderController.orderHistory
);

module.exports = router;
