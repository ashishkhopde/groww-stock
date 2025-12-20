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
//       <h1 className="mb-4 text-3xl font-bold text-slate-900">Stock Management</h1>
//       <p className="mb-8 text-slate-500">Add, update, and manage user stocks.</p>

//       {/* ADD STOCK FORM */}
//       <div className="p-6 mb-10 bg-white border shadow rounded-xl border-slate-200">
//         <h2 className="mb-4 text-xl font-semibold text-slate-800">Add Stock</h2>

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
//           className="flex items-center gap-2 px-5 py-3 mt-4 text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
//         >
//           <Plus size={18} /> Add Stock
//         </button>
//       </div>

//       {/* STOCK TABLE */}
//       <div className="overflow-hidden bg-white border shadow rounded-xl border-slate-200">
//         <table className="w-full text-sm">
//           <thead className="text-xs uppercase bg-slate-100 text-slate-600">
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
//                     className="flex items-center gap-1 px-3 py-2 text-white rounded-lg bg-rose-600 hover:bg-rose-700"
//                   >
//                     <Trash2 size={16} /> Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {stocks.length === 0 && (
//               <tr>
//                 <td colSpan="5" className="p-6 text-center text-slate-500">
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

  const [newStock, setNewStock] = useState({
    userId: "",
    stockName: "",
    price: "",
    quantity: "",
    profit: "",
    loss: ""
  });

  // Fetch users + stocks
  useEffect(() => {
    Promise.all([
      API.get("/admin/users", { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }),
      API.get("/admin/stocks", { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } })
    ]).then(([usersRes, stocksRes]) => {
      setUsers(usersRes.data);
      setStocks(stocksRes.data);
      setLoading(false);
    });
  }, []);

  const handleAddStock = () => {
    if (!newStock.userId || !newStock.stockName || !newStock.price || !newStock.quantity) {
      alert("Fill all required fields");
      return;
    }

    API.post("/admin/stocks/add", newStock, { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } })
      .then(res => {
        setStocks([res.data.stock, ...stocks]);
        setNewStock({ userId: "", stockName: "", price: "", quantity: "", profit: "", loss: "" });
      });
  };

  const handleDeleteStock = id => {
    if (!window.confirm("Delete this stock?")) return;
    API.delete(`/admin/stocks/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } })
      .then(() => setStocks(stocks.filter(s => s._id !== id)));
  };

  const handleUpdateStock = (id, updatedFields) => {
    API.put(`/admin/stocks/${id}`, updatedFields, { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } })
      .then(res => setStocks(stocks.map(s => s._id === id ? res.data.updated : s)));
  };

  if (loading) return <div className="p-10">Loading Stocks...</div>;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold text-slate-900">Stock Management</h1>

      {/* ADD STOCK */}
      <div className="p-6 mb-10 bg-white border shadow rounded-xl border-slate-200">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">Add Stock</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-3">
          {/* User Select */}
          <select
            value={newStock.userId}
            onChange={e => setNewStock({ ...newStock, userId: e.target.value })}
            className="col-span-6 p-3 border rounded-lg md:col-span-2 bg-slate-50"
          >
            <option value="">Select User</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name} — {u.email}
              </option>
            ))}
          </select>

          {/* Stock Name */}
          <input
            type="text"
            placeholder="Stock Name"
            value={newStock.stockName}
            onChange={e => setNewStock({ ...newStock, stockName: e.target.value })}
            className="col-span-6 p-3 border rounded-lg md:col-span-1 bg-slate-50"
          />

          {/* Price */}
          <input
            type="number"
            placeholder="Price"
            value={newStock.price}
            onChange={e => setNewStock({ ...newStock, price: e.target.value })}
            className="col-span-6 p-3 border rounded-lg md:col-span-1 bg-slate-50"
          />

          {/* Quantity */}
          <input
            type="number"
            placeholder="Quantity"
            value={newStock.quantity}
            onChange={e => setNewStock({ ...newStock, quantity: e.target.value })}
            className="col-span-6 p-3 border rounded-lg md:col-span-1 bg-slate-50"
          />

          {/* Optional Profit & Loss (commented for now) */}
          {/* <input type="number" placeholder="Profit" value={newStock.profit} onChange={e => setNewStock({ ...newStock, profit: e.target.value })} className="col-span-6 p-3 border rounded-lg md:col-span-1 bg-slate-50" /> */}
          {/* <input type="number" placeholder="Loss" value={newStock.loss} onChange={e => setNewStock({ ...newStock, loss: e.target.value })} className="col-span-6 p-3 border rounded-lg md:col-span-1 bg-slate-50" /> */}
        </div>

        <button onClick={handleAddStock} className="flex items-center gap-2 px-5 py-3 mt-4 text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"><Plus size={18} /> Add Stock</button>
      </div>

      {/* STOCK TABLE */}
      <div className="overflow-hidden bg-white border shadow rounded-xl border-slate-200">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Profit</th>
              <th className="p-4 text-left">Loss</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(s => (
              <tr key={s._id} className="border-t hover:bg-slate-50">
                <td className="p-4">{s.user?.name}</td>
                <td className="p-4 font-semibold text-slate-800">{s.stockName}</td>
                <td className="p-4">
                  <input type="number" defaultValue={s.quantity} onBlur={e => handleUpdateStock(s._id, { quantity: e.target.value })} className="w-24 p-2 border rounded-lg bg-slate-50" />
                </td>
                <td className="p-4">
                  <input type="number" defaultValue={s.price} onBlur={e => handleUpdateStock(s._id, { price: e.target.value })} className="w-24 p-2 border rounded-lg bg-slate-50" />
                </td>
                <td className="p-4">
                  <input type="number" defaultValue={s.profit} onBlur={e => handleUpdateStock(s._id, { profit: e.target.value })} className="w-24 p-2 border rounded-lg bg-emerald-50 text-emerald-600" />
                </td>
                <td className="p-4">
                  <input type="number" defaultValue={s.loss} onBlur={e => handleUpdateStock(s._id, { loss: e.target.value })} className="w-24 p-2 border rounded-lg bg-rose-50 text-rose-600" />
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDeleteStock(s._id)} className="flex items-center gap-1 px-3 py-2 text-white rounded-lg bg-rose-600 hover:bg-rose-700"><Trash2 size={16} /> Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
