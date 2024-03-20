const { raw } = require("express");
const { Long } = require("mongodb");

const findData = async (query, queryStr) => {
  try {
    const excludedFields = ["sort", "page", "limit", "fields"];
    const queryObj = { ...queryStr };
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });
    //----> FILTERING ,SORTING,FIELDS,PAGINATION
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const queryobj2 = JSON.parse(queryString);
    const pageData = queryStr.page * 1 || 1;
    const limitData = queryStr.limit * 1 || 10;
    const skip = (pageData - 1) * limitData;

    var userData = query.find(queryobj2, queryStr.fields, {
      skip: skip,
      limit: limitData,
      sort: queryStr.sort,
    });
    //.populate({ path: "tags", select: ["title", "description"] });
    var response = await userData;
    return { status: "success", data: response };
  } catch (err) {
    return { status: "fail", message: err.message };
  }
};

//----> FIND ONE USER BY ID
const findOneData = async (query, id) => {
  try {
    const findOneData = await query.findById(id);
    return { status: "success", data: findOneData };
  } catch (err) {
    return err;
  }
};
//----> CREATE USER DATA
const createData = async (query, data) => {
  try {
    const createdData = await query.create(data);
    return { status: "success", data: createdData };
  } catch (err) {
    return err;
  }
};
//----> UPDATE USER RECORD
const updateData = async (query, id, data) => {
  try {
    const updateData = await query.findByIdAndUpdate(id, data, {
      new: true, //----> RETURN THE UPDATED DATA
      runValidators: true,
    });
    if (updateData == null) {
      return { status: "undefined", data: null };
    }
    return { status: "success", data: updateData };
  } catch (err) {
    return err;
  }
};
//----> DELETE USER DATA
const deleteData = async (query, id) => {
  try {
    const deleteData = await query.findByIdAndDelete(id);
    if (deleteData == null) {
      return { status: "undefined", data: null };
    }
    return {
      status: "success",
      message: "User Data deleted",
      data: deleteData,
    };
  } catch (err) {
    return err;
  }
};
module.exports = { findData, findOneData, createData, updateData, deleteData };
