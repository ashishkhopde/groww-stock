import mongoose from "mongoose";

const paymentSettingsSchema = new mongoose.Schema({
  upiId: String,
  upiLink: String,
  bankName: String,
  accountNumber: String,
  ifsc: String,
  accountHolder: String,
  qrImage: String,
}, { timestamps: true });

export default mongoose.model("PaymentSettings", paymentSettingsSchema);
