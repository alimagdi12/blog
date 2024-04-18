const User = require("../models/user");
const jwt = require("jsonwebtoken");




exports.getProfile = (req, res, next) => {
  const token = req.header("jwt");

  jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const id = decodedToken.userId;
    User.findById(id)
      .then((user) => {
        res.status(201).json({ msg: "this is user", user });
      })
      .catch((err) => console.log(err));
  });
};




exports.putUpdateUser = async (req, res) => {
  let token = req.header("jwt");
  await jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const {
      updatedUserName,
      updatedFirstName,
      updatedLastName,
      updatedBirthDay,
      updatedGender,
      updatedEmail,
      updatedPhoneNumber,
    } = req.body;
    userId = decodedToken.userId;
    console.log(userId);
    const updatedUser = User.findById(userId)
      .then((user) => {
        console.log(user, req.body);
        user.userName = updatedUserName;
        user.firstName = updatedFirstName;
        user.lastName = updatedLastName;
        user.email = updatedEmail;
        user.phoneNumber = updatedPhoneNumber;
        user.birthDay = updatedBirthDay;
        user.gender = updatedGender;
        return user.save().then((result) => {
          console.log("user updated successfully");
          res.status(201).json({ msg: "updated successfully", user });
        });
      })
      .catch((error) => {
        console.log("Error in updating the user");
        console.log(error);
      });
  });
};


exports.deleteUser = async (req,res,next)=>{
  let token = req.header("jwt");
  await jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    userId = decodedToken.userId;
    console.log(userId);
    User.findByIdAndDelete(userId)
    .then(res=>{
      console.log(res,"user deleted successfully");
    })
    .catch(err=>{
      console.log(err,"error in deleting user");
    })

  })
}


