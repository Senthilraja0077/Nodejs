const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const inventoryModel = new mongoose.Schema({
  productId: { type: ObjectId },
  quantity: { type: Number, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: "UsersData" },
  updatedAt: Date,
  updatedBy: { type: mongoose.Schema.ObjectId, ref: "UsersData" },
  activeStatus: { type: Boolean, default: true },
});
const Inventory = mongoose.model("Inventory", inventoryModel);
module.exports = Inventory;
