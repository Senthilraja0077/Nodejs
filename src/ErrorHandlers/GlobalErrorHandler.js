const customError = require("./../ErrorHandlers/CustomErrorHandler");

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
const castErrorHandler = (err) => {
  const msg = `Invalid value  for ${err.path} : ${err.value}`;
  return new customError(msg, 400);
};
const duplicateKeyErrorHandler = (err) => {
  const email = err.keyValue.email;
  const msg = `There is already with email ${email} please use another email`;
  return new customError(msg, 400);
};
const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data :${errorMessages}`;
  return new customError(msg, 400);
};
const handledExpiredToken = (error) => {
  return new customError("JWT has expired.please login again", 401);
};
const handleJWTError = (error) => {
  return new customError("Invalid token please login again", 401);
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong ! please try again later",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    if (error.name === "TokenExpiredError") error = handledExpiredToken(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError(error);
    prodErrors(res, error);
  }
};

// IF ANY ERROR OCCURS IN EXPRESS APP GOBAL MIDDLEWARE HADLE THE ERROR
