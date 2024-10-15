const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/get-allusers", userController.getAllUser);
router.post("/register-user", userController.registerUser);
router.post("/login-user", userController.loginUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);
router.get("/get-userbyid/:id", userController.getUserById);

module.exports = router;
