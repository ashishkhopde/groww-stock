import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Save, Settings } from "lucide-react";

export default function AdminPlans() {

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {

    const res = await API.get("/admin/plans");

    setPlans(res.data);

  };

  const handleChange = (id, field, value) => {

    const updated = plans.map(p =>
      p._id === id ? { ...p, [field]: value } : p
    );

    setPlans(updated);

  };

  const savePlan = async (plan) => {

    await API.put(`/admin/plans/${plan._id}`, {
      name: plan.name,
      price: plan.price,
      roi: plan.roi,
      features: plan.features,
      color: plan.color,
      featured: plan.featured
    });

    await fetchPlans();

    alert("Plan updated successfully");

  };

  return (

    <div className="p-10 bg-slate-50 min-h-screen">

      {/* PAGE HEADER */}
      <div className="mb-10 flex items-center gap-3">

        <div className="bg-blue-100 p-3 rounded-xl">
          <Settings className="text-blue-600" size={22} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Plan Content Editor
          </h1>
          <p className="text-slate-500">
            Customize investment plan details visible to users
          </p>
        </div>

      </div>


      {/* PLAN CARDS */}
      <div className="grid lg:grid-cols-2 gap-8">

        {plans.map((plan, index) => (

          <div
            key={plan._id}
            className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-5"
          >

            {/* PLAN TITLE */}
            <div className="flex items-center justify-between">

              <h2 className="text-lg font-semibold text-slate-700">
                Plan {index + 1}
              </h2>

              <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                Editable
              </span>

            </div>


            {/* PLAN NAME */}
            <div>

              <label className="text-sm font-medium text-slate-600">
                Plan Name
              </label>

              <input
                value={plan.name || ""}
                placeholder="Example: Standard Plan"
                onChange={(e)=>handleChange(plan._id,"name",e.target.value)}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>


            {/* PLAN PRICE */}
            <div>

              <label className="text-sm font-medium text-slate-600">
                Investment Price
              </label>

              <input
                value={plan.price || ""}
                placeholder="Example: ₹ 25,000"
                onChange={(e)=>handleChange(plan._id,"price",e.target.value)}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>


            {/* PLAN ROI */}
            <div>

              <label className="text-sm font-medium text-slate-600">
                ROI Percentage
              </label>

              <input
                value={plan.roi || ""}
                placeholder="Example: 20% ROI"
                onChange={(e)=>handleChange(plan._id,"roi",e.target.value)}
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>


            {/* FEATURES */}
            <div>

              <label className="text-sm font-medium text-slate-600">
                Plan Features
              </label>

              <textarea
                value={plan.features?.join("\n") || ""}
                placeholder={`Add features (one per line)

Example:
Index Options Focus
20% Max Return Guarantee
Monthly Withdrawal Access`}
                onChange={(e)=>
                  handleChange(plan._id,"features",e.target.value.split("\n"))
                }
                rows="4"
                className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <p className="text-xs text-slate-400 mt-1">
                Tip: Write each feature on a new line
              </p>

            </div>


            {/* SAVE BUTTON */}
            <button
              onClick={()=>savePlan(plan)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
            >

              <Save size={18} />
              Save Changes

            </button>

          </div>

        ))}

      </div>

    </div>

  );

}