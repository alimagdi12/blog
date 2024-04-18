const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().then((data) => {
      console.log(data);
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: data,
      });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const token = req.header("jwt");
    await jwt.verify(token, "your_secret_key", (err, decodedToken) => {
      if (err) {
        console.log(err);
      }
      const userId = decodedToken.userId;
      Post.find({ userId })
        .then((data) => {
          res.status(201).json({
            message: "Posts fetched successfully!",
            post: data,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Failed to fetch posts." });
        });
    });
  } catch (err) {
    console.log(err);
  }
};


exports.getPostById = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post found", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to find post" });
  }
};


// exports.getPosts = async (req, res, next) => {
//   try {
//     const posts = await Post.find().populate("likes.users.userId");
//     const usersMap = new Map(); // Map to store unique user IDs
//     posts.forEach((post) => {
//       post.likes.users.forEach((like) => {
//         usersMap.set(like.userId._id.toString(), like.userId);
//       });
//     });

//     const userIds = Array.from(usersMap.keys());
//     const users = await User.find({ _id: { $in: userIds } });

//     const usersMapWithUsername = new Map();
//     users.forEach((user) => {
//       usersMapWithUsername.set(user._id.toString(), user);
//     });

//     // Replace user IDs with usernames and calculate total quantity
//     posts.forEach((post) => {
//       let totalQuantity = 0;
//       post.likes.users.forEach((like) => {
//         totalQuantity += like.quantity;
//         like.username = usersMapWithUsername.get(
//           like.userId._id.toString()
//         ).username;
//         delete like.userId; // Remove the userId field
//       });
//       post.totalLikes = totalQuantity;
//     });

//     res.status(200).json({ data: posts });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: "Failed to get posts" });
//   }
// };

exports.postAddPost = async (req, res, next) => {
  const token = req.header("jwt");
  await jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      res.status(401).json({ msg: "not authorized" });
    }

    const details = req.body.details;
    const image = req.body.image;
    const userId = decodedToken.userId;
    User.findById(userId).then((user) => {
      const post = new Post({
        details,
        image,
        userId,
        createdBy: user.userName,
        likes: { users: [] },
      });
      post
        .save()
        .then((result) => {
          res.status(204).json({ msg: "post added successfullt" });
        })
        .catch((err) => {
          console.log(err);
          res.status(402).json({ msg: "failed to add post" });
        });
    });
  });
};

exports.postAddLike = async (req, res, next) => {
  const token = req.header("jwt");
  await jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ err });
    }
    const userId = decodedToken.userId;
    const postId = req.body.postId;

    Post.findById(postId)
      .then((post) => {
        if (!post) {
          res.status(404).json({ msg: "no post found" });
        }
        return (
          post.addLikes(userId),
          res.status(200).json({ msg: "likes increased successfully" })
        );
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ msg: "error adding likes" });
      });
  });
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const token = req.header("jwt");
  try {
    await jwt.verify(token, "your_secret_key", (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ err });
      }
      const userId = decodedToken.userId; // Assuming req.user.userId contains the ID of the current user

      Post.findByIdAndDelete(postId)
        .then((post) => {
          if (!post) {
            return res.status(404).json({ msg: "Post not found" });
          }

          if (post.userId.toString() !== userId) {
            return res
              .status(403)
              .json({ msg: "You are not authorized to delete this post" });
          }

          console.log("post deleted");
          res.status(200).json({ msg: "Post deleted successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ msg: "Failed to delete post" });
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

exports.editPost = async (req, res, next) => {
  const postId = req.params.postId;
  const token = req.header("jwt");
  try {

      const { details, image } = req.body;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      post.details = details;
      post.image = image;
      await post.save();

      res.status(200).json({ msg: "Post updated successfully", data: post });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update post" });
  }
};
