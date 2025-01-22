import User from "../models/User.js";
import Post from "../models/Post.js";
import Follows from "../models/Followers.js";
import Comment from "../models/Comment.js";
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.userId } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const toggleUserPrivacy = async (req, res) => {
  const { userId } = req.params;
  const { isPrivate } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isPrivate },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ message: "Kullanıcı bulunamadı" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Güncelleme işlemi başarısız", error });
  }
};

export const rq = async (req, res) => {
  const { userId, profileId } = req.query;

  // Parametrelerin varlığını kontrol et
  if (!userId || !profileId) {
    return res
      .status(400)
      .json({ error: "userId and profileId are required." });
  }

  try {
    // Kullanıcıyı bul
    const userProfile = await User.findById(profileId);

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kullanıcının isPrivate durumu
    const isPrivate = userProfile.isPrivate;

    // Kullanıcıyı takip ediyor mu kontrol et
    const isFollowing = await Follows.findOne({
      follower: userId,
      following: profileId,
    });

    // Kullanıcı isPrivate ve takip edilmiyorsa
    if (isPrivate && !isFollowing) {
      return res.status(200).json({
        username: userProfile.username,
        isPrivate: true,
        message: "This account is private.",
        accessibility: false,
      });
    }
    // Kullanıcı takip ediliyorsa veya isPrivate değilse tüm bilgileri döndür
    if (isFollowing || !isPrivate) {
      const posts = await Post.find({ authorId: profileId })
        .populate("authorId", "username email profilePicture")
        .sort({ createdAt: -1 });

      const postsWithCommentCount = await Promise.all(
        posts.map(async (post) => {
          const commentCount = await Comment.countDocuments({
            postId: post._id,
          });

          return {
            id: post._id,
            userName: post.authorId.username,
            userEmail: post.authorId.email,
            userProfilePic: post.authorId.profilePicture,
            content: post.content,
            commentsCount: commentCount,
            likes: post.likes,
            date: post.createdAt,
            accessibility: true,
          };
        })
      );
      res.status(200).json(postsWithCommentCount);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserFollowers = async (req, res) => {

  const { userId } = req.params;
    const user = User.findById(userId)
  try {
    const followers = await Follows.find()
      .populate
      // "follower"
      ();
    console.log(followers, "followers");
    const formattedFollowers = followers.map((item) => item.followers);
    console.log(formattedFollowers, "followersApı");
    res.status(200).json(formattedFollowers);
  } catch (error) {
    res.status(500).json({ error: "Followers could not be fetched." });
  }
};

export const getUserFollowings = async (req, res) => {
  const { userId } = req.params;

  try {
    const followings = await Follows.find({ follower: userId }).populate(
      "following"
    );
    const formattedFollowings = followings.map((item) => item.following);
    res.status(200).json(formattedFollowings);
  } catch (error) {
    res.status(500).json({ error: "Followings could not be fetched." });
  }
};
