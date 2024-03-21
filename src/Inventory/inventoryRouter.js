const express = require("express");
const router = express.Router();
const userDataController = require("./../Users/usersController");
const inventroyController = require("./inventoryController");
router.post(
  "/addInventory",
  userDataController.protect,
  userDataController.access("admin"),
  inventroyController.addInventory
);
router.get(
  "/getInventory",
  userDataController.protect,
  inventroyController.getInventory
);
router.patch(
  "/updateInventory/:id",
  userDataController.protect,
  userDataController.access("admin"),
  inventroyController.updateInventory
);
router.delete(
  "/deleteInventroy/:id",
  userDataController.protect,
  userDataController.access("admin"),
  inventroyController.deleteInventory
);
module.exports = router;
