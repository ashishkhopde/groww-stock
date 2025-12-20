import { useEffect, useState } from "react";
import API from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";
import { FileText, Eye } from "lucide-react";

export default function ManageKYC() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/kyc/pending", {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
    })
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10">Loading KYC requests...</div>;

  return (
    <>
      <div className="p-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">KYC Requests</h1>
        <p className="mb-8 text-slate-500">Review & verify user KYC submissions.</p>

        {users.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            No pending KYC requests 🎉
          </div>
        ) : (
          <div className="overflow-hidden bg-white border shadow-lg border-slate-200 rounded-2xl">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Mobile</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="flex items-center gap-3 p-4 font-medium text-slate-800">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                        className="w-10 h-10 rounded-full"
                      />
                      {u.name}
                    </td>

                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.kyc.mobile || "—"}</td>

                    <td className="p-4">
                      <span className="flex items-center gap-1 text-amber-600">
                        <FileText size={16} /> Pending Verification
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        className="flex items-center gap-1 px-3 py-2 text-xs text-white bg-indigo-600 rounded-lg"
                        onClick={() => (window.location.href = `/admin/kyc/${u._id}`)}
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </>
  );
}
