import express from "express";
import PaymentSettings from "../models/PaymentSettings.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET payment settings (Admin + User)
 */
router.get("/settings", protect, async (req, res) => {
  const settings = await PaymentSettings.findOne();
  res.json(settings || null);
});

/**
 * UPDATE payment settings (ADMIN ONLY)
 */
router.put("/settings", protect, adminProtect, async (req, res) => {
  const data = req.body;

  let settings = await PaymentSettings.findOne();

  if (!settings) {
    settings = await PaymentSettings.create(data);
  } else {
    Object.assign(settings, data);
    await settings.save();
  }

  res.json({ msg: "Payment settings updated", settings });
});

export default router;
