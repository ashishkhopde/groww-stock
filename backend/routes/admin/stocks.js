import express from "express";
import Stock from "../../models/stock.js";

import { protect, adminProtect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// -------------------- ADD STOCK --------------------
router.post("/add", protect, adminProtect, async (req, res) => {
  console.log("REQ.BODY RECEIVED FROM FRONTEND:", req.body);

  const { userId, stockName, price, quantity } = req.body;

  if (!userId || !stockName || !price || !quantity) {
    return res.status(400).json({ msg: "Missing fields", body: req.body });
  }

  const stock = await Stock.create({
    user: userId,
    stockName,
    price,
    quantity
  });

  res.json({ msg: "Stock added successfully", stock });
});


// -------------------- UPDATE STOCK --------------------
router.put("/:id", protect, adminProtect, async (req, res) => {
  try {
    const { stockName, price, quantity } = req.body;

    const updated = await Stock.findByIdAndUpdate(
      req.params.id,
      {
        stockName,
        price: Number(price),
        quantity: Number(quantity)
      },
      { new: true }
    );

    res.json({ msg: "Stock updated", updated });
  } catch (error) {
    console.error("UPDATE STOCK ERROR:", error);
    res.status(500).json({ msg: "Server error while updating stock" });
  }
});

// -------------------- DELETE STOCK --------------------
router.delete("/:id", protect, adminProtect, async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ msg: "Stock deleted" });
  } catch (error) {
    console.error("DELETE STOCK ERROR:", error);
    res.status(500).json({ msg: "Server error while deleting stock" });
  }
});

// -------------------- GET ALL STOCKS --------------------
router.get("/", protect, adminProtect, async (req, res) => {
  try {
    const stocks = await Stock.find().populate("user", "name email");
    res.json(stocks);
  } catch (error) {
    console.error("GET STOCKS ERROR:", error);
    res.status(500).json({ msg: "Server error while fetching stocks" });
  }
});
export default router;
