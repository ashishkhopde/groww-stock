import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/submit", protect, async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      aadhaar,
      pan,
      bankAccount,
      ifsc,
      dob,
      address
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        kyc: {
          fullName,
          mobile,
          aadhaar,
          pan,
          bankAccount,
          ifsc,
          dob,
          address,
        },
        kycStatus: "pending",
      },
      { new: true }
    );

    res.json({ message: "KYC submitted successfully", kycStatus: "pending" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
