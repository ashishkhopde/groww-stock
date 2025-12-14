// import { useState, useEffect } from "react";
// import DashboardLayout from "../layouts/DashboardLayout";
// import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
// import API from "../api/axios";

// export default function Portfolio() {
//   // -----------------------------
//   // 1) STATES (DATA DEFINITIONS)
//   // -----------------------------
//   const [current, setCurrent] = useState(0);
//   const [invested, setInvested] = useState(0);
//   const [profit, setProfit] = useState(0);
//   const [holdings, setHoldings] = useState([]);

//   // -----------------------------
//   // 2) LOAD SAMPLE / API DATA
//   // -----------------------------
// useEffect(() => {
//   const loadPortfolio = async () => {
    
//     try {
//       const res = await API.get("/stocks/my"); // GET /api/stocks/my
//       const stocks = res.data.stocks || [];

//       // If your Stock model stores buy price in `price`, we treat it as buyPrice.
//       // If you have separate currentPrice, use that instead or fetch market prices.
//       const holdings = stocks.map(s => ({
//         symbol: s.stockName?.toUpperCase() || s.stockName,
//         qty: s.quantity,
//         buyPrice: Number(s.price),
//         currentPrice: Number(s.price), // placeholder — replace with market price later
//       }));

//       const invested = holdings.reduce((sum, h) => sum + h.buyPrice * h.qty, 0);
//       const current = holdings.reduce((sum, h) => sum + h.currentPrice * h.qty, 0);
//       const profit = current - invested;

//       setHoldings(holdings);
//       setInvested(invested);
//       setCurrent(current);
//       setProfit(profit);
//     } catch (err) {
//       console.error("Portfolio load error", err);
//       // optionally set empty state or show error
//       setHoldings([]);
//       setInvested(0);
//       setCurrent(0);
//       setProfit(0);
//     }
    
//   };

//   loadPortfolio();
// }, []);

//   // -----------------------------
//   // 3) UI RETURN
//   // -----------------------------
//   return (
//     <DashboardLayout>
//       <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-slate-900">My Portfolio</h1>
//           <p className="text-slate-500">
//             Track your investments and performance.
//           </p>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           {/* Total Portfolio Value */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//             <p className="text-sm font-medium text-slate-500">
//               Total Portfolio Value
//             </p>
//             <h2 className="text-3xl font-bold mt-2">
//               ₹ {current.toLocaleString()}
//             </h2>
//           </div>

//           {/* Invested */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//             <p className="text-sm text-slate-500 font-medium">
//               Invested Amount
//             </p>
//             <h2 className="text-2xl font-bold mt-2">
//               ₹ {invested.toLocaleString()}
//             </h2>
//           </div>

//           {/* Total Profit */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//             <p className="text-sm text-slate-500 font-medium">Overall P/L</p>

//             <div className="flex items-center gap-2 mt-2">
//               <h2
//                 className={`text-2xl font-bold ${
//                   profit >= 0 ? "text-emerald-600" : "text-rose-600"
//                 }`}
//               >
//                 ₹ {profit.toLocaleString()}
//               </h2>

//               {profit >= 0 ? (
//                 <ArrowUpRight className="text-emerald-600" />
//               ) : (
//                 <ArrowDownLeft className="text-rose-600" />
//               )}
//             </div>
//           </div>

//           {/* Today's P/L (Static for now) */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//             <p className="text-sm text-slate-500 font-medium">Today's P/L</p>
//             <div className="flex items-center gap-2 mt-2">
//               <h2 className="text-2xl font-bold text-emerald-600">+₹ 350</h2>
//               <ArrowUpRight className="text-emerald-600" />
//             </div>
//           </div>
//         </div>

//         {/* Holdings Table */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           <div className="px-6 py-4 border-b border-slate-200">
//             <h2 className="text-lg font-bold text-slate-800">Holdings</h2>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
//                 <tr>
//                   <th className="px-6 py-3 text-left">Stock</th>
//                   <th className="px-6 py-3 text-left">Qty</th>
//                   <th className="px-6 py-3 text-left">Avg Buy Price</th>
//                   <th className="px-6 py-3 text-left">Current Price</th>
//                   <th className="px-6 py-3 text-left">P/L</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100">
//                 {holdings.map((h, i) => {
//                   const pl = (h.currentPrice - h.buyPrice) * h.qty;

//                   return (
//                     <tr key={i} className="hover:bg-slate-50/70 transition">
//                       <td className="px-6 py-4 font-medium">{h.symbol}</td>
//                       <td className="px-6 py-4">{h.qty}</td>
//                       <td className="px-6 py-4">₹ {h.buyPrice}</td>
//                       <td className="px-6 py-4">₹ {h.currentPrice}</td>

//                       <td
//                         className={`px-6 py-4 font-semibold ${
//                           pl >= 0 ? "text-emerald-600" : "text-rose-600"
//                         }`}
//                       >
//                         {pl >= 0 ? "+" : ""}₹ {pl.toLocaleString()}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import API from "../api/axios";

export default function Portfolio() {
  // -----------------------------
  // STATES
  // -----------------------------
  const [current, setCurrent] = useState(0);
  const [invested, setInvested] = useState(0);
  const [profit, setProfit] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [manualProfit, setManualProfit] = useState(0);

  // -----------------------------
  // LOAD PORTFOLIO DATA
  // -----------------------------
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        // 1️⃣ Fetch user stocks
        const res = await API.get("/stocks/my");
        const stocks = res.data.stocks || [];

        const holdings = stocks.map(s => ({
          symbol: s.stockName?.toUpperCase() || s.stockName,
          qty: s.quantity,
          buyPrice: Number(s.price),
          currentPrice: Number(s.price), // static unless market data added
        }));

        const invested = holdings.reduce((sum, h) => sum + h.buyPrice * h.qty, 0);
        const current = holdings.reduce((sum, h) => sum + h.currentPrice * h.qty, 0);

        const autoProfit = current - invested;

        setHoldings(holdings);
        setInvested(invested);
        setCurrent(current);

        // 2️⃣ Fetch manual profit from backend
        const profitRes = await API.get("/profit/my"); // <-- NEW ROUTE
        const manual = profitRes.data.manualProfitAdjustment || 0;

        setManualProfit(manual);

        // 3️⃣ Final Profit = Auto P/L + Manual Adjusted P/L
        setProfit(autoProfit + manual);
      } catch (err) {
        console.error("Portfolio load error", err);

        setHoldings([]);
        setInvested(0);
        setCurrent(0);
        setProfit(0);
      }
    };

    loadPortfolio();
  }, []);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Portfolio</h1>
          <p className="text-slate-500">Track your investments and performance.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {/* Total Value */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-sm font-medium text-slate-500">Total Portfolio Value</p>
            <h2 className="text-3xl font-bold mt-2">₹ {current.toLocaleString()}</h2>
          </div>

          {/* Invested Amount */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500 font-medium">Invested Amount</p>
            <h2 className="text-2xl font-bold mt-2">₹ {invested.toLocaleString()}</h2>
          </div>

          {/* Total Profit (Admin Adjusted Included) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500 font-medium">Overall P/L</p>

            <div className="flex items-center gap-2 mt-2">
              <h2
                className={`text-2xl font-bold ${
                  profit >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                ₹ {profit.toLocaleString()}
              </h2>

              {profit >= 0 ? (
                <ArrowUpRight className="text-emerald-600" />
              ) : (
                <ArrowDownLeft className="text-rose-600" />
              )}
            </div>

            {/* Show manual profit influence */}
            <p className="text-xs text-slate-500 mt-1">
             
            </p>
          </div>

          {/* Today's P/L Static */}
          {/* <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500 font-medium">Today's P/L</p>
            <div className="flex items-center gap-2 mt-2">
              <h2 className="text-2xl font-bold text-emerald-600">+₹ 350</h2>
              <ArrowUpRight className="text-emerald-600" />
            </div>
          </div> */}
        </div>

        {/* Holdings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Holdings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left">Stock</th>
                  <th className="px-6 py-3 text-left">Qty</th>
                  <th className="px-6 py-3 text-left">Avg Buy Price</th>
                  <th className="px-6 py-3 text-left">Current Price</th>
                  <th className="px-6 py-3 text-left">P/L</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {holdings.map((h, i) => {
                  const pl = (h.currentPrice - h.buyPrice) * h.qty;

                  return (
                    <tr key={i} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4 font-medium">{h.symbol}</td>
                      <td className="px-6 py-4">{h.qty}</td>
                      <td className="px-6 py-4">₹ {h.buyPrice}</td>
                      <td className="px-6 py-4">₹ {h.currentPrice}</td>

                      <td
                        className={`px-6 py-4 font-semibold ${
                          pl >= 0 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {pl >= 0 ? "+" : ""}₹ {pl.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
