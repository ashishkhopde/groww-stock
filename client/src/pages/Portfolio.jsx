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
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);
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
        // console.log(stocks);
        const mapped = stocks.map((s) => ({
          id: s._id,
          symbol: s.stockName?.toUpperCase(),
          qty: s.quantity,
          buy: Number(s.price),
          profit: Number(s.profit) || 0,
          loss: Number(s.loss) || 0,
          createdAt: s.createdAt
        }));

        const investedAmt = mapped.reduce((sum, s) => sum + s.buy * s.qty, 0);
        const profitAmt = mapped.reduce((sum, s) => sum + s.profit, 0);
        const lossAmt = mapped.reduce((sum, s) => sum + s.loss, 0);

        const currentAmt = investedAmt + profitAmt - lossAmt;

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentStocks = mapped.filter(
          (s) => s.createdAt && new Date(s.createdAt) >= twentyFourHoursAgo
        );

        setHoldings(recentStocks);
        setInvested(investedAmt);
        setTotalProfit(profitAmt);
        setTotalLoss(lossAmt);
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

          <h1 className="mb-2 text-3xl font-bold text-slate-800 mb-5">
            My Stocks
          </h1>
          {/* <p className="mb-8 text-slate-500">
            Contact Details :
            Head Office
            City Centre, 2nd Floor, Krishna Business Centre, Tulsi Vihar Colony, Gwalior, Madhya Pradesh 474002
          </p> */}

          {/* SUMMARY */}
          {/* <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-4">
            <StatCard title="Total Value" value={`₹ ${current}`} />
            <StatCard title="Invested" value={`₹ ${invested}`} />
            <StatCard title="Profit" value={`₹ ${totalProfit}`} profit={1} />
            <StatCard title="Loss" value={`₹ ${totalLoss}`} profit={-1} />
          </div> */}

          {/* MY STOCKS */}
          {/* <h2 className="mb-6 text-xl font-semibold text-slate-800">
            My Stocks
          </h2> */}

          {holdings.length === 0 ? (
            <div className="py-10 text-center border border-dashed text-slate-500 border-slate-300 rounded-xl">
              You have no stocks yet.
            </div>
          ) : (
            <div className="space-y-6">
              {holdings.map((stock) => {
                const totalPL = stock.profit - stock.loss;

                return (
                  <div
                    key={stock.id}
                    className="max-w-xl px-6 ml-0 bg-white border shadow-md rounded-xl border-slate-200 py-7"
                  >
                    {/* TOP */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">
                        {stock.symbol}
                      </p>

                      <p className="text-sm font-semibold text-slate-700">
                        ₹{Math.abs(totalPL)}
                      </p>
                    </div>

                    {/* MIDDLE */}
                    <div className="flex justify-between mt-4 text-xs text-slate-500">
                      <span>
                        {stock.qty} Qty | Buy {stock.buy}
                      </span>
                      <span>
                        LTP 3.24 % | Sell {stock.buy + 20}
                      </span>
                    </div>

                    {/* PROFIT / LOSS */}
                    <div className="flex justify-end mt-5">
                      <span
                        className={`text-sm font-bold ${totalPL >= 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                          }`}
                      >
                        {totalPL >= 0
                          ? `+₹${totalPL}`
                          : `-₹${Math.abs(totalPL)}`}
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

/* SUMMARY CARD */
function StatCard({ title, value, profit }) {
  return (
    <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
      <p className="text-sm tracking-wide uppercase text-slate-500">
        {title}
      </p>
      <h2
        className={`text-3xl font-semibold mt-2 ${profit > 0
            ? "text-emerald-600"
            : profit < 0
              ? "text-rose-600"
              : "text-slate-800"
          }`}
      >
        {value}
      </h2>
    </div>
  );
}
