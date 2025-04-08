import express from "express";
import {
  getAllUsers,
  getUserById,
  getUserFollowers,
  getUserFollowings,
  rq,
  toggleUserPrivacy,
  updateUser
} from "../controllers/usersController.js";

const router = express.Router();

router.put("/userPrivacy/:userId", toggleUserPrivacy);
router.put("/profile/update/:userId", updateUser)
router.get("/all/:userId", getAllUsers);
router.get("/:id", getUserById);
router.get("/profile/getUserPost", rq);
router.get("/followers/:userId", getUserFollowers)
router.get("/followings/:userId", getUserFollowings)

export default router;
