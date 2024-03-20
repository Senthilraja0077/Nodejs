// LOCAL REPOSITORY
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
    var userData;
    if (queryStr.fields != undefined) {
      userData = query.find(queryobj2, queryStr.fields, {
        skip: skip,
        limit: limitData,
        sort: queryStr.sort,
      });
    } else {
      userData = query.find(
        queryobj2,
        { createdAt: 0, createdBy: 0, activeStatus: 0, __v: 0 },
        {
          skip: skip,
          limit: limitData,
          sort: queryStr.sort,
        }
      );
    }
    var response = await userData;
    return { status: "success", data: response };
  } catch (err) {
    return { status: "fail", message: err.message };
  }
};

module.exports = { findData };
