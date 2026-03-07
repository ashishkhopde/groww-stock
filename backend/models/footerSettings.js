import mongoose from "mongoose";

const footerSchema = new mongoose.Schema({
  address: {
    type: String,
    default: ""
  },

  email: {
    type: String,
    default: ""
  },

  mapLink: {
    type: String,
    default: ""
  }

}, { timestamps: true });

export default mongoose.model("FooterSettings", footerSchema);