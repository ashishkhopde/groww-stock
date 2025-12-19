import { TrendingUp } from "lucide-react";

export default function TickerStrip() {
  const stocks = [
    { name: "SENSEX", value: "79,212", change: "-588", up: false },
    { name: "RELIANCE", value: "1,300", change: "+5", up: true },
    { name: "TATAMOTORS", value: "654", change: "-14", up: false },
    { name: "HDFC", value: "1,520", change: "+12", up: true },
    { name: "INFOSYS", value: "1,402", change: "+8", up: true },
    { name: "TCS", value: "3,450", change: "-20", up: false },
  ];

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      <div className="flex w-[200%] animate-marquee">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="flex gap-10 py-2 px-4 text-sm">
            {stocks.map((stock, i) => (
              <span
                key={i}
                className={`flex items-center gap-1 font-medium whitespace-nowrap
                ${stock.up ? "text-emerald-600" : "text-rose-600"}`}
              >
                <TrendingUp
                  size={14}
                  className={stock.up ? "" : "rotate-180"}
                />
                {stock.name} {stock.value} {stock.change}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
