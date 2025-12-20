import express from "express";
import Stock from "../../models/stock.js";
import { protect, adminProtect } from "../../middleware/authMiddleware.js";

const router = express.Router();

/* ===================== ADD STOCK ===================== */
router.post("/add", protect, adminProtect, async (req, res) => {
  try {
    const { userId, stockName, price, quantity, profit = 0, loss = 0 } = req.body;

    if (!userId || !stockName || !price || !quantity)
      return res.status(400).json({ msg: "Missing fields" });

    const stock = await Stock.create({
      user: userId,
      stockName,
      price,
      quantity,
      profit,
      loss,
    });

    res.json({ msg: "Stock added successfully", stock });
  } catch (error) {
    console.error("ADD STOCK ERROR:", error);
    res.status(500).json({ msg: "Server error while adding stock" });
  }
});

/* ===================== UPDATE STOCK ===================== */
router.put("/:id", protect, adminProtect, async (req, res) => {
  try {
    const { stockName, price, quantity, profit, loss } = req.body;

    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ msg: "Stock not found" });

    stock.stockName = stockName || stock.stockName;
    stock.price = price !== undefined ? Number(price) : stock.price;
    stock.quantity = quantity !== undefined ? Number(quantity) : stock.quantity;
    stock.profit = profit !== undefined ? Number(profit) : stock.profit;
    stock.loss = loss !== undefined ? Number(loss) : stock.loss;

    const updated = await stock.save();
    res.json({ msg: "Stock updated successfully", updated });
  } catch (error) {
    console.error("UPDATE STOCK ERROR:", error);
    res.status(500).json({ msg: "Server error while updating stock" });
  }
});

/* ===================== DELETE STOCK ===================== */
router.delete("/:id", protect, adminProtect, async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ msg: "Stock deleted successfully" });
  } catch (error) {
    console.error("DELETE STOCK ERROR:", error);
    res.status(500).json({ msg: "Server error while deleting stock" });
  }
});

/* ===================== GET ALL STOCKS ===================== */
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
