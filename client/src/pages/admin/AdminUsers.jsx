import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Users,
  CheckCircle,
  Ban,
  Unlock,
  UserCog,
  XCircle,
  Clock,
  FileWarning,
  Search,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
    await API.patch(
      `/admin/users/toggle-block/${id}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
    );

    setUsers(
      users.map((u) =>
        u._id === id ? { ...u, isBlocked: !u.isBlocked } : u
      )
    );
  };

  const handleUser = (id) => {
    navigate(`/admin/kyc/${id}`);
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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">

      {/* HEADER + SEARCH */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
            <Users size={28} className="text-emerald-600" />
            Manage Users
          </h1>
          <p className="text-slate-500">
            View, approve, block or manage all registered users.
          </p>
        </div>

        {/* UPDATED SEARCH BAR */}
        <div className="relative w-80">

          <Search
            size={18}
            className="absolute text-slate-400 left-3 top-1/2 -translate-y-1/2"
          />

          <input
            type="text"
            placeholder="Search user by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}

        </div>

      </div>

      {/* USER TABLE */}
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
            {filteredUsers.map((u) => (
              <tr
                key={u._id}
                className="transition border-t border-slate-200 hover:bg-slate-50"
              >
                <td className="p-4 font-medium text-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                      className="w-10 h-10 rounded-full"
                    />
                    {u.name}
                  </div>
                </td>

                <td className="p-4">{u.email}</td>

                <td className="p-4">{renderKYCStatus(u.kycStatus)}</td>

                <td className="p-4">
                  {u.isBlocked ? (
                    <span className="flex items-center gap-1 font-semibold text-rose-600">
                      <Ban size={16} /> Blocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                      <Unlock size={16} /> Active
                    </span>
                  )}
                </td>

                <td className="p-4 space-x-2 text-right">

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

                  <button
                    onClick={() => toggleBlock(u._id)}
                    className={`px-3 py-1 text-xs rounded-lg ${
                      u.isBlocked ? "bg-emerald-600" : "bg-rose-600"
                    } text-white`}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>

                  <button
                    className="px-3 py-1 text-xs text-white bg-indigo-600 rounded-lg"
                    onClick={() => handleUser(u._id)}
                  >
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