// routes/admin/wallet.js
import express from "express";
import User from "../../models/User.js";
import WalletTransaction from "../../models/WalletTransaction.js";
import { protect, adminProtect } from "../../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ Unified Wallet Update Route
 * Expects: { amount, type, note }
 * type = "credit" | "debit"
 */
router.post("/update/:id", protect, adminProtect, async (req, res) => {
  try {
    const { amount, type, note } = req.body;

    if (!amount || !type)
      return res.status(400).json({ message: "Amount and type are required" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle credit or debit
    if (type === "credit") {
      user.wallet += Number(amount);
    } else if (type === "debit") {
      if (user.wallet < amount)
        return res.status(400).json({ message: "Insufficient balance" });
      user.wallet -= Number(amount);
    } else {
      return res.status(400).json({ message: "Invalid type value" });
    }

    await user.save();

    // Log transaction
    await WalletTransaction.create({
      userId: user._id,
      type,
      amount: Number(amount),
      note,
      status: "Success",
    });

    res.json({
      msg: `Wallet ${type === "credit" ? "Credited" : "Debited"}`,
      wallet: user.wallet,
    });
  } catch (err) {
    console.error("WALLET UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Explicit Credit Route (optional)
 */
router.post("/credit", protect, adminProtect, async (req, res) => {
  try {
    const { userId, amount, note } = req.body;
    if (!userId || !amount)
      return res.status(400).json({ message: "userId and amount required" });

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { wallet: Number(amount) } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    await WalletTransaction.create({
      userId,
      type: "credit",
      amount: Number(amount),
      note,
      status: "Success",
    });

    res.json({ msg: "Wallet Credited", wallet: user.wallet });
  } catch (err) {
    console.error("CREDIT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Explicit Debit Route (optional)
 */
router.post("/debit", protect, adminProtect, async (req, res) => {
  try {
    const { userId, amount, note } = req.body;
    if (!userId || !amount)
      return res.status(400).json({ message: "userId and amount required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.wallet < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    user.wallet -= Number(amount);
    await user.save();

    await WalletTransaction.create({
      userId,
      type: "debit",
      amount: Number(amount),
      note,
      status: "Success",
    });

    res.json({ msg: "Wallet Debited", wallet: user.wallet });
  } catch (err) {
    console.error("DEBIT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Get Transaction History for Specific User
 */
router.get("/history/:id", protect, adminProtect, async (req, res) => {
  try {
    const userId = req.params.id;
    const history = await WalletTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("userId", "name email wallet");

    res.json(history);
  } catch (err) {
    console.error("GET HISTORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Get All Transactions (Admin Panel)
 */
router.get("/", protect, adminProtect, async (req, res) => {
  try {
    const transactions = await WalletTransaction.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email wallet");

    res.json(transactions);
  } catch (err) {
    console.error("GET ALL TRANSACTIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
