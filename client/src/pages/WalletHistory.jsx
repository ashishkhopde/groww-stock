import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { ArrowUpRight, Clock, XCircle, CheckCircle } from "lucide-react";
import Footer from "../components/Footer.jsx";
import TickerStrip from "../components/TickerStrip.jsx";

export default function WithdrawalList() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function loadData() {
      if (!userId) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const res = await API.get(`/admin/wallet/history/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = (res.data || [])
          .filter((t) => t.type === "debit")
          .map((t) => ({
            id: t._id,
            amount: `-₹ ${Number(t.amount).toLocaleString("en-IN")}`,
            status: t.status || "Pending",
            method: t.note || "Bank Transfer",
            date: new Date(t.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          }));

        setWithdrawals(data);
      } catch (err) {
        console.error("Withdrawal fetch error:", err);
        setError("Failed to load withdrawal history.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId]);

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        {/* ✅ TICKER */}
        <TickerStrip />

        <div className="flex-grow p-6 lg:p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Withdrawal History
            </h1>
            <p className="text-slate-500">
              Review all your withdrawal transactions and their statuses.
            </p>
          </div>

          {/* Withdrawals Table */}
          <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                Recent Withdrawals
              </h2>
            </div>

            {/* Loader / Error / Data */}
            {loading ? (
              <div className="p-6 text-center text-slate-600">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-rose-600">{error}</div>
            ) : withdrawals.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No withdrawals found.
              </div>
            ) : (
              // ✅ Responsive horizontal scroll on smaller screens
              <div className="overflow-x-auto">
                <div className="min-w-[500px] divide-y divide-slate-100">
                  {withdrawals.map((w, i) => {
                    const badgeClass =
                      w.status === "Success"
                        ? "bg-emerald-100 text-emerald-700"
                        : w.status === "Failed"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700";

                    const icon =
                      w.status === "Success" ? (
                        <CheckCircle
                          size={18}
                          className="text-emerald-600"
                        />
                      ) : w.status === "Failed" ? (
                        <XCircle size={18} className="text-rose-600" />
                      ) : (
                        <Clock size={18} className="text-amber-600" />
                      );

                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-6 transition hover:bg-slate-50 whitespace-nowrap"
                      >
                        {/* Left - Icon + Method */}
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full bg-rose-100 text-rose-600`}>
                            <ArrowUpRight size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              Withdrawal
                            </p>
                            <p className="text-sm text-slate-500">
                              {w.method}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}
                          >
                            {w.status}
                          </span>
                        </div>

                        {/* Amount + Date */}
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              w.status === "Failed"
                                ? "text-rose-600"
                                : w.status === "Pending"
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {w.amount}
                          </p>
                          <p className="flex items-center justify-end gap-1 mt-1 text-xs text-slate-500">
                            <Clock size={12} /> {w.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ FOOTER */}
        <Footer />
      </div>
    </DashboardLayout>
  );
}
