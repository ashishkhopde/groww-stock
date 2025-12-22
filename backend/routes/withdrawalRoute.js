import express from "express";
import { adminProtect, protect } from "../middleware/authMiddleware.js";
import WithdrawalRequest from "../models/WithdrawalRequest.js";
import User from "../models/User.js";


const router = express.Router();

/**
 * @route   POST /withdrawals
 * @desc    Create a new withdrawal request
 * @access  Private (User)
 */
// ✅ Create a new withdrawal request (only amount)
router.post("/withdrawals/:id", protect, async (req, res) => {
  try {
    const { amount } = req.body; // fixed typo

    // Validation
    if (!amount) {
      return res.status(400).json({ msg: "Amount is required." });
    }

    // Create new withdrawal
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

// ✅ Get all withdrawals of a user
router.get("/withdrawals/my/:id", protect, async (req, res) => {
  try {
    // 1️⃣ Fetch user's withdrawals
    const requests = await WithdrawalRequest.find({ userId: req.params.id })
      .populate("userId", "wallet") // populate wallet only
      .sort({ createdAt: -1 })
      .select("amount status createdAt userId");

    // 2️⃣ Get user balance
    const user = await User.findById(req.params.id).select("wallet");

    res.json({
      balance: user?.wallet || 0,
      requests,
    });
  } catch (error) {
    console.error("Error fetching user withdrawals:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


/**
 * @route   GET /withdrawals
 * @desc    Get all withdrawal requests (Admin)
 * @access  Private (Admin)
 */
router.get("/admin/withdrawals", protect, adminProtect, async (req, res) => {
  try {
    // You can add admin check here if you have user.role
    const allRequests = await WithdrawalRequest.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ allRequests });
  } catch (error) {
    console.error("Error fetching all withdrawals:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   PATCH /withdrawals/:id
 * @desc    Update withdrawal status (approve / reject)
 * @access  Private (Admin)
 */
router.patch("/admin/withdrawals/:id", protect, adminProtect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status update." });
    }

    const updated = await WithdrawalRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Withdrawal request not found." });
    }

    res.json({ msg: "Withdrawal status updated successfully", updated });
  } catch (error) {
    console.error("Error updating withdrawal:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
