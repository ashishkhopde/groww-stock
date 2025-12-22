// middleware/multer.js
import fs from "fs";
import path from "path";
import multer from "multer";

// Determine upload path
const isServerless = !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.VERCEL;
const uploadPath = isServerless
  ? path.join("/tmp", "temp")
  : path.join(process.cwd(), "public/temp");

// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Export Multer middleware
const upload = multer({ storage });

export { upload, uploadPath }; // export uploadPath so Cloudinary can use it
