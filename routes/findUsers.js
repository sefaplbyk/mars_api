import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/all/:userId', async(req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.userId } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
