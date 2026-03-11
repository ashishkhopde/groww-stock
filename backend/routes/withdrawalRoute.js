import express from "express";
import { adminProtect, protect } from "../middleware/authMiddleware.js";
import WithdrawalRequest from "../models/WithdrawalRequest.js";
import User from "../models/User.js";
import WalletTransaction from "../models/WalletTransaction.js";

const router = express.Router();

/**
 * @route   POST /withdrawals/:id
 * @desc    Create withdrawal request
 * @access  Private (User)
 */
router.post("/withdrawals/:id", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ msg: "Amount is required." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.wallet < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    const newRequest = await WithdrawalRequest.create({
      userId: req.params.id,
      amount,
    });

    res.status(201).json({
      msg: "Withdrawal request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating withdrawal:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   GET /withdrawals/my/:id
 * @desc    Get user withdrawal requests
 * @access  Private
 */
router.get("/withdrawals/my/:id", protect, async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find({ userId: req.params.id })
      .populate("userId", "wallet")
      .sort({ createdAt: -1 });

    const user = await User.findById(req.params.id).select("wallet");

    res.json({
      balance: user?.wallet || 0,
      requests,
    });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   GET /admin/withdrawals
 * @desc    Get all withdrawal requests
 * @access  Admin
 */
router.get("/admin/withdrawals", protect, adminProtect, async (req, res) => {
  try {
    const allRequests = await WithdrawalRequest.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ allRequests });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   PATCH /admin/withdrawals/:id
 * @desc    Approve or Reject withdrawal
 * @access  Admin
 */
router.patch("/admin/withdrawals/:id", protect, adminProtect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status update." });
    }

    const withdrawal = await WithdrawalRequest.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ msg: "Withdrawal request not found." });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ msg: "Request already processed." });
    }

    withdrawal.status = status;
    await withdrawal.save();

    // ✅ If approved -> deduct wallet and create transaction
    if (status === "approved") {
      const user = await User.findById(withdrawal.userId);

      if (!user) {
        return res.status(404).json({ msg: "User not found." });
      }

      // Deduct wallet balance
      user.wallet -= withdrawal.amount;
      await user.save();

      // Create wallet transaction
      await WalletTransaction.create({
        userId: user._id,
        type: "debit",
        amount: withdrawal.amount,
        note: "Withdrawal",
        status: "Success",
      });
    }

    res.json({
      msg: `Withdrawal ${status} successfully`,
      withdrawal,
    });
  } catch (error) {
    console.error("Error updating withdrawal:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
