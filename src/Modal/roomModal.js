import mongoose from "mongoose";

const instance = mongoose.Schema(
  {
    name: String,
    roomImage: String,
    date: String,
    lastMessage: String,
  },
  { timestamps: true }
);

export default mongoose.model("roomModal", instance);
