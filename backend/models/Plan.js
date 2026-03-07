import mongoose from "mongoose";

const planSchema = new mongoose.Schema({

  name: String,
  price: String,
  roi: String,
  features: [String],
  color: String,
  featured: Boolean

});

export default mongoose.model("Plan", planSchema);