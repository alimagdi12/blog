const express = require("express");
const postController = require("../controllers/post");
const router = express.Router();

router.get("/posts", postController.getPosts);

router.get("/user-posts", postController.getUserPosts);

router.post("/add-post", postController.postAddPost);

router.post("/add-like", postController.postAddLike);

router.get("/posts/:postId", postController.getPostById);

router.delete("/posts/:postId", postController.deletePost);

router.put("/posts/:postId", postController.editPost);

module.exports = router;
