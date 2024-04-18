const express = require('express');
const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();


router.post(
  '/login',
  authController.postLogin
);

router.post(
  '/signup',
  authController.postSignup
);

router.post(
  "/upload",
  authController.uploadImage
);



module.exports = router;
