import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Footer from "../components/Footer.jsx";
import TickerStrip from "../components/TickerStrip.jsx";
import API from "../api/axios";

export default function PlanList() {

   const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH PLANS FROM BACKEND
  useEffect(() => {

    const fetchPlans = async () => {

      try {

        const res = await API.get("/admin/plans");

        setPlans(res.data);

      } catch (error) {

        console.log("Error fetching plans:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchPlans();

  }, []);


  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

        <TickerStrip />

        <div className="flex-grow p-6 lg:p-10">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">

            <h1 className="text-2xl font-bold text-slate-800">
              Investment Plans
            </h1>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

          </div>


          {/* LOADING */}
          {loading && (
            <div className="text-center py-10 text-slate-500">
              Loading plans...
            </div>
          )}


          {/* PLANS */}
          {!loading && (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {plans.map((plan) => (

                <div
                  key={plan._id}
                  className={`p-8 rounded-2xl border shadow-md transition hover:shadow-xl 
                  ${
                    plan.featured
                      ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white border-blue-300"
                      : "bg-white border-slate-200"
                  }`}
                >

                  {/* HEADER */}
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
                        className={
                          plan.featured ? "text-white" : "text-slate-700"
                        }
                      />
                    </div>

                  </div>


                  {/* PRICE */}
                  <p
                    className={`text-lg font-semibold mb-1 ${
                      plan.featured ? "text-blue-200" : "text-slate-500"
                    }`}
                  >
                    {plan.price}
                  </p>


                  {/* ROI */}
                  <h2
                    className={`text-3xl font-bold mb-6 ${
                      plan.featured
                        ? "text-white"
                        : plan.color === "emerald"
                        ? "text-emerald-600"
                        : plan.color === "blue"
                        ? "text-blue-600"
                        : "text-purple-600"
                    }`}
                  >
                    {plan.roi}
                  </h2>


                  {/* FEATURES */}
                  <ul
                    className={`space-y-3 mb-8 text-sm ${
                      plan.featured ? "text-blue-100" : "text-slate-600"
                    }`}
                  >

                    {(Array.isArray(plan.features)
                      ? plan.features
                      : []
                    ).map((f, i) => (

                      <li key={i} className="flex items-start gap-2">

                        <CheckCircle
                          size={18}
                          className={
                            plan.featured
                              ? "text-white"
                              : "text-emerald-500"
                          }
                        />

                        <span>{f}</span>

                      </li>

                    ))}

                  </ul>


                  {/* BUTTON */}
                  <button
                    onClick={() => navigate("/add-money")}
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

          )}

        </div>

        <Footer />

      </div>
    </DashboardLayout>
  );
}