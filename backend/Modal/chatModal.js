import mongoose from "mongoose";

const instance = mongoose.Schema(
  {
    message: String,
    timestamp: String,
    user: String,
    room: String,
  }
  // { timestamps: true }
);

export default mongoose.model("chatModal", instance);
