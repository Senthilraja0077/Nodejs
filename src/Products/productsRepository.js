// --->FILTERING QUERY OBJECTS

const filteringQuery = (queryStr) => {
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
  return queryString;
};
// GET ALL FILDES - ADMIN ROLE REQUIRED
const getAllData = async (query, queryStr) => {
  try {
    const queryString = filteringQuery(queryStr);
    const queryobj2 = JSON.parse(queryString);
    const pageData = queryStr.page * 1 || 1;
    const limitData = queryStr.limit * 1 || 10;
    const skip = (pageData - 1) * limitData;

    var data = query
      .find(queryobj2, queryStr.fields, {
        skip: skip,
        limit: limitData,
        sort: queryStr.sort,
      })
      .populate({ path: "tags", select: ["title", "description"] });
    var response = await data;
    return { status: "success", data: response };
  } catch (err) {
    return { status: "fail", message: err.message };
  }
};
// LIMING FIELDS FOR USERS
const findData = async (query, queryStr) => {
  try {
    const queryString = filteringQuery(queryStr);
    const queryobj2 = JSON.parse(queryString);
    const pageData = queryStr.page * 1 || 1;
    const limitData = queryStr.limit * 1 || 10;
    const skip = (pageData - 1) * limitData;
    var data;
    if (queryStr.fields != undefined) {
      data = query
        .find(queryobj2, queryStr.fields, {
          skip: skip,
          limit: limitData,
          sort: queryStr.sort,
        })
        .populate({ path: "tags", select: ["title", "description"] });
    } else {
      data = query
        .find(
          queryobj2,
          { createdAt: 0, createdBy: 0, productActiveStatus: 0, __v: 0 },
          {
            skip: skip,
            limit: limitData,
            sort: queryStr.sort,
          }
        )
        .populate({ path: "tags", select: ["title", "description"] });
    }
    var response = await data;
    return { status: "success", data: response };
  } catch (err) {
    return { status: "fail", message: err.message };
  }
};

module.exports = { findData, getAllData };
