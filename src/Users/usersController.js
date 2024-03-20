//----> SERVICE MODULE CONNECTION
const users_data = require("./usersService");
const express = require("express");
const app = express();
//----> ERROR HANDLER CONNECTION
const GlobalErrorHandler = require("../ErrorHandlers/GlobalErrorHandler");
const CustomError = require("../ErrorHandlers/CustomErrorHandler");
const localDb = require("../Models/usersModel");
const verificationDb = require("./../Models/verificationModel");
//----> JSONWEBTOKEN
const jwt = require("jsonwebtoken");
const util = require("util");
const sendEmail = require("../CommonRepository/EmailOperation");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { captureRejectionSymbol } = require("events");
//----> SIGN IN TOKEN GENERATION
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};
//----> COMMON RESPONSE
const createSendResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });

  return token;
};
//----> FILTERING REQUEST OBJECT -used in update by himself -upadte me
const filterReqObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};
//---->OTP GENERATION
const otpGeneration = async (req, res, id, next) => {
  var email = req.body.email;
  if (email === "") {
    res.status(400).json({
      status: "fail",
      message: "Empty input fields",
    });
  }
  const checkOtpData = await verificationDb.findOne({ accountMail: email });
  if (checkOtpData != null) {
    const err = new CustomError(
      "Otp already send to mail please check ,before it expires"
    );
    next(err);
  } else {
    try {
      // OTP GENERATION
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      // ENCRYPT OTP
      const saltRounds = 10;
      const hashOTP = await bcrypt.hash(otp, saltRounds);
      // SAVE TO DATABASE
      const otpRecord = await verificationDb.create({
        accountMail: email,
        keyType: "otp",
        keyValue: hashOTP,
        createdAt: Date.now(),
        expiredAt: Date.now() + 1 * 60 * 1000,
      });

      // SEND OTP TO USERS MAIL
      await sendEmail({
        email: email,
        subject: "verify your email",
        message: `Enter ${otp} in the app to verify email`,
      });
      //RESPONSE

      res.status(200).json({
        status: "success",
        message: "Verification otp sent to the email",
      });
    } catch (err) {
      return next(err);
    }
  }
};
// VERIFY OTP
const verifyOTP = async (req, res, next) => {
  try {
    var email = req.body.email;
    var otp = req.body.otp;
    // console.log("username and otp -->", email, otp);
    if (email == "" || otp == "") {
      var err = new CustomError("Empty details not allowed");
      return next(err);
    }
    const verificationRecord = await verificationDb.findOne({
      accountMail: email,
    });
    const userRecord = await localDb.findOne({ email: email });
    // console.log(verificationRecord);
    if (verificationRecord === null) {
      // NO RECORD FOUND WITH USERNAME FOR OTP VERIFICATION
      var err = new CustomError(
        "Account record doesn't exit or has been verified already.Please signup or login"
      );
      return next(err);
    } else {
      //USER OTP RECORD EXITS
      const hashOTP = verificationRecord.keyValue;
      if (verificationRecord.expiredAt < Date.now()) {
        // OTP EXPIRED
        const err = new CustomError("OTP has expired , Please request again");
        verificationRecord.activeStatus = false;
        verificationRecord.save();
        const deleteRecord = await verificationDb.deleteOne({
          accountMail: email,
        });
        return next(err);
      } else {
        const validOTP = await bcrypt.compare(otp, hashOTP);

        if (!validOTP) {
          //INVALID OTP
          const err = new CustomError("Invalid OTP,Please recheck");
          return next(err);
        } else {
          //SUCCESS
          userRecord.verified = true;
          verificationRecord.activeStatus = false;
          await userRecord.save();
          await verificationRecord.save();
          const deleteRecord = await verificationDb.deleteOne({
            accountMail: email,
          });
          res.status(200).json({
            status: "success",
            message: "verified successfully",
          });
        }
      }
    }
  } catch (err) {
    next(err);
  }
};
// RESEND OTP
const resendOTP = async (req, res, next) => {
  try {
    // var userName = req.body.email;
    var email = req.body.email;
    if (!email) {
      var err = new CustomError("Empty details are not allowed");
      return next(err);
    } else {
      //DELETE EXISTING RECORD AND SEND AGAIN
      otpGeneration(req, res, next);
    }
  } catch (err) {
    return next(err);
  }
};
//----> SIGNUP
const signup = async (req, res, next) => {
  const response = await users_data.create(req.body);

  if (response.status === "success") {
    otpGeneration(req, res, response.data._id, next);
  } else {
    next(response);
  }
};
//----> LOGIN
const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  // Check if email and pass present in body
  if (!email || !password) {
    const error = new CustomError(
      "Please provide email id and password for login !"
    );
    return next(error);
  }
  // check user already exit or not
  const user = await users_data.findOne({ email });
  if (user.data === null) {
    const err = new CustomError("Incorrect email ", 400);
    return next(err);
  }
  const isMatch = await user.data.comparePasswordInDb(
    password,
    user.data.password
  );
  if (isMatch == false) {
    const err = new CustomError("Incorrect password", 400);
    return next(err);
  }
  createSendResponse(user.data, 201, res);
};
//----> CHECK USER LOGINED OR NOT
const protect = async (req, res, next) => {
  //1.Read the token and check if already exit
  const testToken = req.headers.authorization;

  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  if (!token) {
    const err = new CustomError("You are not loggrd in !", 401);
    next(err);
  }
  //2.Validate the token
  let decodeToken;
  try {
    decodeToken = await util.promisify(jwt.verify)(
      token,
      process.env.SECRET_STR
    );
  } catch (err) {
    next(err);
  }

  // 3.If user exits
  const user = await users_data.findById(decodeToken.id);
  if (user.data === null) {
    const error = new CustomError("The use with given token doesnt exit", 401);
    next(error);
  }
  //5.Allow user to acces the route
  req.user = user;
  // console.log("user-->", req.user);
  next();
};
//----> ROLE ACCESS
const access = (role) => {
  return (req, res, next) => {
    //console.log("role-->", req.user.data.role);
    if (req.user.data.role != "admin") {
      const err = new CustomError("Your not allow to perform this action", 403);
      next(err);
    }
    next();
  };
};
//----> FORGET PASSWORD
const forgotPassword = async (req, res, next) => {
  // 1.GET USER BASED ON POSTED EMAIL
  if (req.body.email === "") {
    return new CustomError("Empty email data", 404);
  }
  const user = await users_data.findOne({ email: req.body.email });
  if (user.data == undefined) {
    const err = new CustomError("We could not find your  given email", 404);
    next(err);
  }
  // OTP GENERATION
  try {
    otpGeneration(req, res, user.data._id, next);
  } catch (err) {
    return next(
      new CustomError(
        "There was an error sending otp, Please try again later ",
        500
      )
    );
  }
};
const updateForgotPassword = async (req, res, next) => {
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const getOldPassword = await localDb.findOne({ email }).select("+password");
  //console.log("--->", newPassword, getOldPassword);
  const validpassword = await bcrypt.compare(
    newPassword,
    getOldPassword.password
  );
  if (validpassword == true) {
    const err = new CustomError("Old and new password can't be same", 400);
    return next(err);
  }
  // 2. RESETING USER PASSWORD
  getOldPassword.password = newPassword;
  getOldPassword.save();
  // 3. LOGIN USER AUTOMATICALLY AFTER RESTING PASSWORD
  createSendResponse(getOldPassword, 201, res);
};

//----> RESET PASSWORD
const resetPassword = async (req, res, next) => {
  // 1. IF THE USER EXITS WITH THE GIVEN TOKEN & TOKEN HAS NOT EXPIRED
  const email = req.body.email;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const getOldPassword = await localDb.findOne({ email }).select("+password");
  if (newPassword === currentPassword) {
    const err = new CustomError("Old and new password can't be same", 400);
    return next(err);
  }
  const validpassword = await bcrypt.compare(
    currentPassword,
    getOldPassword.password
  );
  if (validpassword === false) {
    const err = new CustomError("Invalid current password", 400);
    return next(err);
  }
  // 2. RESETING USER PASSWORD
  getOldPassword.password = newPassword;
  getOldPassword.save();

  // 3. LOGIN USER AUTOMATICALLY AFTER RESTING PASSWORD
  createSendResponse(getOldPassword, 201, res);
};

//----> UPDATE USER DETAILS  BY SELF
const updateMe = async (req, res, next) => {
  // CHECK THE REQUEST DATA CONTAINS PASSWORD
  if (req.body.password) {
    return next(
      new CustomError("You cannot update password using this end point", 400)
    );
  }
  // UPDATE USER DETAILS
  const filterObj = filterReqObj(req.body, "name", "email");
  const user = await users_data.updateOne(req.user.data._id, filterObj);
  await user.data.save();
  res.status(200).json({
    status: "success",
    data: {
      user: user.data,
    },
  });
};
//----> DELETE USER BY SELF
const deleteMe = async (req, res, next) => {
  const user = await users_data.updateOne(req.user.data._id, { active: false });
  if (user.status === "success") {
    res.status(204).json({
      status: "success",
      data: null,
    });
  } else {
    next(user);
  }
};
//----> GET ALL DATA
const getAllUserData = async (req, res, next) => {
  const serverResponse = await users_data.find(req.query);
  if (serverResponse.status === "success" && serverResponse.data.length != 0) {
    res.status(200).json({
      Users: serverResponse,
    });
  } else if (serverResponse.data.length == 0) {
    const error = new CustomError("Page dosent exit ", 404);
    next(error);
  } else {
    next(serverResponse);
  }
};
//----> UPDATE DATA
const updateExitingUserData = async (req, res, next) => {
  const response = await users_data.updateOne(req.params.id, req.body);
  if (response.status == "success" && response.data != null) {
    res.status(200).json({
      status: "success",
      data: {
        user: response.data,
      },
    });
  } else if (response.status == "undefined" && response.data == null) {
    const error = new CustomError("User with that ID is not found ", 404);
    next(error);
  } else {
    next(response);
  }
};
//----> GLOBAL ERROR HANDLING
app.use(GlobalErrorHandler);
//----> MODULE EXPORTS
module.exports = {
  otpGeneration,
  verifyOTP,
  resendOTP,
  signup,
  login,
  protect,
  access,
  updateMe,
  deleteMe,
  forgotPassword,
  updateForgotPassword,
  resetPassword,
  updateExitingUserData,
  getAllUserData,
};
