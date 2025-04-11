import express from 'express';
import { acceptFollowRequest, declineFollowRequest, getFollowRequest, sendFollowRequest, checkFollow, cancelFollowRequest } from '../controllers/followReqController.js';

const router = express.Router();

router.get('/request/:userId',getFollowRequest)
router.post('/followReq/', sendFollowRequest);
router.post('/acceptRequest/:requestId',acceptFollowRequest)
router.post('/rejectRequest/:requestId',declineFollowRequest)
router.post("/check_follow_status", checkFollow);
router.post("/cancel_follow_request", cancelFollowRequest);


export default router;
