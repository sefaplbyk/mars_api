import mongoose from "mongoose";

const followsSchema = new mongoose.Schema({
    followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  followingId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Follows = mongoose.model("Follows", followsSchema);

export default Follows;
