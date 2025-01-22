import mongoose from "mongoose";

const followRelationSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Takip eden
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Takip edilen
  },
  { timestamps: true }
);

const Follows = mongoose.model("FollowRelation", followRelationSchema);

export default Follows;
