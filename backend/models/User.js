import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    // ✅ Added Wallet Balance Field
    wallet: {
      type: Number,
      default: 0,
    },
    // wallet: { type: Number, default: 0 },

    kycStatus: {
      type: String,
      enum: ["not_submitted", "pending", "approved", "rejected"],
      default: "not_submitted",
    },

    kyc: {
      fullName: String,
      mobile: String,
      aadhaar: String,
      pan: String,
      bankAccount: String,
      ifsc: String,
      dob: String,
      address: String,
    },

    manualProfitAdjustment: {
      type: Number,
      default: 0,
    },

    // ✅ Added Transactions Array
    transactions: [
      {
        type: {
          type: String, // "credit" | "debit"
        },
        amount: {
          type: Number,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);


export default mongoose.model("User", userSchema);
