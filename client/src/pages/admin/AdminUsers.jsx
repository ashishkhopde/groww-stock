import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Users,
  CheckCircle,
  Shield,
  Ban,
  Unlock,
  UserCog,
  XCircle,
  Clock,
  FileWarning,
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

  // Render KYC status badge
  const renderKYCStatus = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            <CheckCircle size={16} /> Approved
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 font-semibold text-amber-600">
            <Clock size={16} /> Pending
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 font-semibold text-rose-600">
            <XCircle size={16} /> Rejected
          </span>
        );
      case "not_submitted":
      default:
        return (
          <span className="flex items-center gap-1 font-semibold text-slate-500">
            <FileWarning size={16} /> Not Submitted
          </span>
        );
    }
  };

  if (loading) return <div className="p-10">Loading users...</div>;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
          <Users size={28} className="text-emerald-600" />
          Manage Users
        </h1>
        <p className="text-slate-500">
          View, approve, block or manage all registered users.
        </p>
      </div>

      <div className="overflow-hidden bg-white border shadow-lg border-slate-200 rounded-2xl">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase bg-slate-100 text-slate-600">
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
                className="transition border-t border-slate-200 hover:bg-slate-50"
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
                <td className="p-4">{renderKYCStatus(u.kycStatus)}</td>

                {/* Blocked Status */}
                <td className="p-4">
                  {u.blocked ? (
                    <span className="flex items-center gap-1 font-semibold text-rose-600">
                      <Ban size={16} /> Blocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <Unlock size={16} /> Active
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-4 space-x-2 text-right">
                  {/* KYC Actions */}
                  {u.kycStatus === "pending" && (
                    <>
                      <button
                        onClick={() => (window.location.href = `/admin/kyc/${u._id}`)}
                        className="px-3 py-1 text-xs text-white rounded-lg bg-emerald-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => (window.location.href = `/admin/kyc/${u._id}`)}
                        className="px-3 py-1 text-xs text-white rounded-lg bg-rose-600"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {u.kycStatus === "rejected" && (
                    <button
                      onClick={() => (window.location.href = `/admin/kyc/${u._id}`)}
                      className="px-3 py-1 text-xs text-white rounded-lg bg-emerald-600"
                    >
                      Re-Approve
                    </button>
                  )}

                  {/* Block/Unblock */}
                  <button
                    onClick={() => toggleBlock(u._id)}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      u.blocked ? "bg-emerald-600" : "bg-rose-600"
                    } text-white`}
                  >
                    {u.blocked ? "Unblock" : "Block"}
                  </button>

                  <button className="px-3 py-1 text-xs text-white bg-indigo-600 rounded-lg">
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
