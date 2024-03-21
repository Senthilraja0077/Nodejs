const express = require("express");
const router = express.Router();
const usersDataController = require("./usersController");
// OTP VERIFICATION
router.post("/otpGeneration", usersDataController.otpGeneration);

router.post("/otp-verify", usersDataController.verifyOTP);
router.post("/resend-otp", usersDataController.resendOTP);
//----> ROUTE HANDLER FUNCTION CALL
router.post("/users/signup", usersDataController.signup);
router.post("/users/login", usersDataController.login);
router.post("/forgotPassword", usersDataController.forgotPassword);
router.patch("/updateForgotPassword", usersDataController.updateForgotPassword);
router.patch("/restPassword", usersDataController.resetPassword);
router.patch(
  "/updateDetails",
  usersDataController.protect,
  usersDataController.updateMe
);
router.get(
  "/users/list",
  usersDataController.protect,
  usersDataController.getAllUserData
);
router.patch(
  "/users/:id",
  usersDataController.protect,
  usersDataController.access("admin"),
  usersDataController.updateExitingUserData
);
router.delete(
  "/deleteDetails",
  usersDataController.protect,
  usersDataController.deleteMe
);
module.exports = router;
