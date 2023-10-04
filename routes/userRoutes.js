const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const clearCache = require("../middleware/clearCache");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
// router.route("/myDeals").get(authController.protect, userController.getMyDeals);
router
  .route("/busytime/:id")
  .get(authController.protect, userController.busyTime);
router.route("/:id").get(userController.getUser);

router.delete("/deleteMe", authController.protect, userController.deleteMe);

module.exports = router;
