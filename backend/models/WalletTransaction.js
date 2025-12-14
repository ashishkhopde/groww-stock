// models/WalletTransaction.js
import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    note: { type: String },
    status: { type: String, default: "Success" }
  },
  { timestamps: true }
);

export default mongoose.model("WalletTransaction", walletTransactionSchema);
