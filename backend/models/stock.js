import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stockName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
