import express from 'express';
import { createPost, getAllPosts, getUserPosts, addComment, getPostComments } from '../controllers/postsController.js';

const router = express.Router();

router.get('/all', getAllPosts)
router.get('/:userId', getUserPosts)

router.post('/create', createPost)
router.post('/addComment', addComment)
router.get('/getPostComment/:postId',getPostComments)

export default router;
