// Load env FIRST (critical for email OTP)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import User from "../models/User.js";
import Otp from "../models/otp.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================================
   DEBUG ENV
============================================================ */
console.log("AUTH FILE PATH:", import.meta.url);
console.log("ENV TEST:", process.env.MAIL_USER, process.env.MAIL_PASS);

/* ============================================================
   EMAIL TRANSPORT (GMAIL SMTP)
============================================================ */
const emailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Verify email config
emailTransport.verify((err) => {
  if (err) console.error("EMAIL CONFIG ERROR ❌", err);
  else console.log("EMAIL SERVER READY ✅");
});

/* ============================================================
   SEND EMAIL OTP
============================================================ */
router.post("/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ msg: "Email is required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ msg: "Email already registered" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // Delete old OTPs
    await Otp.deleteMany({ email });

    // Save OTP
    await Otp.create({
      email,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send Email
    await emailTransport.sendMail({
      from: `"Auth Service" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your Email Verification OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    console.log("EMAIL OTP:", otp);
    console.log(`OTP sent to ${email}`);
    console.log("ENV MAIL USER:", process.env.MAIL_USER);
    console.log(emailTransport);
    res.json({ msg: "OTP sent to email 📧" });

  } catch (error) {
    console.error("SEND EMAIL OTP ERROR:", error);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
});

/* ============================================================
   VERIFY EMAIL OTP & REGISTER USER
============================================================ */
router.post("/verify-email-otp", async (req, res) => {
  try {
    const { email, otp, name, phone, password } = req.body;

    if (!email || !otp || !name || !password)
      return res.status(400).json({ msg: "Missing fields" });

    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord)
      return res.status(400).json({ msg: "No OTP found" });

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ msg: "OTP expired" });
    }

    const otpMatch = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!otpMatch)
      return res.status(400).json({ msg: "Invalid OTP" });

    const exists = await User.findOne({ email });
    if (exists) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ msg: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: passwordHash,
    });

    await Otp.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Email verified! Registration complete 🎉",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("VERIFY EMAIL OTP ERROR:", error);
    res.status(500).json({ msg: "OTP verification failed" });
  }
});

/* ============================================================
   PHONE OTP (DEV MODE)
============================================================ */
router.post("/send-otp-register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password)
      return res.status(400).json({ msg: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ msg: "Email already registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpHash = await bcrypt.hash(otp, 10);
    const passwordHash = await bcrypt.hash(password, 10);

    await Otp.deleteMany({ phone });

    await Otp.create({
      phone,
      email,
      name,
      otpHash,
      passwordHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log("PHONE OTP:", otp);
    res.json({ msg: "OTP generated (dev)", otp });

  } catch (error) {
    res.status(500).json({ msg: "Failed to send phone OTP" });
  }
});

/* ============================================================
   LOGIN
============================================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login Successful 😊",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ msg: "Login failed" });
  }
});

/* ============================================================
   PROFILE (PROTECTED)
============================================================ */
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

export default router;
