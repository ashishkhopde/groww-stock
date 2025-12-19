// // src/pages/WalletHistory.jsx
// import { useEffect, useState } from "react";
// import { ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon, Clock } from "lucide-react";
// import DashboardLayout from "../layouts/DashboardLayout";
// import API from "../api/axios"; // adjust path if your axios wrapper is elsewhere

// export default function WalletHistory() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Decide which userId to show history for:
//   // - If admin dashboard: you might pass userId via props or select a user.
//   // - For a user view, use the logged-in user's id (example below)
//   const userId = localStorage.getItem("userId"); // change if you use context/route param

//   useEffect(() => {
//     if (!userId) {
//       setError("No user selected / logged in.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     API.get(`/admin/wallet/history/${userId}`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
//     })
//       .then((res) => {
//         setTransactions(res.data || []);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch wallet history:", err);
//         setError(err?.response?.data?.message || "Failed to load history");
//       })
//       .finally(() => setLoading(false));
//   }, [userId]);

//   const formatted = transactions.map((t) => {
//     const isCredit = t.type === "credit";
//     return {
//       id: t._id,
//       type: isCredit ? "Deposit" : "Withdrawal",
//       rawType: t.type,
//       amount: `${isCredit ? "+₹ " : "-₹ "}${Number(t.amount).toLocaleString("en-IN")}`,
//       mode: t.note || "Wallet Update",
//       date: new Date(t.createdAt).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }),
//       status: t.status || "Success",
//       color: isCredit ? "text-emerald-600" : "text-rose-600",
//       iconBg: isCredit ? "bg-emerald-100" : "bg-rose-100",
//       iconColor: isCredit ? "text-emerald-600" : "text-rose-600",
//       icon: isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />,
//     };
//   });

//   return (
//     <DashboardLayout>
//       <div className="p-6 lg:p-10">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-slate-900">Wallet History</h1>
//           <p className="text-slate-500">Track all your deposits and withdrawals.</p>
//         </div>

//         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="text-sm text-slate-500 mb-1">Available Balance</p>
//               {/* Optionally fetch and show real balance from user data */}
//               <h2 className="text-3xl font-bold text-slate-900">₹ {/* TODO: dynamic balance */} </h2>
//             </div>

//             <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600">
//               <WalletIcon size={30} />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="p-6 border-b border-slate-100 flex justify-between items-center">
//             <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>
//           </div>

//           {loading ? (
//             <div className="p-6 text-center">Loading...</div>
//           ) : error ? (
//             <div className="p-6 text-center text-rose-600">{error}</div>
//           ) : formatted.length === 0 ? (
//             <div className="p-6 text-center text-slate-500">No transactions found.</div>
//           ) : (
//             <div className="divide-y divide-slate-100">
//               {formatted.map((t) => (
//                 <div
//                   key={t.id}
//                   className="flex items-center justify-between p-6 hover:bg-slate-50 transition"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className={`p-3 rounded-full ${t.iconBg} ${t.iconColor}`}>{t.icon}</div>

//                     <div>
//                       <p className="text-slate-900 font-semibold">{t.type}</p>
//                       <p className="text-sm text-slate-500">{t.mode}</p>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <span
//                       className={`text-xs font-semibold px-3 py-1 rounded-full ${
//                         t.status === "Success" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
//                       }`}
//                     >
//                       {t.status}
//                     </span>
//                   </div>

//                   <div className="text-right">
//                     <p className={`font-bold ${t.color}`}>{t.amount}</p>
//                     <p className="text-xs text-slate-500 flex items-center justify-end gap-1 mt-1">
//                       <Clock size={12} /> {t.date}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
// src/pages/WalletHistory.jsx
import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon, Clock } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

/* ✅ ADDED */
import DashboardNavbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import TickerStrip from "../components/TickerStrip.jsx";

export default function WalletHistory() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  const fetchBalance = async () => {
    try {
      const res = await API.get(`/auth/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBalance(res.data.wallet || 0);
    } catch (err) {
      console.error("Balance fetch error:", err);
    }
  };

  const fetchHistory = async () => {
    if (!userId) {
      setError("No userId found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await API.get(`/admin/wallet/history/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactions(res.data || []);
    } catch (err) {
      console.error("History fetch error:", err);
      setError("Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, []);

  const formatted = transactions.map((t) => {
    const isCredit = t.type === "credit";
    return {
      id: t._id,
      type: isCredit ? "Deposit" : "Withdrawal",
      amount: `${isCredit ? "+₹" : "-₹"} ${Number(t.amount).toLocaleString("en-IN")}`,
      mode: t.note || "Wallet Update",
      date: new Date(t.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: t.status || "Success",
      color: isCredit ? "text-emerald-600" : "text-rose-600",
      iconBg: isCredit ? "bg-emerald-100" : "bg-rose-100",
      iconColor: isCredit ? "text-emerald-600" : "text-rose-600",
      icon: isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />,
    };
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

        {/* ✅ HEADER */}
        <DashboardNavbar />

        {/* ✅ TICKER */}
        <TickerStrip />

        {/* ===== PAGE CONTENT ===== */}
        <div className="flex-grow p-6 lg:p-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Wallet History
            </h1>
            <p className="text-slate-500">
              Track all your deposits and withdrawals.
            </p>
          </div>

          {/* Balance Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500 mb-1">
                  Available Balance
                </p>
                <h2 className="text-3xl font-bold text-slate-900">
                  ₹ {balance.toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600">
                <WalletIcon size={30} />
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">
                Transaction History
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-rose-600">
                {error}
              </div>
            ) : formatted.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No transactions found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {formatted.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-6 hover:bg-slate-50 transition"
                  >
                    {/* icon & text */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-full ${t.iconBg} ${t.iconColor}`}
                      >
                        {t.icon}
                      </div>
                      <div>
                        <p className="text-slate-900 font-semibold">
                          {t.type}
                        </p>
                        <p className="text-sm text-slate-500">
                          {t.mode}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          t.status === "Success"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    {/* Amount + Date */}
                    <div className="text-right">
                      <p className={`font-bold ${t.color}`}>
                        {t.amount}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center justify-end gap-1 mt-1">
                        <Clock size={12} /> {t.date}
                      </p>
                    </div>
                  </div>
                ))}
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
