import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { ArrowUpRight, Clock, XCircle, CheckCircle } from "lucide-react";
import Footer from "../components/Footer.jsx";
import TickerStrip from "../components/TickerStrip.jsx";

export default function WithdrawalList() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await API.get(`/admin/wallet/history/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = res.data
          .filter((t) => t.type === "debit")
          .map((t) => ({
            amount: `-₹ ${t.amount}`,
            status: t.status || "Pending",
            method: t.note || "Bank Transfer",
            date: new Date(t.createdAt).toLocaleDateString("en-IN"),
          }));

        setWithdrawals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId]);

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-slate-600">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <TickerStrip />

        <div className="flex-grow p-4 sm:p-6 lg:p-10">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl font-bold sm:text-2xl text-slate-900">
              Withdrawal List
            </h1>
            <p className="text-sm text-slate-500 sm:text-base">
              List of all your withdrawal requests and statuses.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-base font-bold sm:text-lg text-slate-900">
                Recent Withdrawals
              </h2>
            </div>

            {withdrawals.length === 0 ? (
              <div className="p-5 text-sm text-center text-slate-500 sm:text-base">
                No withdrawals found.
              </div>
            ) : (
              // ✅ Scrollable horizontally on small screens
              <div className="overflow-x-auto">
                <div className="min-w-[450px] divide-y divide-slate-100">
                  {withdrawals.map((w, i) => {
                    const badge =
                      w.status === "Success"
                        ? "bg-emerald-100 text-emerald-700"
                        : w.status === "Failed"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700";

                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 transition sm:p-4 hover:bg-slate-50 whitespace-nowrap"
                      >
                        {/* Left */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-2 sm:p-3 rounded-full ${badge}`}>
                            <ArrowUpRight size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 sm:text-base">
                              Withdrawal
                            </p>
                            <p className="text-xs sm:text-sm text-slate-500">
                              {w.method}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <span
                            className={`px-2 sm:px-3 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full ${badge}`}
                          >
                            {w.status}
                          </span>
                        </div>

                        {/* Amount + Date */}
                        <div className="text-right">
                          <p
                            className={`font-bold text-sm sm:text-base ${
                              w.status === "Failed"
                                ? "text-rose-600"
                                : w.status === "Pending"
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {w.amount}
                          </p>
                          <p className="text-[10px] sm:text-xs text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                            <Clock size={11} /> {w.date}
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

        <Footer />
      </div>
    </DashboardLayout>
  );
}
