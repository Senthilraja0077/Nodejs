const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { stringify } = require("querystring");
//---> name, email, password, confirmPassword, photo
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "Please enter your name."],
    required: true,
  },
  userName: {
    type: String,
    required: [true, "Please enter your Username."],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email."],
  },
  mobile: {
    type: String,
    required: [true, "Please enter an email."],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: 8,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpGeneratedAt: Date,
  otpExpiresAt: Date,
});
//---> PASSWORD ENCRYPTION
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
//PASSWORD DECRYPTION
userSchema.methods.comparePasswordInDb = async function (
  password,
  passwordInDb
) {
  return await bcrypt.compare(password, passwordInDb);
};
// ACTIVE USER CHECK
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

const User = mongoose.model("UsersData", userSchema);
module.exports = User;
