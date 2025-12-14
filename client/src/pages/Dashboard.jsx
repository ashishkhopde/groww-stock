
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  DollarSign
} from "lucide-react";

export default function ModernDashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch User Profile (Wallet Balance)
        const profileRes = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        setUser(profileRes.data);

        // Fetch Wallet Transactions
        const historyRes = await API.get(`/admin/wallet/history/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        setTransactions(historyRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId]);

  if (loading) return <div className="p-10">Loading...</div>;

  // 🧮 CALCULATIONS
  const totalBalance = user?.wallet || 0;

  const totalDeposit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdraw = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const recent = transactions.slice(0, 5); // Show latest 5

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Your latest wallet and transaction insights.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          
          {/* Total Wallet Balance */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Balance</p>
                <h3 className="text-2xl font-bold text-slate-800">₹ {totalBalance.toLocaleString("en-IN")}</h3>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <Wallet size={22} />
              </div>
            </div>
          </div>

          {/* Total Deposit */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Deposit</p>
                <h3 className="text-2xl font-bold text-slate-800">₹ {totalDeposit.toLocaleString("en-IN")}</h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <ArrowDownLeft size={22} />
              </div>
            </div>
          </div>

          {/* Total Withdraw */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Withdraw</p>
                <h3 className="text-2xl font-bold text-slate-800">₹ {totalWithdraw.toLocaleString("en-IN")}</h3>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
                <ArrowUpRight size={22} />
              </div>
            </div>
          </div>

          {/* Total Transactions Count */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Transactions</p>
                <h3 className="text-2xl font-bold text-slate-800">{transactions.length}</h3>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                <Users size={22} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
  <button
    onClick={() => window.location.href = "/add-money"}
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
  >
    Add Balance
  </button>
</div>

      
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
          </div>
        
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Note</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-2">
                      {tx.type === "credit" ? (
                        <ArrowDownLeft size={16} className="text-emerald-600" />
                      ) : (
                        <ArrowUpRight size={16} className="text-rose-600" />
                      )}
                      {tx.type.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{tx.note || "—"}</td>
                    <td
                      className={`px-6 py-4 text-right font-bold ${
                        tx.type === "credit" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {tx.type === "credit" ? "+₹" : "-₹"} {tx.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
