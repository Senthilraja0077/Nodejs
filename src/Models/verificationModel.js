const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const verificationModel = new mongoose.Schema({
  accountMail: { type: String },
  keyType: {
    type: String,
    require: true,
    enum: ["otp", "token"],
  },
  keyValue: {
    type: String,
    require: true,
  },
  activeStatus: { type: Boolean, default: true },
  createdAt: { type: Date },
  expiredAt: { type: Date },
});
const KeyVerification = mongoose.model("KeyVerification", verificationModel);
module.exports = KeyVerification;
