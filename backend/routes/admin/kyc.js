import express from "express";
import User from "../../models/User.js";
import { protect, adminProtect} from "../../middleware/authMiddleware.js";

const router = express.Router();

// GET ALL PENDING KYC REQUESTS  ✅ must be before /:id
router.get("/pending", protect, adminProtect, async (req, res) => {
  const pending = await User.find({ kycStatus: "pending" });
  res.json(pending);
});

// GET SPECIFIC USER KYC DETAILS
router.get("/:id", protect, adminProtect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email mobile kyc kycStatus createdAt"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("KYC detail error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// APPROVE KYC
router.post("/approve/:id", protect, adminProtect, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { kycStatus: "approved" });
  res.json({ msg: "KYC approved" });
});

// REJECT KYC
router.post("/reject/:id", protect, adminProtect, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { kycStatus: "rejected" });
  res.json({ msg: "KYC rejected" });
});

export default router;
