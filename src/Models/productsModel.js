const { ObjectId, Decimal128 } = require("mongodb");
const mongoose = require("mongoose");
const productsModel = new mongoose.Schema({
  productPicture: {
    type: [String],
  },
  productName: {
    type: String,
    required: true,
    unique: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  additionalInformation: {},
  //soldBy: { type: mongoose.Schema.ObjectId, ref: "UsersData" },
  price: {
    type: Decimal128,
    required: true,
  },
  productActiveStatus: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tags: [{ type: mongoose.Schema.ObjectId, ref: "Tags" }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "UsersData",
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "UsersData",
  },
});
const Products = mongoose.model("Products", productsModel);
module.exports = Products;
