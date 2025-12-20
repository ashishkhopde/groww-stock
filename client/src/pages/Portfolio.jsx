import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import Footer from "../components/Footer.jsx";
import TickerStrip from "../components/TickerStrip.jsx";

export default function Portfolio() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const [invested, setInvested] = useState(0);
  const [profit, setProfit] = useState(0);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const res = await API.get("/stocks/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const stocks = res.data.stocks || [];

        // Map stock data
        const mapped = stocks.map((s) => ({
          id: s._id,
          symbol: s.stockName?.toUpperCase(),
          qty: s.quantity,
          buy: Number(s.price),
          profit: Number(s.profit) || 0,
          loss: Number(s.loss) || 0,
        }));

        // Calculate totals
        const investedAmt = mapped.reduce((sum, s) => sum + s.buy * s.qty, 0);
        const totalProfit = mapped.reduce((sum, s) => sum + s.profit - s.loss, 0);
        const currentAmt = investedAmt + totalProfit;

        setHoldings(mapped);
        setInvested(investedAmt);
        setProfit(totalProfit);
        setCurrent(currentAmt);
      } catch (error) {
        console.error("Error loading portfolio:", error);
      }
    };

    load();
  }, []);

  return (
    <DashboardLayout sidebarOpen={sidebarOpen}>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <TickerStrip />

        <div className="flex-grow w-full max-w-6xl p-6 mx-auto lg:p-10">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">My Portfolio</h1>
          <p className="mb-8 text-slate-500">Track your investments and performance.</p>

          {/* STATS SUMMARY */}
          <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
            <StatCard title="Total Value" value={`₹ ${current}`} />
            <StatCard title="Invested" value={`₹ ${invested}`} />
            <StatCard title="Profit / Loss" value={`₹ ${profit}`} profit={profit} />
          </div>

          {/* MY STOCKS */}
          <h2 className="mb-4 text-xl font-semibold text-slate-800">My Stocks</h2>
          {holdings.length === 0 ? (
            <div className="py-10 text-center border border-dashed text-slate-500 border-slate-300 rounded-xl">
              You have no stocks yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {holdings.map((stock) => {
                const totalBuy = stock.buy * stock.qty;
                const totalProfit = stock.profit - stock.loss;
                const totalCurrent = totalBuy + totalProfit;
                const percentChange = ((totalProfit / totalBuy) * 100).toFixed(2);

                return (
                  <div key={stock.id} className="p-5 transition bg-white border shadow-sm border-slate-200 rounded-2xl hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800">{stock.symbol}</h3>
                      {totalProfit >= 0 ? (
                        <ArrowUpRight className="text-emerald-600" />
                      ) : (
                        <ArrowDownLeft className="text-rose-600" />
                      )}
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Quantity: <span className="font-medium">{stock.qty}</span>
                    </p>

                    <div className="mt-3 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Buy Price:</span>
                        <span>₹ {stock.buy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit:</span>
                        <span className="text-emerald-600">₹ {stock.profit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loss:</span>
                        <span className="text-rose-600">₹ {stock.loss}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-4 border-t">
                      <span className="text-sm text-slate-500">P/L</span>
                      <span className={`font-semibold ${totalProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {totalProfit >= 0 ? "+" : "-"}₹ {Math.abs(totalProfit).toLocaleString("en-IN")}{" "}
                        <span className="text-xs text-slate-500">({percentChange}%)</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </DashboardLayout>
  );
}

/* STAT CARD */
function StatCard({ title, value, profit }) {
  return (
    <div className="p-6 transition bg-white border shadow-sm rounded-2xl border-slate-200 hover:shadow-md">
      <p className="text-sm tracking-wide uppercase text-slate-500">{title}</p>
      <h2 className={`text-3xl font-semibold mt-2 ${profit > 0 ? "text-emerald-600" : profit < 0 ? "text-rose-600" : "text-slate-800"}`}>
        {value}
      </h2>
    </div>
  );
}
