import express from "express";
import {
  getAllUsers,
  getUserById,
  getUserFollowers,
  getUserFollowings,
  rq,
  toggleUserPrivacy,
  updateUser,
  unfollow
} from "../controllers/usersController.js";

const router = express.Router();

router.put("/userPrivacy/:userId", toggleUserPrivacy);
router.put("/profile/update/:userId", updateUser);
router.post("/unfollow", unfollow);
router.get("/all/:userId", getAllUsers);
router.get("/profile/getUserPost", rq);
router.get("/followers/:userId", getUserFollowers);
router.get("/followings/:userId", getUserFollowings);
router.get("/:id", getUserById);

export default router;
