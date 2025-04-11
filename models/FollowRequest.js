import mongoose from "mongoose";

const followRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  target: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // İsteğin hedefi olan kullanıcı
 

  createdAt: { type: Date, default: Date.now },
});

const FollowRequest = mongoose.model("FollowRequest", followRequestSchema);

export default FollowRequest;
