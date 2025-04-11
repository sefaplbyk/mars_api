import User from "../models/User.js";
import FollowRequest from "../models/FollowRequest.js";
import Follow from "../models/Followers.js";
import Follows from "../models/Followers.js";

export const getFollowRequest = async (req, res) => {
  const { userId } = req.params;
  try {
    const requests = await FollowRequest.find({
      target: userId,
    })
      .populate({
        path: "requester",
        select: "username profilePicture _id",
      })
      .exec();

    if (requests.length === 0) {
      console.log("No follow requests found");
      return [];
    }
    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error getting follow requests:", error);
  }
};

export const sendFollowRequest = async (req, res) => {
  const { requesterId, targetId } = req.body;
  try {
    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      throw new Error("Target user not found");
    }

    if (targetUser.isPrivate) {
      const existingRequest = await FollowRequest.findOne({
        requester: requesterId,
        target: targetId,
      });

      if (existingRequest) {
        throw new Error("Follow request already sent");
      }

      const followReq = new FollowRequest({
        requester: requesterId,
        target: targetId,
      });

      await followReq.save();
      res.status(201).json({
        requestInfo: "Takip İsteği Gönderildi.",
      });

      console.log("Follow request sent");
    } else {
      const existingFollow = await Follow.findOne({
        follower: requesterId,
        following: targetId,
      });

      if (existingFollow) {
        throw new Error("You are already following this user");
      }

      const follow = new Follow({
        follower: requesterId,
        following: targetId,
      });

      await follow.save();
      await User.findByIdAndUpdate(requesterId, {
        $inc: { followingsCount: 1 },
      });
      await User.findByIdAndUpdate(targetId, { $inc: { followersCount: 1 } });

      res.status(201).json({
        requestInfo: "Kullanıcı takip edildi.",
      });

      console.log("User followed successfully");
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const acceptFollowRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await FollowRequest.findByIdAndDelete(requestId);

    if (!request) {
      throw new Error("Follow request not found or already handled");
    }

    await Follows.create({
      follower: request.requester,
      following: request.target
    })

    await User.findByIdAndUpdate(request.requester, {
      $inc: { followingsCount: 1 },
    });
    await User.findByIdAndUpdate(request.target, {
      $inc: { followersCount: 1 },
    });

    console.log("Follow request accepted and follow relation created.");
    res.status(200).json({ message: "Follow request accepted." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "An error occurred while accepting request." });
  }
};

export const declineFollowRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const deletedRequest = await FollowRequest.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({
        message: "Follow request not found or already handled.",
      });
    }

    return res.status(200).json({ message: "Follow request declined and deleted." });
  } catch (error) {
    console.error("Error while declining follow request:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const checkFollow = async (req, res) => {
  const { requesterId, targetId } = req.body;

  try {
    const followRequest = await FollowRequest.findOne({
      requester: requesterId,
      target: targetId,
    });

    console.log("Follow request found:", followRequest);

    if (followRequest) {
      return res.status(200).json({
        status: "pending",
      });
    } else {
      return res.status(200).json({
        status: null,
      });
    }
  } catch (error) {
    console.error("Takip durumu kontrol hatası:", error);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const cancelFollowRequest = async (req, res) => {
  const { requesterId, targetId } = req.body;

  try {
    const followRequest = await FollowRequest.findOneAndDelete({
      requester: requesterId,
      target: targetId,
    });

    if (followRequest) {
      return res.status(200).json({
        message: "Takip isteği başarıyla iptal edildi.",
      });
    } else {
      return res.status(404).json({
        error: "Takip isteği bulunamadı.",
      });
    }
  } catch (error) {
    console.error("Takip isteği iptal hatası:", error);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};