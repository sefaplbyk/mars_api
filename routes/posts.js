import express from "express";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  addComment,
  getPostComments,
  toggleLike,
  getPost,
} from "../controllers/postsController.js";

const router = express.Router();

router.get("/all", getAllPosts);
router.get("/:userId", getUserPosts);
router.get("/postDetail/:postId", getPost);
router.get("/getPostComment/:postId", getPostComments);

router.post("/create", createPost);
router.post("/addComment", addComment);
router.post("/toggleLike/:postId", toggleLike);

export default router;
