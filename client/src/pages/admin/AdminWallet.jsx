import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function WalletManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // Fetch users
  useEffect(() => {
    API.get("/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const res = await API.get("/admin/wallet", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Wallet Update (CREDIT / DEBIT)
  const handleWalletUpdate = async (type) => {
    if (!selectedUser) return alert("❗ Please select a user");
    if (!amount || amount <= 0) return alert("❗ Enter a valid amount");

    try {
      setLoading(true);

      await API.post(
        `/admin/wallet/update/${selectedUser}`,
        { amount, type, note },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      alert(
        type === "credit"
          ? "✅ Wallet Credited Successfully!"
          : "💸 Wallet Debited Successfully!"
      );

      setAmount("");
      setNote("");
      fetchTransactions(); // refresh table
    } catch (error) {
      console.error("Error updating wallet:", error);
      alert("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Wallet Management</h1>

      {/* ---------------- Wallet Update Form ---------------- */}
      <div className="w-full max-w-xl p-6 space-y-4 bg-white border shadow rounded-xl border-slate-200">
        {/* User Select */}
        <div>
          <label className="font-medium text-slate-700">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-3 mt-2 rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">-- Choose User --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} — {u.email}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block font-medium text-slate-700">Amount</label>
          <input
            type="number"
            className="w-full p-3 mt-2 rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={amount}
            min="1"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Note */}
        <div>
          <label className="block font-medium text-slate-700">
            Note (optional)
          </label>
          <input
            type="text"
            className="w-full p-3 mt-2 rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            disabled={loading}
            onClick={() => handleWalletUpdate("credit")}
            className={`flex-1 px-4 py-3 text-white rounded-lg transition ${
              loading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Processing..." : "Credit Wallet"}
          </button>

          <button
            disabled={loading}
            onClick={() => handleWalletUpdate("debit")}
            className={`flex-1 px-4 py-3 text-white rounded-lg transition ${
              loading
                ? "bg-rose-400 cursor-not-allowed"
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {loading ? "Processing..." : "Debit Wallet"}
          </button>
        </div>
      </div>

      {/* ---------------- Transactions Table ---------------- */}
      <div className="overflow-x-auto bg-white border shadow rounded-xl border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">
                User
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">
                Type
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">
                Amount
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">
                Note
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-left text-slate-700">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-6 text-sm text-center text-slate-500"
                >
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-sm text-slate-800">
                    {tx.userId?.name || "N/A"} <br />
                    <span className="text-xs text-slate-500">
                      {tx.userId?.email}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-semibold ${
                      tx.type === "credit"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {tx.type === "credit" ? "Credit" : "Debit"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    ₹ {tx.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {tx.note || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {new Date(tx.createdAt).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
