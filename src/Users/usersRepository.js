//----> CREATE DATA
const createData = async (query, data) => {
  try {
    console.log("--->", query, data);
    const createdData = await query.create(data);
    return { status: "success", data: createdData };
  } catch (err) {
    return err;
  }
};
//----> FIND PASSWORD WITH EMAIL
const findOne = async (query, email) => {
  try {
    const findOneData = await query.findOne(email).select("+password");
    return { status: "success", data: findOneData };
  } catch (err) {
    return err;
  }
};

//----> FIND BY ID
const findById = async (query, id) => {
  try {
    const findOneData = await query.findById(id).select("+password");
    return { status: "success", data: findOneData };
  } catch (err) {
    return err;
  }
};
//----> UPDATE DATA
const updateData = async (query, id, data) => {
  try {
    const updateData = await query.findByIdAndUpdate(id, data, {
      new: true,
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
module.exports = {
  createData,
  findOne,
  findById,
  updateData,
};
