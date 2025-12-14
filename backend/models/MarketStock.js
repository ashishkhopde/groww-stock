import mongoose from "mongoose";

const marketStockSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    price: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("MarketStock", marketStockSchema);
