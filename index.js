const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
//----> UNCAUGHT EXPECTION -->OUSIDE EXPRESS ERROS
process.on("uncaughtException", (err) => {
  console.log(err, err.name, err.message);
  console.log("unCaught exception has occured ! shuting down ");
  process.exit(1);
});
//----> DATABASE PATH FROM ENV
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
//----> DATABASE CONNECTION
mongoose.connect(process.env.CLOUD_CONN_STR, {}).then((conn) => {
  console.log("DB connnected successfully");
});
//----> FUNCTION SOURCE
const userData = require("./src/Users/usersRouter");
const productsData = require("./src/Products/productsRouter");
const tagsData = require("./src/Tags/tagsRouter");
//const requestsData = require("./src/Requests/requestsRouter");
//-->ERROR HANDLERS
const CustomError = require("./src/ErrorHandlers/CustomErrorHandler");
const GlobalErrorHandler = require("./src/ErrorHandlers/GlobalErrorHandler");
const rateLimit = require("express-rate-limit");
const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
//const xss = require("xss-clean");
app.use(helmet());
app.use(sanitize());

// app.use(xss());
//---->RATE LIMIT - LIMIT THE REQUEST
let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    "We have recieved too many requests from this IP. please try after 1 hr ",
});
app.use("/", limiter);
//----> REQUEST TIME,REQUEST METHOD TYPE,REQUEST ROUTE URL,RESPONSE STATUS CODE
//----> MIDDLEWARE
app.use((req, res, next) => {
  const requestedAt = new Date().toUTCString();
  const requesMethod = req.method;
  const requestRoute = req.url;
  console.log("Requested Time : ", requestedAt);
  console.log("Request Method : ", requesMethod);
  console.log("Requested Route :", requestRoute);
  res.on("finish", () => {
    console.log("Respose status code : ", res.statusCode);
  });
  next();
});
//----> FUCTION CALL
app.use(userData);
app.use(productsData);
app.use(tagsData);
//app.use(requestsData);
//----> ERROR HANDLING FOR INCORRECT PATH
app.all("*", (req, res, next) => {
  const err = new CustomError(
    `can't find ${req.originalUrl} on the server `,
    404
  );
  next(err);
});
//----> GLOBAL ERROR HANDLING MIDDLEWARE
app.use(GlobalErrorHandler);
//----> SERVER
const server = app.listen(3000, () => {
  console.log("Server started....");
});
//----> UNHANDLED REJCTIONS - DATABASE RELATED
process.on("unhandledRejection", (err) => {
  console.log(err, err.name, err.message);
  console.log("unhaandled rejection has occured ! shuting down ");
  server.close(() => {
    process.exit(1);
  });
});
