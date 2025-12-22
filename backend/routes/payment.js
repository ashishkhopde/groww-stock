import express from "express";
import PaymentSettings from "../models/PaymentSettings.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js"; // Multer to temporarily store file
import { uploadOnCloudinary } from "../cloudnary.js"; // your Cloudinary helper
import fs from "fs";

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
 * UPDATE payment settings (Admin only) with Cloudinary file upload
 */
router.put(
  "/settings",
  protect,
  adminProtect,
  upload.single("logo"), // Multer saves temporarily to public/temp
  async (req, res) => {
    try {
      const data = req.body;

      if (req.file && req.file.path) {
        // Upload file to Cloudinary
        const cloudRes = await uploadOnCloudinary(req.file.path);
        data.qrImage = cloudRes.secure_url; // Save Cloudinary URL

        // Multer already created local file; your helper deletes it after upload
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
