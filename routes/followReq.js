import express from 'express';
import { acceptFollowRequest, declineFollowRequest, getFollowRequest, sendFollowRequest } from '../controllers/followReqController.js';

const router = express.Router();

router.get('/request/:userId',getFollowRequest)
router.post('/followReq/', sendFollowRequest);
router.post('/acceptRequest/:requestId',acceptFollowRequest)
router.post('/rejectRequest/:requestId',declineFollowRequest)

export default router;
