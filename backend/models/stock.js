import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stockName: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    // ✅ NEW: Profit and Loss Fields
    profit: {
      type: Number,
      default: 0, // Positive value for profit, negative for loss
    },

    loss: {
      type: Number,
      default: 0, // Optional — you can also just use profit < 0
    },
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
