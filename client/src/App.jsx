import { BrowserRouter, Routes, Route } from "react-router-dom";

// User Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portfolio from "./pages/Portfolio";
import PlanList from "./pages/PlanList";
import WalletHistory from "./pages/WalletHistory";
import WithdrawalList from "./pages/WithdrawalList";
import Profile from "./pages/Profile";
import Deposit from "./pages/Deposit";
import KYCPage from "./pages/KYCPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminKyc from "./pages/admin/AdminKyc";
import KYCDetails from "./pages/admin/KYCDetails";
import AdminStocks from "./pages/admin/AdminStocks";
import AdminWallet from "./pages/admin/AdminWallet";
import AdminLogin from "./pages/admin/Adminlogin";
import AddMoney from "./pages/AddMoney";
import PaymentPage from "./pages/PaymentPage";
import AdminPaymentSettings from "./pages/admin/AdminPaymentSettings";

// Layouts
import AdminLayout from "./layouts/AdminLayout";

// Middleware
import AdminRoute from "./middleware/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/kyc" element={<KYCPage />} />
        <Route path="/add-money" element={<AddMoney />} />
        <Route path="/payment/:method" element={<PaymentPage />} />

        {/* User Authenticated */}
        <Route path="/dashboard" element={<PrivateRoute>
          <Dashboard />
        </PrivateRoute>} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/plans" element={<PlanList />} />
        <Route path="/wallet" element={<WalletHistory />} />
        <Route path="/withdrawal" element={<WithdrawalList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/deposit" element={<Deposit />} />

        {/* Admin Login (Public) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN PROTECTED ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="kyc" element={<AdminKyc />} />
          <Route path="kyc/:id" element={<KYCDetails />} />
          <Route path="stocks" element={<AdminStocks />} />
          <Route path="wallet" element={<AdminWallet />} />
          <Route path="payment-settings" element={<AdminPaymentSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
