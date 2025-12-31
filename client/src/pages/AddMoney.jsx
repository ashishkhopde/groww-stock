import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function AddMoney() {
  const [settings, setSettings] = useState(null);
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    API.get("/payment/settings").then(res => setSettings(res.data));
  }, []);

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-5 sm:p-6">

        {/* HEADING */}
        <h1 className="text-xl sm:text-2xl font-semibold mb-5 text-center sm:text-left">
          Add Balance
        </h1>

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* QR CODE */}
        <div className="mb-6 text-center">
          <p className="font-medium mb-3 text-gray-700">Scan & Pay</p>
          <img
            src={settings.qrImage}
            alt="QR"
            className="w-40 sm:w-48 mx-auto rounded-md border"
          />
        </div>

        {/* BANK DETAILS */}
        <div className="p-4 border rounded-md mb-4 bg-gray-50 text-sm space-y-1">
          <p><b>Account Name:</b> {settings.accountHolder}</p>
          <p><b>Bank:</b> {settings.bankName}</p>
          <p><b>Account No:</b> {settings.accountNumber}</p>
          <p><b>IFSC:</b> {settings.ifsc}</p>
          <p><b>UPI:</b> {settings.upiId}</p>
        </div>

        {/* UPI LINK */}
        <a
          href={settings.upiLink}
          target="_blank"
          rel="noreferrer"
          className="block text-center p-3 mb-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
        >
          Pay via UPI App
        </a>

        {/* REFERENCE */}
        <input
          type="text"
          placeholder="UTR / Transaction Reference"
          value={reference}
          onChange={e => setReference(e.target.value)}
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* SUBMIT */}
        <button
          onClick={async () => {
            await API.post("/wallet/add-request", { amount, reference });
            alert("Request submitted. Admin will verify.");
          }}
          className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
        >
          I Have Paid
        </button>

      </div>
    </div>
  );
}
