const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const postsSchema = new Schema({
  details: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    require: false,
  },
  userId:{
    type:String,
    require:true
  },
  createdBy:{
    type:String,
    require:true
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  likes: {
    users: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});




postsSchema.methods.increaseLikes = function (userId) {
  const likesIndex = this.likes.users.findIndex((cp) => {
    return cp.userId.toString() === userId.toString();
  });
  if (likesIndex >= 0) {
    this.likes.users[likesIndex].quantity++;
    return this.save();
  }
};


postsSchema.methods.decreaseLikes = function (userId) {
  const likesIndex = this.likes.users.findIndex((cp) => {
    return cp.userId.toString() === userId.toString();
  });
  if (likesIndex >= 0) {
    const currentQuantity = this.likes.users[likesIndex].quantity;
    if (currentQuantity > 1) {
      this.likes.users[likesIndex].quantity--;
    } else {
      // If quantity is 1, remove the like entry
      this.likes.users.splice(likesIndex, 1);
    }
    return this.save();
  }
};



postsSchema.methods.addLikes = function (userId) {
  const likesIndex = this.likes.users.findIndex((cp) => {
    return cp.userId.toString() === userId.toString();
  });
  let newQuantity = 1;
  const updatedLikes = [...this.likes.users];

  if (likesIndex >= 0) {
    newQuantity = this.likes.users[likesIndex].quantity + 1;
    updatedLikes[likesIndex].quantity = newQuantity;
  } else {
    updatedLikes.push({
      userId: userId,
      quantity: newQuantity,
    });
  }
  const updatedLike = {
    users: updatedLikes,
  };
  this.likes = updatedLike;
  return this.save();
};

module.exports = mongoose.model("Post", postsSchema);

