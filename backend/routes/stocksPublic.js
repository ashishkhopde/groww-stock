// backend/routes/stocksPublic.js
import express from "express";
import Stock from "../models/stock.js";
import { protect } from "../middleware/authMiddleware.js"; // user auth

const router = express.Router();

// GET /api/stocks/my  -> stocks for the logged-in user
router.get("/my", protect, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ msg: "Unauthorized" });

    // populate user basic info (optional)
    const stocks = await Stock.find({ user: userId }).populate("user", "name email");

    // return stocks array
    res.json({ stocks });
  } catch (err) {
    console.error("GET MY STOCKS ERROR:", err);
    res.status(500).json({ msg: "Server error while fetching user stocks" });
  }
});

export default router;
