const tagModel = require("./../Models/tagsModel");
const localRepo = require("./tagsRepository");
// SHOW LIMITED FIELDS FOR USER BUT ----NOT VALID
const getLimitFields = async (query) => {
  var findData = localRepo.findData(tagModel, query);
  const query_data = await findData;
  return query_data;
};
module.exports = { getLimitFields };
