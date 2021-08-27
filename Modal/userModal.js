import mongoose from "mongoose";

const instance = mongoose.Schema(
  {
    name: String,
    email: String,
    passowrd: String,
  }
  // { timestamps: true }
);

export default mongoose.model("userModal", instance);
