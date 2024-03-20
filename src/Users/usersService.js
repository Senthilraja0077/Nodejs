const mongoose = require("mongoose");
//----> GLOBAL REPOSITORY FOR CRUD OPRATIONS
const userDb = require("../CommonRepository/CRUDOperations");
//----> LOCAL REPOSITORY FOR AGGREGATIONS
const localRepo = require("./usersRepository");
//--> USERS SCHEMA MODEL
const UsersDetails = require("../Models/usersModel");
//----> FIND ALL DOCUMENT  -GET USING QUERY
const find = async (query) => {
  var findData = userDb.findData(UsersDetails, query);
  const query_data = await findData;
  return query_data;
};
//----> FIND ONE DOCUMENT BY ID -GET/ID
const findOne = async (email) => {
  var findOndeData = await localRepo.findOne(UsersDetails, email);
  return findOndeData;
};

//----> FIND BY ID IN REQUEST BODY
const findById = async (id) => {
  var findeddata = await localRepo.findById(UsersDetails, id);
  return findeddata;
};
//---->  CREATE DOCUMENT -POST
const create = async (data) => {
  var createData = await userDb.createData(UsersDetails, data);
  return createData;
};
//----> UPDATE ONE -->ACTIVE SET -TRUE / FALSE
const updateOne = async (id, data) => {
  var updateData = await userDb.updateData(UsersDetails, id, data);
  return updateData;
};
module.exports = {
  create,
  find,
  findOne,
  findById,
  updateOne,
};
