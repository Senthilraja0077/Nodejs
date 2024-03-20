const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const tagsModel = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  activeStatus: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now() },
  createdBy: { type: mongoose.Schema.ObjectId, ref: "UsersData" },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: "UsersData" },
});
const tags = mongoose.model("Tags", tagsModel);
module.exports = tags;
