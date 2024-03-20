const express = require("express");
const router = express.Router();
const productsController = require("./productsController");
const userController = require("./../Users/usersController");
router.post(
  "/addProducts",
  userController.protect,
  userController.access("admin"),
  productsController.addProducts
);
router.get(
  "/productsList",
  userController.protect,
  productsController.getallProducts
);
router.patch(
  "/updateProducts/:id",
  userController.protect,
  userController.access("admin"),
  productsController.updateExitingUserData
);
router.delete(
  "/deleteProducts/:id",
  userController.protect,
  userController.access("admin"),
  productsController.deleteExitngProductsData
);

module.exports = router;
