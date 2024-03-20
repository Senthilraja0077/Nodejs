const express = require("express");
const router = express.Router();
const tagsController = require("./tagsController");
const userDataController = require("./../Users/usersController");
router.post(
  "/addTags",
  userDataController.protect,
  userDataController.access("admin"),
  tagsController.addTags
);
router.get("/getTags", userDataController.protect, tagsController.getTags);
router.patch(
  "/updateTags/:id",
  userDataController.protect,
  userDataController.access("admin"),
  tagsController.updateTags
);
router.delete(
  "/deleteTags/:id",
  userDataController.protect,
  userDataController.access("admin"),
  tagsController.deleteTags
);
module.exports = router;
