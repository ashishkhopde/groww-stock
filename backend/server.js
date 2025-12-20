// // import express from "express";
// // import cors from "cors";
// import dotenv from "dotenv";
// dotenv.config();
// console.log("SERVER TEST:", process.env.MAIL_USER, process.env.MAIL_PASS);

// import express from "express";
// import cors from "cors";
// import connectDB from "./config/db.js";

// // Routes
// import authRoutes from "./routes/auth.js";
// import adminRoutes from "./routes/admin/admin.js";
// import adminUsers from "./routes/admin/users.js";
// import adminKyc from "./routes/admin/kyc.js";
// import adminStocks from "./routes/admin/stocks.js";
// import adminWallet from "./routes/admin/wallet.js";   // ✅ Only this one

// // ⭐ PUBLIC ROUTES
// import stocksPublic from "./routes/stocksPublic.js";
// import kycRoutes from "./routes/kyc.js";
// import adminProfitRoutes from "./routes/admin/profit.js";
// import profitRoutes from "./routes/profitRoutes.js";
// import paymentRoutes from "./routes/payment.js";




// const app = express();

// app.use(cors());
// app.use(express.json());

// connectDB();

// // User Routes
// app.use("/api/auth", authRoutes);

// // Admin Routes
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin/users", adminUsers);
// app.use("/api/admin/kyc", adminKyc);
// app.use("/api/admin/stocks", adminStocks);
// app.use("/api/admin/wallet", adminWallet);  // ✅ Correct
// app.use("/api/admin", adminProfitRoutes);
// app.use("/api/profit", profitRoutes);
// app.use("/api/payment", paymentRoutes);

// // Public Routes
// app.use("/api/stocks", stocksPublic);
// app.use("/api/kyc", kycRoutes);

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
// console.log("SERVER TEST:", process.env.MAIL_USER, process.env.MAIL_PASS);

const app = express();

// ------------------ MIDDLEWARE ------------------
app.use(cors());
app.use(express.json());

// ------------------ DB ------------------
connectDB();

// ------------------ ROUTES ------------------

// User Auth
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

// User KYC
import kycRoutes from "./routes/kyc.js";
app.use("/api/kyc", kycRoutes);

// Public Stocks
import stocksPublic from "./routes/stocksPublic.js";
app.use("/api/stocks", stocksPublic);

// User Profit
import profitRoutes from "./routes/profitRoutes.js";
app.use("/api/profit", profitRoutes);

// ------------------ ADMIN ROUTES ------------------
import adminRoutes from "./routes/admin/admin.js";
import adminUsers from "./routes/admin/users.js";
import adminKyc from "./routes/admin/kyc.js";
import adminStocks from "./routes/admin/stocks.js";
import adminWallet from "./routes/admin/wallet.js";
import adminProfitRoutes from "./routes/admin/profit.js";

app.use("/api/admin", adminRoutes);
app.use("/api/admin/users", adminUsers);
app.use("/api/admin/kyc", adminKyc);
app.use("/api/admin/stocks", adminStocks);
app.use("/api/admin/wallet", adminWallet);
app.use("/api/admin", adminProfitRoutes);

// ------------------ PAYMENT (NEW – NO RAZORPAY) ------------------
import paymentRoutes from "./routes/payment.js";
app.use("/api/payment", paymentRoutes);

// ------------------ ROOT ------------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ------------------ SERVER ------------------
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
