const plans = [
  {
    title: "Premium",
    price: "1,00,000",
    details: ["Daily 2–3 trades", "Max return 40%", "Lifetime validity"],
  },
  {
    title: "Special User",
    price: "50,000",
    details: ["Index & Futures Trades", "Max return 30%", "Daily withdrawal"],
  },
  {
    title: "Standard",
    price: "25,000",
    details: ["Monthly withdrawal", "Max return 20%", "Index Options"],
  },
];

export default function Packages() {
  return (
    <section className="py-16 px-6 bg-white">
      <h2 className="text-center text-3xl font-bold mb-10">
        Our Investment Packages
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <div
            key={i}
            className="border rounded-xl p-6 shadow hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
            <p className="text-xl text-gray-700 mb-4">₹ {plan.price}</p>

            <ul className="text-gray-600 space-y-2">
              {plan.details.map((d, j) => (
                <li key={j}>• {d}</li>
              ))}
            </ul>

            <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
