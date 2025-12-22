// middleware/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import "dotenv/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Function to upload a file to Cloudinary and delete local temp
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // images, videos, etc.
      folder: "uploads",     // optional folder in Cloudinary
    });

    // Delete local temp file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return res.secure_url; // return Cloudinary URL
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};

export { cloudinary, uploadOnCloudinary };
