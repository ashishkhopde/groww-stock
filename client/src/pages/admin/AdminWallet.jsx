// import { useState, useEffect } from "react";
// import API from "../../api/axios";

// export default function WalletManagement() {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [amount, setAmount] = useState("");
//   const [note, setNote] = useState("");

//   useEffect(() => {
//     API.get("/admin/users", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
//     }).then((res) => setUsers(res.data));
//   }, []);

//   const credit = () => {
//   API.post(
//     `/admin/wallet/update/${selectedUser}`,
//     { amount, type: "add" },
//     { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
//   ).then(() => alert("Wallet Credited!"));
// };


// const debit = () => {
//   API.post(
//     `/admin/wallet/update/${selectedUser}`,
//     { amount, type: "deduct" },
//     { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
//   ).then(() => alert("Wallet Debited!"));
// };


//   return (
//     <div className="p-8">
//       <h1 className="mb-6 text-3xl font-bold">Wallet Management</h1>

//       <div className="w-full max-w-xl p-6 bg-white border shadow rounded-xl border-slate-200">

//         {/* User Dropdown */}
//         <label className="font-medium">Select User</label>
//         <select
//           value={selectedUser}
//           onChange={(e) => setSelectedUser(e.target.value)}
//           className="w-full p-3 mt-2 rounded-lg bg-slate-100"
//         >
//           <option value="">-- Choose User --</option>
//           {users.map((u) => (
//             <option key={u._id} value={u._id}>
//               {u.name} — {u.email}
//             </option>
//           ))}
//         </select>

//         {/* Amount */}
//         <label className="block mt-4 font-medium">Amount</label>
//         <input
//           type="number"
//           className="w-full p-3 mt-2 rounded-lg bg-slate-100"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />

//         {/* Note */}
//         <label className="block mt-4 font-medium">Note (optional)</label>
//         <input
//           type="text"
//           className="w-full p-3 mt-2 rounded-lg bg-slate-100"
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//         />

//         {/* Buttons */}
//         <div className="flex gap-4 mt-6">
//           <button
//             className="px-4 py-3 text-white rounded-lg bg-emerald-600"
//             onClick={credit}
//           >
//             Credit Wallet
//           </button>

//           <button
//             className="px-4 py-3 text-white rounded-lg bg-rose-600"
//             onClick={debit}
//           >
//             Debit Wallet
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


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
      const res = await API.get("/admin/wallet/transactions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleWalletUpdate = async (type) => {
    if (!selectedUser) return alert("❗ Please select a user");
    if (!amount || amount <= 0) return alert("❗ Enter a valid amount");

    try {
      setLoading(true);

      await API.post(
        `/admin/wallet/update/${selectedUser}`,
        { amount, type, note },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );

      alert(type === "add" ? "Wallet Credited Successfully!" : "Wallet Debited Successfully!");

      // Reset fields
      setAmount("");
      setNote("");

      // Refresh transactions
      fetchTransactions();
    } catch (error) {
      alert("❌ Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Wallet Management</h1>

      {/* Wallet Update Form */}
      <div className="w-full max-w-xl p-6 space-y-4 bg-white border shadow rounded-xl border-slate-200">
        <div>
          <label className="font-medium">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-3 mt-2 rounded-lg bg-slate-100"
          >
            <option value="">-- Choose User --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} — {u.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Amount</label>
          <input
            type="number"
            className="w-full p-3 mt-2 rounded-lg bg-slate-100"
            value={amount}
            min="1"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Note (optional)</label>
          <input
            type="text"
            className="w-full p-3 mt-2 rounded-lg bg-slate-100"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            disabled={loading}
            className={`px-4 py-3 bg-emerald-600 text-white rounded-lg ${loading && "opacity-60"}`}
            onClick={() => handleWalletUpdate("add")}
          >
            {loading ? "Processing..." : "Credit Wallet"}
          </button>

          <button
            disabled={loading}
            className={`px-4 py-3 bg-rose-600 text-white rounded-lg ${loading && "opacity-60"}`}
            onClick={() => handleWalletUpdate("deduct")}
          >
            {loading ? "Processing..." : "Debit Wallet"}
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto bg-white border shadow rounded-xl border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-sm font-medium text-left text-slate-700">User</th>
              <th className="px-4 py-2 text-sm font-medium text-left text-slate-700">Type</th>
              <th className="px-4 py-2 text-sm font-medium text-left text-slate-700">Amount</th>
              <th className="px-4 py-2 text-sm font-medium text-left text-slate-700">Note</th>
              <th className="px-4 py-2 text-sm font-medium text-left text-slate-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-slate-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="px-4 py-2 text-sm text-slate-700">
                    {tx.userId?.name} — {tx.userId?.email}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-700">{tx.type}</td>
                  <td className="px-4 py-2 text-sm text-slate-700">₹ {tx.amount}</td>
                  <td className="px-4 py-2 text-sm text-slate-700">{tx.note || "-"}</td>
                  <td className="px-4 py-2 text-sm text-slate-700">
                    {new Date(tx.createdAt).toLocaleString()}
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

