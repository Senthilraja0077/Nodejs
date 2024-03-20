const globalRepo = require("./../CommonRepository/CRUDOperations");
const tagModel = require("./../Models/tagsModel");
const tagService = require("./tagsService");
const GlobalErrorHandler = require("../ErrorHandlers/GlobalErrorHandler");
const CustomError = require("../ErrorHandlers/CustomErrorHandler");
const createSendResponse = (data, statusCode, res) => {
  res.status(statusCode).json({
    status: "success",
    data,
  });
};
const addTags = async (req, res, next) => {
  req.body.createdBy = req.user.data._id;
  const response = await globalRepo.createData(tagModel, req.body);
  if (response.status === "success") {
    createSendResponse(response.data, 201, res);
  } else {
    next(response);
  }
};
const getTags = async (req, res, next) => {
  // IF ROLE IS ADMIN
  if (req.user.data.role == "admin") {
    const serverResponse = await globalRepo.findData(tagModel, req.query);
    if (
      serverResponse.status === "success" &&
      serverResponse.data.length != 0
    ) {
      res.status(200).json({
        Users: serverResponse,
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
    const serverResponse = await tagService.getLimitFields(req.query);
    if (
      serverResponse.status === "success" &&
      serverResponse.data.length != 0
    ) {
      res.status(200).json({
        Tags: serverResponse,
      });
    } else if (serverResponse.data.length == 0) {
      const error = new CustomError("Page dosent exit ", 404);
      next(error);
    } else {
      next(serverResponse);
    }
  }
};
const updateTags = async (req, res, next) => {
  const response = await globalRepo.updateData(
    tagModel,
    req.params.id,
    req.body
  );
  if (response.status == "success" && response.data != null) {
    res.status(200).json({
      status: "success",
      data: {
        user: response.data,
      },
    });
  } else if (response.status == "undefined" && response.data == null) {
    const error = new CustomError("Tag with that ID is not found ", 404);
    next(error);
  } else {
    next(response);
  }
};
const deleteTags = async (req, res, next) => {
  const response = await globalRepo.deleteData(tagModel, req.params.id);
  if (response.status == "success") {
    console.log("Data deleted succeeefully");
    res.status(202).json({
      status: "success",
      message: "Tags data deleted successfully",
    });
  } else {
    res.status(404).json({
      status: "fail",
      user: response.message,
    });
  }
};
module.exports = { addTags, getTags, updateTags, deleteTags };
