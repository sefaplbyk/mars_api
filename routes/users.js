import express from 'express';
import { getAllUsers,getUserById } from '../controllers/usersController.js';

const router = express.Router();

router.get('/all/:userId', getAllUsers);
router.get('/:id', getUserById);

export default router;
