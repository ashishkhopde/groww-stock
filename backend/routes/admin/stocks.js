import express from "express";
import Stock from "../../models/stock.js";
import User from "../../models/User.js";
import WalletTransaction from "../../models/WalletTransaction.js";
import { protect, adminProtect } from "../../middleware/authMiddleware.js";

const router = express.Router();

/* ===================== ADD STOCK ===================== */
router.post("/add", protect, adminProtect, async (req, res) => {
  try {
    const {
      userId,
      stockName,
      price,
      quantity,
      profit = 0,
      loss = 0,
      sale = 0,
    } = req.body;

    if (!userId || !stockName || !price || !quantity)
      return res.status(400).json({ msg: "Missing fields" });

    const stock = await Stock.create({
      user: userId,
      stockName,
      price,
      quantity,
      profit,
      loss,
      sale,
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
    const { stockName, price, quantity, profit, loss, sale } = req.body;

    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ msg: "Stock not found" });

    const user = await User.findById(stock.user);
    if (!user) return res.status(404).json({ msg: "User not found" });

    /* ---------- NORMAL FIELD UPDATE ---------- */
    stock.stockName = stockName || stock.stockName;
    stock.price = price !== undefined ? Number(price) : stock.price;
    stock.quantity = quantity !== undefined ? Number(quantity) : stock.quantity;

    /* ================= PROFIT UPDATE ================= */
    if (profit !== undefined) {
      const newProfit = Number(profit);
      const diff = newProfit - stock.profit;

      if (diff !== 0) {
        user.wallet += diff;
        await user.save();

        await WalletTransaction.create({
          userId: user._id,
          type: diff > 0 ? "credit" : "debit",
          amount: Math.abs(diff),
          note: "Stock Profit Update",
          status: "Success",
        });
      }

      stock.profit = newProfit;
    }

    /* ================= LOSS UPDATE ================= */
    if (loss !== undefined) {
      const newLoss = Number(loss);
      const diff = newLoss - stock.loss;

      if (diff !== 0) {
        user.wallet -= diff;
        await user.save();

        await WalletTransaction.create({
          userId: user._id,
          type: "debit",
          amount: Math.abs(diff),
          note: "Stock Loss Update",
          status: "Success",
        });
      }

      stock.loss = newLoss;
    }

    /* ================= SALE UPDATE ================= */
    if (sale !== undefined) {
      stock.sale = Number(sale);
    }

    const updated = await stock.save();

    res.json({
      msg: "Stock updated successfully ✅",
      updated,
    });
  } catch (error) {
    console.error("UPDATE STOCK ERROR:", error);
    res.status(500).json({ msg: "Server error while updating stock" });
  }
});

/* ===================== DELETE STOCK ===================== */
  router.delete("/:id", protect, adminProtect, async (req, res) => {
    try {
      const stock = await Stock.findById(req.params.id);

      if (!stock) return res.status(404).json({ msg: "Stock not found" });

      const user = await User.findById(stock.user);

      if (!user) return res.status(404).json({ msg: "User not found" });

      const net = stock.profit - stock.loss;

      // reset wallet effect
      user.wallet -= net;
      await user.save();

      await WalletTransaction.create({
        userId: user._id,
        type: net > 0 ? "debit" : "credit",
        amount: Math.abs(net),
        note: "Stock Reset",
        status: "Success",
      });

      await stock.deleteOne();

      res.json({ msg: "Stock deleted and wallet adjusted" });

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
