import User from "../models/User.js";
import FollowRequest from "../models/FollowRequest.js";
import Follow from "../models/Followers.js";

export const getFollowRequest = async (req, res) => {
  const { userId } = req.params;
  try {
    const requests = await FollowRequest.find({
      target: userId,
      status: "pending",
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
  // requesterId, targetId
  const { requesterId, targetId } = req.body;
  try {
    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      throw new Error("Target user not found");
    }

    if (targetUser.isPrivate) {
      // Gizli hesapsa, takip isteği oluştur
      const existingRequest = await FollowRequest.findOne({
        requester: requesterId,
        target: targetId,
        status: "pending",
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
      // Açık hesapsa, doğrudan takip et
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
      res.status(201).json({
        requestInfo: "Kullanıcı takip edildi.",
      });
      await User.findByIdAndUpdate(requesterId, {
        $inc: { followingsCount: 1 },
      });
      await User.findByIdAndUpdate(targetId, { $inc: { followersCount: 1 } });
      console.log("User followed successfully");
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const acceptFollowRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await FollowRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      throw new Error("Follow request not found or already handled");
    }

    // İsteği kabul et
    request.status = "accepted";
    await request.save();

    // Kullanıcıları takip listelerine ekle
    await User.findByIdAndUpdate(request.requester, {
      $inc: { followingsCount: 1 },
    });
    await User.findByIdAndUpdate(request.target, {
      $inc: { followersCount: 1 },
    });

    console.log("Follow request accepted");
  } catch (error) {
    console.error(error.message);
  }
};

export const declineFollowRequest = async (req, res) => {
  // requestId
  const { requestId } = req.params;

  try {
    const request = await FollowRequest.findByIdAndDelete(requestId);

    if (!request || request.status !== "pending") {
      throw new Error("Follow request not found or already handled");
    }

    request.status = "declined";
    await request.save();

    console.log("Follow request declined");
  } catch (error) {
    console.error(error.message);
  }
};
export const checkFollowRequest = async (req,res) => {
  
}
