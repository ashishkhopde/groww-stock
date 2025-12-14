import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function AddMoney() {
  const [settings, setSettings] = useState(null);
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    API.get("/payment/settings").then(res => setSettings(res.data));
  }, []);

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Balance</h1>

      {/* Amount */}
      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      {/* QR CODE */}
      <div className="mb-6 text-center">
        <p className="font-semibold mb-2">Scan & Pay</p>
        <img src={settings.qrImage} alt="QR" className="w-48 mx-auto" />
      </div>

      {/* BANK DETAILS */}
      <div className="p-4 border rounded mb-4 bg-gray-50">
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
        className="block text-center p-3 mb-4 bg-indigo-600 text-white rounded"
      >
        Pay via UPI App
      </a>

      {/* Reference */}
      <input
        type="text"
        placeholder="UTR / Transaction Reference"
        value={reference}
        onChange={e => setReference(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      {/* SUBMIT */}
      <button
        onClick={async () => {
          await API.post("/wallet/add-request", { amount, reference });
          alert("Request submitted. Admin will verify.");
        }}
        className="w-full p-3 bg-green-600 text-white rounded"
      >
        I Have Paid
      </button>
    </div>
  );
}
