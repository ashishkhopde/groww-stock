import express from "express";
import { adminProtect, protect } from "../middleware/authMiddleware.js";
import WithdrawalRequest from "../models/WithdrawalRequest.js";

const router = express.Router();

/**
 * @route   POST /withdrawals
 * @desc    Create a new withdrawal request
 * @access  Private (User)
 */
router.post("/:id", protect, async (req, res) => {
  try {
    const { amount, method, accountDetails, note } = req.body;

    if (!amount || !method) {
      return res.status(400).json({ msg: "Amount and method are required." });
    }

    const newRequest = await WithdrawalRequest.create({
      userId: req.params.id,
      amount,
      method,
      accountDetails,
      note,
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
 * @route   GET /withdrawals/my
 * @desc    Get all withdrawal requests for logged-in user
 * @access  Private (User)
 */
router.get("/my/:id", protect, async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find({ userId : req.params.id })
      .sort({ createdAt: -1 })
      .select("amount method status note createdAt");

    res.json({ requests });
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
router.get("/", protect, adminProtect, async (req, res) => {
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
router.patch("/:id", protect, adminProtect, async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status update." });
    }

    const updated = await WithdrawalRequest.findByIdAndUpdate(
      req.params.id,
      { status, note },
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
