import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Loader, CheckCircle, XCircle } from "lucide-react";

export default function AdminWithdrawalRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all withdrawal requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/admin/withdrawals", {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        setRequests(res.data.allRequests || []);
      } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
        alert("Failed to load withdrawal requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Handle approval/rejection
  const updateStatus = async (id, status) => {
    const confirmAction = window.confirm(`Are you sure you want to ${status} this request?`);
    if (!confirmAction) return;

    try {
      await API.patch(
        `/admin/withdrawals/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      alert(`Request ${status} successfully`);
      // Update state locally without reload
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status } : req))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-10">
        <Loader className="animate-spin" /> Loading withdrawal requests...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Withdrawal Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-slate-500">No withdrawal requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded-lg border-slate-200">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Account Details</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Note</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="border-t hover:bg-slate-50">
                  <td className="p-3">{req.userId?.name || "N/A"}</td>
                  <td className="p-3">{req.userId?.email || "N/A"}</td>
                  <td className="p-3 font-medium text-slate-800">₹{req.amount}</td>
                  <td className="p-3 capitalize">{req.method}</td>
                  <td className="p-3 text-slate-600">
                    {req.method === "bank" ? (
                      <div>
                        <p><strong>Holder:</strong> {req.accountDetails?.accountHolder || "-"}</p>
                        <p><strong>Acc No:</strong> {req.accountDetails?.accountNumber || "-"}</p>
                        <p><strong>IFSC:</strong> {req.accountDetails?.ifscCode || "-"}</p>
                      </div>
                    ) : req.method === "upi" ? (
                      <div>
                        <p><strong>UPI:</strong> {req.accountDetails?.upiId || "-"}</p>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td
                    className={`p-3 font-medium ${
                      req.status === "approved"
                        ? "text-green-600"
                        : req.status === "rejected"
                        ? "text-rose-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {req.status}
                  </td>
                  <td className="p-3">
                    {new Date(req.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3">{req.note || "-"}</td>
                  <td className="flex gap-2 p-3">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(req._id, "approved")}
                          className="flex items-center gap-1 px-3 py-2 text-white rounded-md bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button
                          onClick={() => updateStatus(req._id, "rejected")}
                          className="flex items-center gap-1 px-3 py-2 text-white rounded-md bg-rose-600 hover:bg-rose-700"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
