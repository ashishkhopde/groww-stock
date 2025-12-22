import mongoose from "mongoose";

const withdrawalRequestSchema = new mongoose.Schema(
  {
    // The user making the withdrawal
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Withdrawal amount
    amount: {
      type: Number,
      required: true,
      min: [1, "Withdrawal amount must be greater than 0"],
    },

    // Payment method (like bank, UPI, Paytm, etc.)
    // method: {
    //   type: String,
    //   enum: ["bank", "upi"],
    //   required: true,
    // },

    // // Details for chosen method
    // accountDetails: {
    //   accountHolder: { type: String },
    //   accountNumber: { type: String },
    //   ifscCode: { type: String },
    //   upiId: { type: String },
    // },

    // // Optional admin note or user remark
    // note: {
    //   type: String,
    //   default: "",
    // },

    // // Request status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected",],
      default: "pending",
    },

    // Transaction reference ID if processed
    // transactionId: {
    //   type: String,
    // },

    // When the admin processed it
    // processedAt: {
    //   type: Date,
    // },
  },
  { timestamps: true }
);

export default mongoose.model("WithdrawalRequest", withdrawalRequestSchema);
