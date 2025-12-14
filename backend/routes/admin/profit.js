import express from "express";
import User from "../../models/User.js";
import { protect, adminProtect } from "../../middleware/authMiddleware.js";

const router = express.Router();


router.get("/profit/:userId", protect, adminProtect, async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) return res.status(404).json({ msg: "User not found" });

  const pl = user.manualProfitAdjustment || 0;

  res.json({
    profitLoss: pl,
    profit: pl > 0 ? pl : 0,
    loss: pl < 0 ? Math.abs(pl) : 0
  });
});


// ⭐ Set profit exactly
router.post("/set-profit/:userId", protect, adminProtect, async (req, res) => {
  const { profit } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { manualProfitAdjustment: Number(profit) },
    { new: true }
  );

  res.json({
    msg: "Profit updated",
    manualProfitAdjustment: user.manualProfitAdjustment
  });
});

// ⭐ Add/sub profit (+/-)
router.post("/adjust-profit/:userId", protect, adminProtect, async (req, res) => {
  const { amount } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { $inc: { manualProfitAdjustment: Number(amount) } },
    { new: true }
  );

  res.json({
    msg: "Profit adjusted",
    manualProfitAdjustment: user.manualProfitAdjustment
  });
});

// ⭐ Reset profit to 0
router.post("/reset-profit/:userId", protect, adminProtect, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { manualProfitAdjustment: 0 },
    { new: true }
  );

  res.json({
    msg: "Profit reset",
    manualProfitAdjustment: user.manualProfitAdjustment
  });
});

export default router;
