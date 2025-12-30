import express from "express";
import PaymentSettings from "../models/PaymentSettings.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";
import { uploadOnCloudinary } from "../cloudnary.js";

const router = express.Router();

/**
 * GET payment settings (USED BY USER + ADMIN)
 * ❌ BUG FIX: removed `protect`
 * ✅ Everything else unchanged
 */
router.get("/settings", async (req, res) => {
  try {
    const settings = await PaymentSettings.findOne();
    res.json(settings || null);
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * UPDATE payment settings (ADMIN ONLY)
 * ✅ UNCHANGED
 */
router.put(
  "/settings",
  protect,
  adminProtect,
  upload.single("logo"),
  async (req, res) => {
    try {
      const data = { ...req.body };

      if (req.file && req.file.path) {
        const cloudUrl = await uploadOnCloudinary(req.file.path);
        data.qrImage = cloudUrl;
      }

      const settings = await PaymentSettings.findOneAndUpdate(
        {},
        data,
        { new: true, upsert: true }
      );

      res.json({ msg: "Payment settings updated", settings });
    } catch (error) {
      console.error("Error updating payment settings:", error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

export default router;
