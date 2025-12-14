
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.js";
import User from "../../models/User.js";
import Stock from "../../models/stock.js";

import { protect, adminProtect } from "../../middleware/authMiddleware.js";


const router = express.Router();

// ----------------------
// ADMIN LOGIN
// ----------------------
// ----------------------
// ADMIN LOGIN (FIXED)
// ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate ENV admin credentials
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ msg: "Invalid admin credentials" });
    }

    // Find admin
    let admin = await Admin.findOne({ email });

    // Auto-create admin record if missing
    if (!admin) {
      const hashed = await bcrypt.hash(password, 10);
      admin = await Admin.create({ email, password: hashed, role: "admin" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid admin credentials" });
    }

    // Generate FIXED token WITH ROLE
  const token = jwt.sign(
  { id: admin._id, role: "admin" },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    res.json({ msg: "Admin Login Successful", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Admin login failed" });
  }
});


// ----------------------
// GET ALL USERS (Protected)
// ----------------------
router.get("/users",  protect, adminProtect, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// ----------------------
// UPDATE WALLET (Protected)
// ----------------------
router.post("/wallet/update", protect, adminProtect, async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  user.wallet += Number(amount);
  await user.save();

  res.json({ msg: "Wallet updated", wallet: user.wallet });
});


// ----------------------
// APPROVE / REJECT KYC
// ----------------------
router.post("/kyc/update", protect, adminProtect , async (req, res) => {
  const { userId, status } = req.body;

  await User.findByIdAndUpdate(userId, { kycStatus: status });

  res.json({ msg: `KYC ${status}` });
});

// ----------------------
// VIEW PENDING KYC
// ----------------------
router.get("/kyc/pending",  protect, adminProtect, async (req, res) => {
  const pendingUsers = await User.find({ kycStatus: "pending" });
  res.json(pendingUsers);
});

// ----------------------
// ADD STOCK
// ----------------------
router.post("/stocks/add",  protect, adminProtect, async (req, res) => {
  try {
    const { userId, stockName, price, quantity } = req.body;

    const stock = await Stock.create({
      user: userId,
      stockName,
      price,
      quantity
    });

    res.json({ msg: "Stock added successfully", stock });
  } catch (error) {
    console.log("ADD USER STOCK ERROR:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});
export default router;
