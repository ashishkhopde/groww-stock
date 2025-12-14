import { useEffect, useState } from "react";
import {
  CreditCard,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";

export default function PlanList() {
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: "Standard Plan",
      roi: "20% ROI",
      price: "₹ 25,000",
      features: [
        "Index Options Focus",
        "20% Max Return Guarantee",
        "Monthly Withdrawal Access",
        "Basic Support"
      ],
      color: "emerald"
    },
    {
      name: "Special User Plan",
      roi: "30% ROI",
      price: "₹ 50,000",
      features: [
        "Index & Futures Trading",
        "30% Max Return Guarantee",
        "Daily Withdrawal Access",
        "Priority Support"
      ],
      featured: true,
      color: "blue"
    },
    {
      name: "Premium Plan",
      roi: "40% ROI",
      price: "₹ 1,00,000",
      features: [
        "Stock, Index & Commodity",
        "40% Max Return Guarantee",
        "Lifetime Validity",
        "24/7 Analyst Support"
      ],
      color: "purple"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10">

        {/* PAGE HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Investment Plans</h1>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl border shadow-md transition hover:shadow-xl 
                ${
                  plan.featured
                    ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white border-blue-300"
                    : "bg-white border-slate-200"
                }
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-xl font-bold ${
                    plan.featured ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div
                  className={`p-3 rounded-xl ${
                    plan.featured ? "bg-white/20" : "bg-slate-100"
                  }`}
                >
                  <CreditCard
                    size={22}
                    className={plan.featured ? "text-white" : "text-slate-700"}
                  />
                </div>
              </div>

              {/* Price / ROI */}
              <p
                className={`text-lg font-semibold mb-1 ${
                  plan.featured ? "text-blue-200" : "text-slate-500"
                }`}
              >
                {plan.price}
              </p>

              <h2
                className={`text-3xl font-bold mb-6 ${
                  plan.featured
                    ? "text-white"
                    : `text-${plan.color}-600`
                }`}
              >
                {plan.roi}
              </h2>

              {/* Features */}
              <ul
                className={`space-y-3 mb-8 text-sm ${
                  plan.featured ? "text-blue-100" : "text-slate-600"
                }`}
              >
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle
                      size={18}
                      className={plan.featured ? "text-white" : "text-emerald-500"}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                className={`w-full py-3 rounded-xl text-lg font-semibold transition ${
                  plan.featured
                    ? "bg-white text-blue-700 hover:bg-slate-100"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                Buy Plan
              </button>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
