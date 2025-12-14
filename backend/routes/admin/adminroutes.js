// import express from "express";
// import User from "../../models/User.js";
// import { protect, adminProtect } from "../../middleware/authMiddleware.js";
// ;

// const router = express.Router();

// /* ---------------------- GET ALL USERS ---------------------- */
// router.get("/users", protect, adminProtect, async (req, res) => {
//   const users = await User.find().select("-password");
//   res.json(users);
// });

// /* ---------------------- APPROVE KYC ---------------------- */
// router.put("/users/kyc-approve/:id", protect, adminProtect, async (req, res) => {
//   await User.findByIdAndUpdate(req.params.id, { kycApproved: true });
//   res.json({ msg: "KYC Approved" });
// });

// /* ---------------------- REJECT KYC ---------------------- */
// router.put("/users/kyc-reject/:id", protect, adminProtect, async (req, res) => {
//   await User.findByIdAndUpdate(req.params.id, { kycApproved: false });
//   res.json({ msg: "KYC Rejected" });
// });

// /* ---------------------- BLOCK / UNBLOCK USER ---------------------- */
// router.put("/users/toggle-block/:id", protect, adminProtect, async (req, res) => {
//   const user = await User.findById(req.params.id);
//   user.blocked = !user.blocked;
//   await user.save();
//   res.json({ msg: "User block status updated", blocked: user.blocked });
// });

// export default router;
