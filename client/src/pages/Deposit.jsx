import React, { useState } from "react";
import API from "../api/axios";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || !upiId) return alert("Enter all fields");

    setLoading(true);

    try {
      const res = await API.post("/deposit/create", {
        amount,
        upiId,
      });

      alert("Deposit request submitted. Wait for approval.");
      setAmount("");
      setUpiId("");
    } catch (error) {
      alert("Failed to submit deposit");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Add Money</h1>
        <p className="text-slate-500 mb-6 text-sm">
          Add funds to your wallet using UPI.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600 font-medium">Amount (₹)</label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none mt-1"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 font-medium">Your UPI ID</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none mt-1"
              placeholder="example@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>

          <button
            onClick={handleDeposit}
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition shadow-md shadow-emerald-500/30"
          >
            {loading ? "Processing..." : "Add Money"}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Your deposit will be verified by our team.
        </p>
      </div>
    </div>
  );
}
