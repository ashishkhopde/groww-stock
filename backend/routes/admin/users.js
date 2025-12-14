import express from "express";
import mongoose from "mongoose";
import User from "../../models/User.js";
import {protect, adminProtect } from "../../middleware/authMiddleware.js";

const router = express.Router();

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  aadhaar: String,
  pan: String,
  bankAccount: String,
  wallet: { type: Number, default: 0 },
  kycStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// GET ALL USERS
router.get("/",protect, adminProtect, async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// GET SINGLE USER
router.get("/:id", protect, adminProtect, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// ADMIN UPDATE USER BALANCE
router.post("/balance/:id",protect, adminProtect, async (req, res) => {
  const { amount } = req.body;

  await User.findByIdAndUpdate(req.params.id, {
    $inc: { wallet: amount }
  });

  res.json({ msg: "Balance updated" });
});

// ADMIN UPDATE USER STOCKS
router.post("/stocks/:id", protect, adminProtect, async (req, res) => {
  const { stockName, quantity, price } = req.body;

  await User.findByIdAndUpdate(req.params.id, {
    $push: {
      portfolio: { stockName, quantity, price }
    }
  });

  res.json({ msg: "Stock added to user" });
});

export default router;
