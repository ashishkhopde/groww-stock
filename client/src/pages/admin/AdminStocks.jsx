// import { useState, useEffect } from "react";
// import API from "../../api/axios";
// import { Plus, Trash2, Edit3, Loader } from "lucide-react";

// export default function StockManagement() {
//   const [stocks, setStocks] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [newStock, setNewStock] = useState({
//     userId: "",
//     stockName: "",
//     price: "",
//     quantity: "",
//   });

//   // Fetch users + stock list
//   useEffect(() => {
//     Promise.all([
//       API.get("/admin/users", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
//       }),
//       API.get("/admin/stocks", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
//       })
//     ])
//       .then(([usersRes, stocksRes]) => {
//         setUsers(usersRes.data);
//         setStocks(stocksRes.data);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const handleAddStock = () => {
//     if (!newStock.userId || !newStock.stockName || !newStock.price) {
//       alert("Fill all fields");
//       return;
//     }

//     API.post("/admin/stocks/add", newStock, {
//   headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
// }).then((res) => {
//   setStocks([res.data.stock, ...stocks]);
//   setNewStock({ userId: "", stockName: "", price: "", quantity: "" });
// });

//   };

//   const handleDeleteStock = (id) => {
//     if (!window.confirm("Delete this stock?")) return;

//     API.delete(`/admin/stocks/${id}`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
//     }).then(() => {
//       setStocks(stocks.filter((s) => s._id !== id));
//     });
//   };

//   const handlePriceUpdate = (id, newPrice) => {
//     API.put(
//       `/admin/stocks/${id}`,
//       { price: newPrice },
//       { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
//     ).then((res) => {
//       setStocks(stocks.map((s) => (s._id === id ? res.data : s)));
//     });
//   };

//   if (loading) return <div className="p-10">Loading Stocks...</div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold text-slate-900 mb-4">Stock Management</h1>
//       <p className="text-slate-500 mb-8">Add, update, and manage user stocks.</p>

//       {/* ADD STOCK FORM */}
//       <div className="bg-white p-6 rounded-xl shadow border border-slate-200 mb-10">
//         <h2 className="text-xl font-semibold mb-4 text-slate-800">Add Stock</h2>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <select
//             value={newStock.userId}
//             onChange={(e) => setNewStock({ ...newStock, userId: e.target.value })}
//             className="p-3 border rounded-lg bg-slate-50"
//           >
//             <option value="">Select User</option>
//             {users.map((u) => (
//               <option key={u._id} value={u._id}>
//                 {u.name} – {u.email}
//               </option>
//             ))}
//           </select>

//           <input
//             type="text"
//             placeholder="Stock Name"
//             value={newStock.stockName}
//             onChange={(e) => setNewStock({ ...newStock, stockName: e.target.value })}
//             className="p-3 border rounded-lg bg-slate-50"
//           />

//           <input
//             type="number"
//             placeholder="Price"
//             value={newStock.price}
//             onChange={(e) => setNewStock({ ...newStock, price: e.target.value })}
//             className="p-3 border rounded-lg bg-slate-50"
//           />

//           <input
//             type="number"
//             placeholder="Quantity"
//             value={newStock.quantity}
//             onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
//             className="p-3 border rounded-lg bg-slate-50"
//           />
//         </div>

//         <button
//           onClick={handleAddStock}
//           className="mt-4 px-5 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
//         >
//           <Plus size={18} /> Add Stock
//         </button>
//       </div>

//       {/* STOCK TABLE */}
//       <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
//             <tr>
//               <th className="p-4 text-left">User</th>
//               <th className="p-4 text-left">Stock</th>
//               <th className="p-4 text-left">Quantity</th>
//               <th className="p-4 text-left">Price</th>
//               <th className="p-4 text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {stocks.map((s) => (
//               <tr key={s._id} className="border-t hover:bg-slate-50">
//                 <td className="p-4">{s.user?.name || "—"}</td>
//                 <td className="p-4 font-semibold text-slate-800">{s.stockName}</td>
//                 <td className="p-4">{s.quantity}</td>

//                 {/* PRICE EDIT */}
//                 <td className="p-4">
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="number"
//                       className="w-24 p-2 border rounded-lg bg-slate-50"
//                       defaultValue={s.price}
//                       onBlur={(e) => handlePriceUpdate(s._id, e.target.value)}
//                     />
//                     <Edit3 size={16} className="text-slate-500" />
//                   </div>
//                 </td>

//                 <td className="p-4 text-right">
//                   <button
//                     onClick={() => handleDeleteStock(s._id)}
//                     className="px-3 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-1"
//                   >
//                     <Trash2 size={16} /> Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {stocks.length === 0 && (
//               <tr>
//                 <td colSpan="5" className="text-center p-6 text-slate-500">
//                   No stocks found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import API from "../../api/axios";
import { Plus, Trash2, Edit3 } from "lucide-react";

export default function StockManagement() {
  const [stocks, setStocks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState("");
  const [manualProfit, setManualProfit] = useState(0);
  const [profitInput, setProfitInput] = useState(0);

  const [newStock, setNewStock] = useState({
    userId: "",
    stockName: "",
    price: "",
    quantity: "",
  });

  // Fetch users + stocks
  useEffect(() => {
    Promise.all([
      API.get("/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      }),
      API.get("/admin/stocks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      })
    ])
      .then(([usersRes, stocksRes]) => {
        setUsers(usersRes.data);
        setStocks(stocksRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch selected user's manual profit
  useEffect(() => {
    if (!selectedUser) return;

    API.get(`/admin/profit/${selectedUser}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    })
      .then((res) => {
        setManualProfit(res.data.manualProfitAdjustment || 0);
        setProfitInput(res.data.manualProfitAdjustment || 0);
      })
      .catch(() => {
        setManualProfit(0);
        setProfitInput(0);
      });
  }, [selectedUser]);

  const handleAddStock = () => {
    if (!newStock.userId || !newStock.stockName || !newStock.price) {
      alert("Fill all fields");
      return;
    }

    API.post("/admin/stocks/add", newStock, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    }).then((res) => {
      setStocks([res.data.stock, ...stocks]);
      setNewStock({ userId: "", stockName: "", price: "", quantity: "" });
    });
  };

  const handleDeleteStock = (id) => {
    if (!window.confirm("Delete this stock?")) return;

    API.delete(`/admin/stocks/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    }).then(() => {
      setStocks(stocks.filter((s) => s._id !== id));
    });
  };

  const handlePriceUpdate = (id, newPrice) => {
    API.put(
      `/admin/stocks/${id}`,
      { price: newPrice },
      { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
    ).then((res) => {
      setStocks(stocks.map((s) => (s._id === id ? res.data : s)));
    });
  };

  if (loading) return <div className="p-10">Loading Stocks...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Stock Management</h1>
      <p className="text-slate-500 mb-8">Add, update, and manage user stocks.</p>

      {/* ADD STOCK FORM */}
      <div className="bg-white p-6 rounded-xl shadow border border-slate-200 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Add Stock</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={newStock.userId}
            onChange={(e) => setNewStock({ ...newStock, userId: e.target.value })}
            className="p-3 border rounded-lg bg-slate-50"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} – {u.email}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Stock Name"
            value={newStock.stockName}
            onChange={(e) => setNewStock({ ...newStock, stockName: e.target.value })}
            className="p-3 border rounded-lg bg-slate-50"
          />

          <input
            type="number"
            placeholder="Price"
            value={newStock.price}
            onChange={(e) => setNewStock({ ...newStock, price: e.target.value })}
            className="p-3 border rounded-lg bg-slate-50"
          />

          <input
            type="number"
            placeholder="Quantity"
            value={newStock.quantity}
            onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
            className="p-3 border rounded-lg bg-slate-50"
          />
        </div>

        <button
          onClick={handleAddStock}
          className="mt-4 px-5 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus size={18} /> Add Stock
        </button>
      </div>

      {/* SIMPLE PROFIT MANAGEMENT */}
      <div className="bg-white p-6 rounded-xl shadow border border-slate-200 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Manage User Profit / Loss</h2>

        {/* SELECT USER */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-3 border rounded-lg bg-slate-50 mb-4"
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} — {u.email}
            </option>
          ))}
        </select>

        {selectedUser && (
          <div className="space-y-3">
            
            {/* CURRENT PROFIT */}
            <p className="text-lg font-semibold">
              Current Profit/Loss:{" "}
              <span className={manualProfit >= 0 ? "text-emerald-600" : "text-rose-600"}>
                ₹ {manualProfit}
              </span>
            </p>

            {/* INPUT */}
            <input
              type="number"
              value={profitInput}
              onChange={(e) => setProfitInput(Number(e.target.value))}
              placeholder="Enter profit or loss"
              className="p-3 border rounded-lg bg-slate-50 w-60"
            />

            {/* CONTROLS */}
            <div className="flex gap-4 mt-4">

              {/* ADJUST */}
              <button
                onClick={async () => {
                  await API.post(
                    `/admin/adjust-profit/${selectedUser}`,
                    { amount: profitInput },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
                  );
                  alert("Profit adjusted!");
                }}
                className="px-5 py-3 bg-indigo-600 text-white rounded-lg"
              >
                Adjust Profit (+/-)
              </button>

              {/* SET EXACT */}
              <button
                onClick={async () => {
                  await API.post(
                    `/admin/set-profit/${selectedUser}`,
                    { profit: profitInput },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
                  );
                  alert("Exact profit set!");
                }}
                className="px-5 py-3 bg-emerald-600 text-white rounded-lg"
              >
                Set Exact Profit
              </button>

              {/* RESET */}
              <button
                onClick={async () => {
                  await API.post(
                    `/admin/reset-profit/${selectedUser}`,
                    {},
                    { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
                  );
                  alert("Profit reset!");
                }}
                className="px-5 py-3 bg-rose-600 text-white rounded-lg"
              >
                Reset Profit
              </button>

            </div>
          </div>
        )}
      </div>

      {/* STOCK TABLE */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((s) => (
              <tr key={s._id} className="border-t hover:bg-slate-50">
                <td className="p-4">{s.user?.name || "—"}</td>
                <td className="p-4 font-semibold text-slate-800">{s.stockName}</td>
                <td className="p-4">{s.quantity}</td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-24 p-2 border rounded-lg bg-slate-50"
                      defaultValue={s.price}
                      onBlur={(e) => handlePriceUpdate(s._id, e.target.value)}
                    />
                    <Edit3 size={16} className="text-slate-500" />
                  </div>
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDeleteStock(s._id)}
                    className="px-3 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}

            {stocks.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-slate-500">
                  No stocks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
