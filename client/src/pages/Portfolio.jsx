import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

import DashboardNavbar from "../components/Navbar.jsx";
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
      const res = await API.get("/stocks/my");
      const stocks = res.data.stocks || [];

      const mapped = stocks.map((s) => ({
        symbol: s.stockName?.toUpperCase(),
        qty: s.quantity,
        buy: Number(s.price),
        current: Number(s.price),
      }));

      const investedAmt = mapped.reduce(
        (a, b) => a + b.buy * b.qty,
        0
      );
      const currentAmt = investedAmt;

      setHoldings(mapped);
      setInvested(investedAmt);
      setCurrent(currentAmt);
      setProfit(currentAmt - investedAmt);
    };

    load();
  }, []);

  return (
    <DashboardLayout sidebarOpen={sidebarOpen}>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

        {/* DASHBOARD NAVBAR */}
        <DashboardNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* TICKER STRIP */}
        <TickerStrip />

        {/* PAGE CONTENT */}
        <div className="flex-grow p-6 lg:p-10">

          <h1 className="text-3xl font-bold mb-2 text-slate-800">
            My Portfolio
          </h1>
          <p className="text-slate-500 mb-8">
            Track your investments and performance.
          </p>

          {/* ✅ IMPROVED CARD DESIGN (IMAGE STYLE) */}
          <div className="max-w-4xl space-y-6">

            {/* TOTAL VALUE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6">
              <p className="text-sm text-slate-500 uppercase tracking-wide">
                Total Value
              </p>
              <h2 className="text-3xl font-semibold mt-2 text-slate-800">
                ₹ {current}
              </h2>
            </div>

            {/* INVESTED */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6">
              <p className="text-sm text-slate-500 uppercase tracking-wide">
                Invested
              </p>
              <h2 className="text-3xl font-semibold mt-2 text-slate-800">
                ₹ {invested}
              </h2>
            </div>

            {/* PROFIT / LOSS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6">
              <p className="text-sm text-slate-500 uppercase tracking-wide">
                Profit / Loss
              </p>

              <div className="flex items-center gap-3 mt-2">
                <h2
                  className={`text-3xl font-semibold ${
                    profit >= 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  ₹ {profit}
                </h2>

                {profit >= 0 ? (
                  <ArrowUpRight className="text-emerald-600" />
                ) : (
                  <ArrowDownLeft className="text-rose-600" />
                )}
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <Footer />
      </div>
    </DashboardLayout>
  );
}
