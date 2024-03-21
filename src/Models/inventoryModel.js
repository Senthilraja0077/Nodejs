const mongoose = require("mongoose");
const inventoryModel = new mongoose.Schema({
  product: { type: String, required: true, unique: true },
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
