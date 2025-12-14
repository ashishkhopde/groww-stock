export default function TickerStrip() {
  const items = [
    { name: "SENSEX", price: "79,212", change: "-0.74%" },
    { name: "BHARTIARTL", price: "1815", change: "-1.58%" },
    { name: "IDEA", price: "7.47", change: "-5.92%" },
    { name: "TATAMOTORS", price: "654", change: "-2.0%" },
  ];

  return (
    <div className="w-full bg-gray-200 mt-16 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee flex gap-10 py-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 text-sm">
            <span className="font-semibold">{item.name}</span>
            <span>{item.price}</span>
            <span
              className={`${
                item.change.includes("-") ? "text-red-500" : "text-green-500"
              }`}
            >
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
