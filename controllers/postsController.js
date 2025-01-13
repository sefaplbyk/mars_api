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
        commentsCount: commentCount, 
        likesCount: post.likes?.length || 0,
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

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.userId })
      .populate("authorId", "username email profilePicture")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      id: post._id,
      userName: post.authorId.username,
      userEmail: post.authorId.email,
      userProfilePic: post.authorId.profilePicture,
      content: post.content,
      commentsCount: post.comments?.length || 0,
      likesCount: post.likes?.length || 0,
      date: post.createdAt,
    }));

    res.status(200).json(formattedPosts);
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
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};

export const likePost = async (req,res) => {

}


export const addComment = async (req, res) => {
  const { postId, content, authorId } = req.body;
  if (
    !mongoose.Types.ObjectId.isValid(postId) ||
    !mongoose.Types.ObjectId.isValid(authorId)
  ) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Post kontrolü
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Kullanıcı kontrolü
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

  res.status(201).json(savedComment);
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
      .populate("authorId", "username profilePicture") // Kullanıcı bilgilerini ekle
      .sort({ createdAt: -1 }); // Yorumları en yeni tarihe göre sırala

    // Yorumları döndür
    res.status(200).json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch comments", error: error.message });
  }
};
