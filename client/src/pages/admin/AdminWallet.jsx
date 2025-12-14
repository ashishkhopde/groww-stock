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
//       <h1 className="text-3xl font-bold mb-6">Wallet Management</h1>

//       <div className="bg-white p-6 rounded-xl shadow border border-slate-200 w-full max-w-xl">

//         {/* User Dropdown */}
//         <label className="font-medium">Select User</label>
//         <select
//           value={selectedUser}
//           onChange={(e) => setSelectedUser(e.target.value)}
//           className="mt-2 w-full p-3 bg-slate-100 rounded-lg"
//         >
//           <option value="">-- Choose User --</option>
//           {users.map((u) => (
//             <option key={u._id} value={u._id}>
//               {u.name} — {u.email}
//             </option>
//           ))}
//         </select>

//         {/* Amount */}
//         <label className="font-medium mt-4 block">Amount</label>
//         <input
//           type="number"
//           className="mt-2 w-full p-3 bg-slate-100 rounded-lg"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />

//         {/* Note */}
//         <label className="font-medium mt-4 block">Note (optional)</label>
//         <input
//           type="text"
//           className="mt-2 w-full p-3 bg-slate-100 rounded-lg"
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//         />

//         {/* Buttons */}
//         <div className="flex gap-4 mt-6">
//           <button
//             className="px-4 py-3 bg-emerald-600 text-white rounded-lg"
//             onClick={credit}
//           >
//             Credit Wallet
//           </button>

//           <button
//             className="px-4 py-3 bg-rose-600 text-white rounded-lg"
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

  // Fetch users
  useEffect(() => {
    API.get("/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Common function for wallet update
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
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        }
      );

      alert(type === "add" ? "Wallet Credited Successfully!" : "Wallet Debited Successfully!");

      // Reset fields
      setAmount("");
      setNote("");

    } catch (error) {
      alert("❌ Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Wallet Management</h1>

      <div className="bg-white p-6 rounded-xl shadow border border-slate-200 w-full max-w-xl">
        
        {/* User Dropdown */}
        <label className="font-medium">Select User</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="mt-2 w-full p-3 bg-slate-100 rounded-lg"
        >
          <option value="">-- Choose User --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} — {u.email}
            </option>
          ))}
        </select>

        {/* Amount */}
        <label className="font-medium mt-4 block">Amount</label>
        <input
          type="number"
          className="mt-2 w-full p-3 bg-slate-100 rounded-lg"
          value={amount}
          min="1"
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Note */}
        <label className="font-medium mt-4 block">Note (optional)</label>
        <input
          type="text"
          className="mt-2 w-full p-3 bg-slate-100 rounded-lg"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
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
    </div>
  );
}
