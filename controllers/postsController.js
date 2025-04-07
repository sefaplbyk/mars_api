import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import mongoose from "mongoose";
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("authorId", "username email profilePicture")
      .sort({ createdAt: -1 });

    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        // Her post için Comment koleksiyonunda eşleşen postId ile yorum sayısını alıyoruz
        const commentCount = await Comment.countDocuments({ postId: post._id });

        return {
          id: post._id,
          authorId: post.authorId._id,
          userName: post.authorId.username,
          userEmail: post.authorId.email,
          userProfilePic: post.authorId.profilePicture,
          content: post.content,
          imageUrl: post.imageUrl, 
          commentsCount: commentCount,
          likes: post.likes,
          date: post.createdAt,
        };
      })
    );
    res.status(200).json(postsWithCommentCount);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
};
export const getLoggedInUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.userId })
      .populate("authorId", "username email profilePicture")
      .sort({ createdAt: -1 });

    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ postId: post._id });

        return {
          id: post._id,
          userName: post.authorId.username,
          userEmail: post.authorId.email,
          userProfilePic: post.authorId.profilePicture,
          content: post.content,
          imageUrl: post.imageUrl, 
          commentsCount: commentCount,
          likes: post.likes,
          date: post.createdAt,
        };
      })
    );
    res.status(200).json(postsWithCommentCount);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user posts",
      error: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    if (!req.body.title || !req.body.content || !req.body.authorId) {
      return res.status(400).json({
        message: "Title, content and authorId are required fields",
      });
    }

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      authorId: req.body.authorId,
      imageUrl: req.body.imageUrl || "", 
    });

    const savedPost = await post.save();

    await User.findByIdAndUpdate(req.body.authorId, {
      $inc: { postsCount: 1 },
    });

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};

export const toggleLike = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      // Eğer kullanıcı postu beğenmişse, beğeniyi kaldır
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      return res.status(200).json({ message: "Like removed", post });
    } else {
      // Eğer kullanıcı postu beğenmemişse, beğeniyi ekle
      post.likes.push(userId);
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      return res.status(200).json({
        message: "Like added",
        postId: post._id,
        likes: post.likes,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const addComment = async (req, res) => {
  const { postId, content, authorId } = req.body;
  if (
    !mongoose.Types.ObjectId.isValid(postId) ||
    !mongoose.Types.ObjectId.isValid(authorId)
  ) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const user = await User.findById(authorId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Yorum oluştur ve kaydet
  const newComment = new Comment({
    postId,
    content,
    authorId: user._id,
  });

  const savedComment = await newComment.save();
  const populatedComment = await Comment.findById(savedComment._id).populate(
    "authorId",
    "username profilePicture"
  );
  res.status(201).json(populatedComment);
};

export const getPostComments = async (req, res) => {
  const { postId } = req.params;
  try {
    // postId'nin geçerli bir ObjectId olup olmadığını kontrol et
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID format" });
    }

    // Belirtilen postId'ye ait yorumları getir
    const comments = await Comment.find({ postId })
      .populate("authorId", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch comments", error: error.message });
  }
};

export const getPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).populate(
      "authorId",
      "username email profilePicture"
    );
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching  posts",
      error: error.message,
    });
  }
};
