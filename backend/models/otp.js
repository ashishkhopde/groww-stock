import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String },
  phone: { type: String }, // for phone OTP support

  otpHash: { type: String },   // store hashed OTP

  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("Otp", otpSchema);
