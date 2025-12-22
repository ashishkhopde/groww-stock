import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import "dotenv/config";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // console.log(res);
        // console.log("File uploaded to Cloudinary successfully:", res.secure_url);
        fs.unlinkSync(localFilePath);
        return res;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.error("Error uploading file to Cloudinary:", error);
        throw error;
    }
};

export { uploadOnCloudinary };
