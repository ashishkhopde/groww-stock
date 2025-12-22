import express from "express";
import PaymentSettings from "../models/PaymentSettings.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js"; // Multer temporary storage
import { uploadOnCloudinary } from "../cloudnary.js"; // Cloudinary helper

const router = express.Router();

/**
 * GET payment settings (Admin + User)
 */
router.get("/settings", protect, async (req, res) => {
  try {
    const settings = await PaymentSettings.findOne();
    res.json(settings || null);
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * UPDATE payment settings (Admin only) with optional Cloudinary file upload
 */
router.put(
  "/settings",
  protect,
  adminProtect,
  upload.single("logo"), // Multer stores temporarily
  async (req, res) => {
    try {
      const data = { ...req.body };

      if (req.file && req.file.path) {
        // Upload file to Cloudinary and get URL
        const cloudUrl = await uploadOnCloudinary(req.file.path);
        data.qrImage = cloudUrl; // Save Cloudinary URL
      }

      const settings = await PaymentSettings.findOneAndUpdate(
        {},
        data,
        { new: true, upsert: true } // create if not exists
      );

      res.json({ msg: "Payment settings updated", settings });
    } catch (error) {
      console.error("Error updating payment settings:", error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

export default router;
