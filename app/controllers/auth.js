const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const User = require('../models/user');

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth:{
    user:"alimagdi12367@gmail.com",
    pass:"aimorddjdtspxute"
}
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "../front/src/assets/uploads/"; // Base upload path
    // Create a dynamic folder name based on current date
    const folderName = new Date().toISOString().split("T")[0];
    const fullPath = path.join(uploadPath, folderName);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage }).array("images", 5); // Up to 5 images

exports.uploadImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .send({ message: "Error uploading files", error: err });
    }

    // Files uploaded successfully
    // req.imageNames = req.files.map((file) => file.filename);
    next();
  });
};


exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  await User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ msg: "Invalid email or password." });
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign(
              {
                email: user.email,
                userId: user._id.toString(),
              },
              "your_secret_key",
              { expiresIn: "1h" }
            );
            console.log("Token:", token);
            res.header({ jwt: token });
            res.status(200).json({ token: token });
          } else {
            res.status(422).json({ message: "Invalid email or password." });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: err });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
};




exports.postSignup = async (req, res, next) => {
  const userName = req.body.userName;
  const fName = req.body.fName;
  const lName = req.body.lName;
  const birthday = req.body.birthday;
  const gender = req.body.gender;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const password = req.body.password;

  // Validate password
  if (!password || typeof password !== "string") {
    return res.status(400).json({ message: "Password is required" });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        userName,
        firstName: fName,
        lastName: lName,
        birthDay: birthday,
        gender,
        email,
        phoneNumber: mobile,
        password: hashedPassword,
        cart: { items: [] },
      });

      return user.save();
    })
    .then((result) => {
      return transporter.sendMail({
        to: email,
        from: "shop@node-complete.com",
        subject: "Signup succeeded!",
        html: "<h1>You successfully signed up!</h1>",
      });
    })
    .then(() => {
      res.status(200).json({ msg: "signup succeeded" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
};
