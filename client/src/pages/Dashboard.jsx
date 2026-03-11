import React, { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import Footer from "../components/Footer.jsx";
import TickerStrip from "../components/TickerStrip.jsx";

export default function ModernDashboard() {

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalProfit, setTotalProfit] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);

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

    const loadStocks = async () => {
      try {

        const token = localStorage.getItem("token");

        const res = await API.get("/stocks/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const stocks = res.data.stocks || [];

        const profit = stocks.reduce((sum, s) => sum + (Number(s.profit) || 0), 0);
        const loss = stocks.reduce((sum, s) => sum + (Number(s.loss) || 0), 0);

        setTotalProfit(profit - loss);
        setTotalLoss(loss);

      } catch (error) {
        console.error(error);
      }
    };

    loadStocks();
    loadData();

  }, [userId]);


  if (loading) return <div className="p-6">Loading...</div>;



  /* ================= CALCULATIONS ================= */

  const totalDeposit = transactions
    .filter(
      (t) =>
        t.type === "credit" &&
        t.note !== "Stock Profit Update"
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  const depositAfterLoss = totalDeposit - totalLoss;

  const totalWithdraw = transactions
    .filter((t) => t.note === "Withdrawal")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalBalance = user?.wallet || 0;



  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

        <TickerStrip />

        <div className="flex-grow w-full px-4 py-3 mx-auto sm:px-6 lg:px-8 max-w-5xl">

          <div className="mb-6">
            <h1 className="text-xl font-bold sm:text-2xl text-slate-900">
              Dashboard Overview
            </h1>
            <p className="text-sm sm:text-base text-slate-500">
              Your latest wallet and transaction insights.
            </p>
          </div>


          {/* ================= STATS ================= */}

          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">

            <StatCard
              title="Total Balance"
              value={`₹ ${totalBalance.toLocaleString("en-IN")}`}
              icon="💰"
              color="navy"
            />

            <StatCard
              title="Total Deposit"
              value={`₹ ${depositAfterLoss.toLocaleString("en-IN")}`}
              icon="⬇️"
              color="navy"
            />

            <StatCard
              title="Total Withdraw"
              value={`₹ ${totalWithdraw.toLocaleString("en-IN")}`}
              icon="⬆️"
              color="navy"
            />

            <StatCard
              title="Total Profit"
              value={`₹ ${totalProfit.toLocaleString("en-IN")}`}
              icon="📊"
              color="navy"
            />

            <StatCard
              title="Referral Bonus"
              value={`₹ ${user.referralBonus}`}
              icon="🎉"
              color="navy"
            />

            <StatCard
              title="Bonus"
              value={`₹ ${user.bonus}`}
              icon="🎁"
              color="navy"
            />

          </div>


          {/* ================= BUTTONS ================= */}

          <div className="flex gap-4 mb-6">

            <button
              onClick={() => (window.location.href = "/add-money")}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Add Balance
            </button>

            <button
              onClick={() => (window.location.href = "/withdrawal-request")}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Withdrawal Requests
            </button>

          </div>

        </div>

        <Footer />

      </div>
    </DashboardLayout>
  );
}



/* ================= STAT CARD ================= */

function StatCard({ title, value, icon, color }) {

  const iconBgMap = {
    navy: "bg-gradient-to-br from-[#0F172A] to-[#1E293B]",
    emerald: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    rose: "bg-gradient-to-br from-rose-500 to-rose-600",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600",
  };

  return (
    <div className="p-5 bg-white border shadow-sm sm:p-6 rounded-2xl border-slate-100">

      <div className="flex items-center justify-between">

        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">
            {title}
          </p>

          <h3 className="text-xl font-bold text-slate-800">
            {value}
          </h3>
        </div>

        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md ${iconBgMap[color]}`}
        >
          <span className="text-lg">{icon}</span>
        </div>

      </div>

    </div>
  );
}
