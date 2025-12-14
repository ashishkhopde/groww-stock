import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Users,
  CheckCircle,
  Shield,
  Ban,
  Unlock,
  UserCog
} from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Users
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Admin not logged in!");
      window.location.href = "/admin/login";
      return;
    }

    API.get("/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.log(err);
        alert("Failed to load users");
      })
      .finally(() => setLoading(false));
  }, []);

  // Approve KYC
  const approveKYC = async (id) => {
    await API.put(
      `/admin/users/kyc-approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
    );

    setUsers(users.map((u) => (u._id === id ? { ...u, kycApproved: true } : u)));
  };

  // Reject KYC
  const rejectKYC = async (id) => {
    await API.put(
      `/admin/users/kyc-reject/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
    );

    setUsers(users.map((u) => (u._id === id ? { ...u, kycApproved: false } : u)));
  };

  // Block / Unblock User
  const toggleBlock = async (id) => {
    await API.put(
      `/admin/users/toggle-block/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
    );

    setUsers(
      users.map((u) =>
        u._id === id ? { ...u, blocked: !u.blocked } : u
      )
    );
  };

  if (loading) return <div className="p-10">Loading users...</div>;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Users size={28} className="text-emerald-600" />
          Manage Users
        </h1>
        <p className="text-slate-500">
          View, approve, block or manage all registered users.
        </p>
      </div>

      <div className="bg-white shadow-lg border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">KYC Status</th>
              <th className="p-4 text-left">Blocked</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-t border-slate-200 hover:bg-slate-50 transition"
              >
                {/* User */}
                <td className="p-4 font-medium text-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                      className="w-10 h-10 rounded-full"
                    />
                    {u.name}
                  </div>
                </td>

                {/* Email */}
                <td className="p-4">{u.email}</td>

                {/* KYC Status */}
                <td className="p-4">
                  {u.kycApproved ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle size={16} /> Approved
                    </span>
                  ) : (
                    <span className="text-amber-600 font-semibold flex items-center gap-1">
                      <Shield size={16} /> Pending
                    </span>
                  )}
                </td>

                {/* Blocked Status */}
                <td className="p-4">
                  {u.blocked ? (
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      <Ban size={16} /> Blocked
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Unlock size={16} /> Active
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-4 text-right space-x-2">
                  {!u.kycApproved ? (
                    <button
                      onClick={() => approveKYC(u._id)}
                      className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-lg"
                    >
                      Approve KYC
                    </button>
                  ) : (
                    <button
                      onClick={() => rejectKYC(u._id)}
                      className="px-3 py-1 text-xs bg-amber-600 text-white rounded-lg"
                    >
                      Reject
                    </button>
                  )}

                  <button
                    onClick={() => toggleBlock(u._id)}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      u.blocked ? "bg-emerald-600" : "bg-rose-600"
                    } text-white`}
                  >
                    {u.blocked ? "Unblock" : "Block"}
                  </button>

                  <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg">
                    <UserCog size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
