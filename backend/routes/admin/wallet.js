// routes/admin/wallet.js (or wherever your wallet routes live)
import express from "express";
import User from "../../models/User.js";
import WalletTransaction from "../../models/WalletTransaction.js";
import { protect, adminProtect } from "../../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Existing update route (kept for backward compatibility)
 * Expects: { amount, type } where type = "add" or "deduct"
 */
router.post("/update/:id", protect, adminProtect, async (req, res) => {
  try {
    const { amount, type, note } = req.body;
    if (!amount || !type) return res.status(400).json({ message: "amount and type required" });

    const incValue = type === "add" ? Number(amount) : -Number(amount);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { wallet: incValue } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    await WalletTransaction.create({
      userId: req.params.id,
      type: type === "add" ? "credit" : "debit",
      amount: Number(amount),
      note,
      status: "Success",
    });

    res.json({ msg: "Wallet updated", wallet: user.wallet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * New: Credit by admin (body: { userId, amount, note })
 */
router.post("/credit", protect, adminProtect, async (req, res) => {
  try {
    const { userId, amount, note } = req.body;
    if (!userId || !amount) return res.status(400).json({ message: "userId and amount required" });

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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * New: Debit by admin (body: { userId, amount, note })
 */
router.post("/debit", protect, adminProtect, async (req, res) => {
  try {
    const { userId, amount, note } = req.body;
    if (!userId || !amount) return res.status(400).json({ message: "userId and amount required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: prevent negative balance
    if (user.wallet - Number(amount) < 0) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.wallet = user.wallet - Number(amount);
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET history for a user (admin access)
 * Example: GET /admin/wallet/history/:userId
 */
router.get("/history/:id", protect, adminProtect, async (req, res) => {
  try {
    const userId = req.params.id;
    const history = await WalletTransaction.find({ userId }).sort({ createdAt: -1 }).limit(200);
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
