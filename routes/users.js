import express from 'express';
import { getAllUsers,getUserById, toggleUserPrivacy } from '../controllers/usersController.js';

const router = express.Router();

router.get('/all/:userId', getAllUsers);
router.get('/:id', getUserById);
router.put("/userPrivacy/:userId",toggleUserPrivacy)

export default router;
