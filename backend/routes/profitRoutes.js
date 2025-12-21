import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ⭐ USER SIDE: Get their own manual profit set by admin
router.get("/my", protect, async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    manualProfitAdjustment: user.manualProfitAdjustment || 0
  });
});



export default router;
