import { useEffect, useState } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { ArrowUpRight, Clock, XCircle, CheckCircle } from "lucide-react";

export default function WithdrawalList() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await API.get(`/admin/wallet/history/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        // Filter only "debit" transactions (withdrawals)
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
        <div className="p-10">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Withdrawal List</h1>
          <p className="text-slate-500">
            List of all your withdrawal requests and statuses.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Recent Withdrawals</h2>
          </div>

          {withdrawals.length === 0 ? (
            <div className="p-6 text-slate-500">No withdrawals found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {withdrawals.map((w, i) => {
                const badge =
                  w.status === "Success"
                    ? "bg-emerald-100 text-emerald-700"
                    : w.status === "Failed"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-700";

                const icon =
                  w.status === "Success" ? (
                    <CheckCircle size={18} />
                  ) : w.status === "Failed" ? (
                    <XCircle size={18} />
                  ) : (
                    <Clock size={18} />
                  );

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-6 hover:bg-slate-50 transition"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${badge}`}>
                        <ArrowUpRight size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Withdrawal</p>
                        <p className="text-sm text-slate-500">{w.method}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badge}`}>
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
                      <p className="text-xs text-slate-500 flex items-center justify-end gap-1 mt-1">
                        <Clock size={12} /> {w.date}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
