const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

router.get(
  "/profile",
  userController.getProfile
);


router.put(
  "/updateUser",
  userController.putUpdateUser
);


router.delete(
  "/delete-user",
  userController.deleteUser
)


module.exports = router;
