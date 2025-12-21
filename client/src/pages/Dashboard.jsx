import React, { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
} from "lucide-react";

/* ✅ COMPONENTS */
// import DashboardNavbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import TickerStrip from "../components/TickerStrip.jsx";

export default function ModernDashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function loadData() {
      try {
        const profileRes = await API.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(profileRes.data);

        const historyRes = await API.get(`/admin/wallet/history/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

  if (loading) return <div className="p-6">Loading...</div>;

  const totalBalance = user?.wallet || 0;
  const totalDeposit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdraw = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const recent = transactions.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

        {/* HEADER */}
        {/* <DashboardNavbar /> */}

        {/* TICKER */}
        <TickerStrip />

        {/* CONTENT */}
        <div className="flex-grow w-full px-4 py-6 mx-auto sm:px-6 lg:px-8 max-w-7xl">

          {/* TITLE */}
          <div className="mb-6">
            <h1 className="text-xl font-bold sm:text-2xl text-slate-900">
              Dashboard Overview
            </h1>
            <p className="text-sm sm:text-base text-slate-500">
              Your latest wallet and transaction insights.
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">

            <StatCard
              title="Total Balance"
              value={`₹ ${totalBalance.toLocaleString("en-IN")}`}
              icon={<Wallet size={22} />}
              color="indigo"
            />

            <StatCard
              title="Total Deposit"
              value={`₹ ${totalDeposit.toLocaleString("en-IN")}`}
              icon={<ArrowDownLeft size={22} />}
              color="emerald"
            />

            <StatCard
              title="Total Withdraw"
              value={`₹ ${totalWithdraw.toLocaleString("en-IN")}`}
              icon={<ArrowUpRight size={22} />}
              color="rose"
            />

            <StatCard
              title="Total Transactions"
              value={transactions.length}
              icon={<Users size={22} />}
              color="purple"
            />
            <StatCard
              title="referral bonus"
              value={user.referralBonus}
              icon={<Users size={22} />}
              color="purple"
            />
            <StatCard
              title="bonus"
              value={user.bonus}
              icon={<Users size={22} />}
              color="purple"
            />
          </div>

          {/* ADD BALANCE */}
          <div className="mb-6">
            <button
              onClick={() => (window.location.href = "/add-money")}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Add Balance
            </button>
          </div>

          {/* RECENT TRANSACTIONS */}
          {/* <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-100">
            <div className="p-4 border-b sm:p-6 border-slate-100">
              <h2 className="text-base font-bold sm:text-lg text-slate-800">
                Recent Transactions
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm">
                <thead className="text-xs font-semibold uppercase bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Note</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50">
                      <td className="flex items-center gap-2 px-4 py-3 font-semibold">
                        {tx.type === "credit" ? (
                          <ArrowDownLeft size={16} className="text-emerald-600" />
                        ) : (
                          <ArrowUpRight size={16} className="text-rose-600" />
                        )}
                        {tx.type.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {tx.note || "—"}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${
                          tx.type === "credit"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {tx.type === "credit" ? "+₹" : "-₹"}{" "}
                        {tx.amount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}

        </div>

        {/* FOOTER */}
        <Footer />
      </div>
    </DashboardLayout>
  );
}

/* ================= STAT CARD COMPONENT ================= */
function StatCard({ title, value, icon, color }) {
  const bgMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="p-5 bg-white border shadow-sm sm:p-6 rounded-2xl border-slate-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium sm:text-sm text-slate-500">
            {title}
          </p>
          <h3 className="text-xl font-bold sm:text-2xl text-slate-800">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${bgMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
