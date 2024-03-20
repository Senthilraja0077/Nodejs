const express = require("express");
const app = express();
//----> SERVICE MODULE CONNECTION
const productsData = require("./productsService");
//----> ERROR HANDLER CONNECTION
const GlobalErrorHandler = require("../ErrorHandlers/GlobalErrorHandler");
const CustomError = require("../ErrorHandlers/CustomErrorHandler");
// COMMON RESPONSE FUNCTION
const createSendResponse = (data, statusCode, res) => {
  res.status(statusCode).json({
    status: "success",
    data,
  });
};
// ADD PRODUCTS
const addProducts = async (req, res, next) => {
  req.body.createdBy = req.user.data._id;
  const response = await productsData.createProductsDetails(req.body);
  if (response.status === "success") {
    createSendResponse(response.data, 201, res);
  } else {
    next(response);
  }
};
// GET ALL PRODUCTS DETAILS
const getallProducts = async (req, res, next) => {
  // IF ROLE IS ADMIN
  if (req.user.data.role == "admin") {
    const serverResponse = await productsData.getAllProductDetails(req.query);
    if (
      serverResponse.status === "success" &&
      serverResponse.data.length != 0
    ) {
      res.status(200).json({
        serverResponse,
      });
    } else if (serverResponse.data.length == 0) {
      const error = new CustomError("Page dosent exit ", 404);
      next(error);
    } else {
      next(serverResponse);
    }
  }
  // IF ROLE IS USER OR OTHERS
  else {
    const serverResponse = await productsData.getLimitFields(req.query);
    if (
      serverResponse.status === "success" &&
      serverResponse.data.length != 0
    ) {
      res.status(200).json({
        serverResponse,
      });
    } else if (serverResponse.data.length == 0) {
      const error = new CustomError("Page dosent exit ", 404);
      next(error);
    } else {
      next(serverResponse);
    }
  }
};
// UPDATE PRODUCTS
const updateExitingUserData = async (req, res, next) => {
  req.body.updatedBy = req.user.data._id;
  const response = await productsData.updateOne(req.params.id, req.body);
  if (response.status == "success" && response.data != null) {
    res.status(200).json({
      status: "success",
      data: {
        user: response.data,
      },
    });
  } else if (response.status == "undefined" && response.data == null) {
    const error = new CustomError("Product with that ID is not found ", 404);
    next(error);
  } else {
    next(response);
  }
};
// DELETE PRODUCTS
const deleteExitngProductsData = async (req, res) => {
  const response = await productsData.deleteOne(req.params.id);
  if (response.status == "success") {
    res.status(202).json({
      status: "success",
      message: "User data deleted successfully",
    });
  } else {
    res.status(404).json({
      status: "fail",
      user: response.message,
    });
  }
};
module.exports = {
  addProducts,
  getallProducts,
  updateExitingUserData,
  deleteExitngProductsData,
};
