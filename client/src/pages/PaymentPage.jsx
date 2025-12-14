import React from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentPage() {
  const [params] = useSearchParams();
  const method = window.location.pathname.split("/").pop();
  const amount = params.get("amount");

  const ADMIN_UPI = "adminname@upi"; // ← Your UPI here

  const handlePaid = async () => {
    await fetch("http://localhost:5000/api/wallet/add-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ amount })
    });

    alert("Payment request submitted! Admin will approve shortly.");
    window.location.href = "/dashboard";
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">{method.toUpperCase()} Payment</h1>

      <p className="text-lg mb-4">Pay: ₹ {amount}</p>

      <div className="p-4 border rounded-lg bg-gray-50 mb-4">
        <p className="font-semibold">Admin UPI:</p>
        <p className="text-xl text-indigo-600">{ADMIN_UPI}</p>
      </div>

      <button
        onClick={handlePaid}
        className="w-full p-3 bg-green-600 text-white rounded-lg"
      >
        I Have Paid
      </button>
    </div>
  );
}
