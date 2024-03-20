const globalRepo = require("./../CommonRepository/CRUDOperations");
const localRepo = require("./productsRepository");
const productsDetails = require("./../Models/productsModel");
//---->  CREATE DOCUMENT -POST
const createProductsDetails = async (data) => {
  var createData = await globalRepo.createData(productsDetails, data);
  return createData;
};
//----> GET ALL DATA
const getAllProductDetails = async (query) => {
  var findData = localRepo.getAllData(productsDetails, query);
  const query_data = await findData;
  return query_data;
};
// GET LIMITED FOR USERS
const getLimitFields = async (query) => {
  var findData = localRepo.findData(productsDetails, query);
  const query_data = await findData;
  return query_data;
};
//----> UPDATE BY ID
const updateOne = async (id, data) => {
  var updateData = await globalRepo.updateData(productsDetails, id, data);
  return updateData;
};
//DELETE BY ID
const deleteOne = async (id) => {
  var deleteData = await globalRepo.deleteData(productsDetails, id);
  return deleteData;
};
module.exports = {
  createProductsDetails,
  getAllProductDetails,
  getLimitFields,
  updateOne,
  deleteOne,
};
