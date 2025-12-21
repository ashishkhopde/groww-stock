import { useState, useEffect } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import Footer from "../components/Footer.jsx";
import TickerStrip from "../components/TickerStrip.jsx";

export default function Withdrawals() {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("bank");
    const [accountDetails, setAccountDetails] = useState({
        accountHolder: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
    });
    const [note, setNote] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ Load user's previous withdrawals
    useEffect(() => {
        const loadWithdrawals = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const res = await API.get(`/withdrawals/my/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setRequests(res.data.requests || []);
            } catch (error) {
                console.error("Error loading withdrawals:", error);
            }
        };

        loadWithdrawals();
    }, []);

    // ✅ Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const payload = {
                amount,
                method,
                accountDetails,
                note,
            };

            const res = await API.post(`/withdrawals/${user.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Withdrawal request submitted successfully!");
            setRequests((prev) => [res.data.request, ...prev]);

            // Reset form
            setAmount("");
            setNote("");
            setAccountDetails({
                accountHolder: "",
                accountNumber: "",
                ifscCode: "",
                upiId: "",
            });
        } catch (error) {
            console.error("Error creating withdrawal:", error);
            alert("Failed to submit withdrawal request.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <DashboardLayout>
            <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
                <TickerStrip />

                <div className="flex-grow w-full max-w-5xl p-6 mx-auto lg:p-10">
                    <h1 className="mb-2 text-3xl font-bold text-slate-800">
                        Withdrawal Requests
                    </h1>
                    <p className="mb-8 text-slate-500">
                        Submit and track your withdrawal requests.
                    </p>

                    {/* WITHDRAWAL FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-6 mb-10 bg-white border shadow-sm rounded-2xl border-slate-200"
                    >
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">
                            New Withdrawal
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Amount */}
                            <div>
                                <label className="text-sm font-medium text-slate-600">
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                    className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Method */}
                            <div>
                                <label className="text-sm font-medium text-slate-600">
                                    Method
                                </label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="bank">Bank Transfer</option>
                                    <option value="upi">UPI</option>
                                </select>
                            </div>

                            {/* Conditional Fields */}
                            {method === "bank" ? (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-slate-600">
                                            Account Holder Name
                                        </label>
                                        <input
                                            type="text"
                                            value={accountDetails.accountHolder}
                                            onChange={(e) =>
                                                setAccountDetails({
                                                    ...accountDetails,
                                                    accountHolder: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-50 border-slate-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-600">
                                            Account Number
                                        </label>
                                        <input
                                            type="text"
                                            value={accountDetails.accountNumber}
                                            onChange={(e) =>
                                                setAccountDetails({
                                                    ...accountDetails,
                                                    accountNumber: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-50 border-slate-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-600">
                                            IFSC Code
                                        </label>
                                        <input
                                            type="text"
                                            value={accountDetails.ifscCode}
                                            onChange={(e) =>
                                                setAccountDetails({
                                                    ...accountDetails,
                                                    ifscCode: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-50 border-slate-200"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-slate-600">
                                        UPI ID
                                    </label>
                                    <input
                                        type="text"
                                        value={accountDetails.upiId}
                                        onChange={(e) =>
                                            setAccountDetails({
                                                ...accountDetails,
                                                upiId: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-50 border-slate-200"
                                    />
                                </div>
                            )}

                            {/* Note */}
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-slate-600">
                                    Note (optional)
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-50 border-slate-200"
                                    placeholder="Add any note for admin..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${loading
                                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                                    }`}
                            >
                                {loading ? "Submitting..." : "Submit Request"}
                            </button>
                        </div>
                    </form>

                    {/* WITHDRAWAL HISTORY */}
                    <div className="p-6 bg-white border shadow-sm rounded-2xl border-slate-200">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">
                            Withdrawal History
                        </h2>

                        {requests.length === 0 ? (
                            <div className="py-10 text-center border border-dashed text-slate-500 border-slate-300 rounded-xl">
                                No withdrawal requests yet.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs uppercase border-b text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Method</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((req) => (
                                            <tr
                                                key={req._id}
                                                className="transition border-b hover:bg-slate-50"
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    ₹{req.amount.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 capitalize">{req.method}</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${req.status === "approved"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : req.status === "rejected"
                                                                    ? "bg-rose-100 text-rose-700"
                                                                    : "bg-amber-100 text-amber-700"
                                                            }`}
                                                    >
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {new Date(req.createdAt).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        </DashboardLayout>
    );
}
