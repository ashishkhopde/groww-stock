import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Users,
  Shield,
  PlusCircle,
  Landmark,
  CreditCard,
  LogOut
} from "lucide-react";

export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    sessionStorage.clear();
    window.location.href = "/admin/login";
  };

  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
        <p className="text-slate-600">Manage Platform Operations</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          {/* Users */}
          <AdminCard
            title="Manage Users"
            icon={<Users size={28} />}
            link="/admin/users"
          />

          {/* KYC */}
          <AdminCard
            title="KYC Approvals"
            icon={<Shield size={28} />}
            link="/admin/kyc"
          />

          {/* Stocks */}
          <AdminCard
            title="Stocks Management"
            icon={<PlusCircle size={28} />}
            link="/admin/stocks"
          />

          {/* Wallet */}
          <AdminCard
            title="Wallet Control"
            icon={<Landmark size={28} />}
            link="/admin/wallet"
          />

          {/* Payments */}
          <AdminCard
            title="Manage Payments"
            icon={<CreditCard size={28} />}
            link="/admin/payment-settings"
          />

          {/* 🔴 Logout */}
          <div
            onClick={handleLogout}
            className="p-6 bg-red-50 rounded-2xl border border-red-200
                       shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <div className="flex gap-3 items-center text-red-600">
              <LogOut size={28} />
              <h2 className="text-xl font-semibold">Logout</h2>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function AdminCard({ title, icon, link }) {
  return (
    <div
      onClick={() => (window.location.href = link)}
      className="p-6 bg-white rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition"
    >
      <div className="flex gap-3 items-center text-slate-800">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
    </div>
  );
}
