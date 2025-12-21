import { useState, useEffect } from "react";
import API from "../api/axios";
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit3,
  Landmark,
  FileText,
  XCircle,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Footer from "../components/Footer.jsx";
import TickerStrip from "../components/TickerStrip.jsx";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // ✅ Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const res = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setName(res.data.name || "");
        setMobile(res.data.kyc?.mobile || "");
        setAadhaar(res.data.kyc?.aadhaar || "");
        setBankAccount(res.data.kyc?.bankAccount || "");
      } catch (err) {
        console.error("Profile load failed:", err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    loadProfile();
  }, []);

  // ✅ Handle save changes
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = { name, mobile, aadhaar, bankAccount };

      const res = await API.put("/auth/update-profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <DashboardLayout>
        <div className="p-10">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <TickerStrip />

        {/* ===== PAGE CONTENT ===== */}
        <div className="flex-grow p-6 lg:p-8">
          {/* Header with Edit Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
              <p className="text-slate-500">
                Manage your personal details & security.
              </p>
            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                editMode
                  ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
            >
              {editMode ? (
                <>
                  <XCircle size={18} /> Cancel
                </>
              ) : (
                <>
                  <Edit3 size={18} /> Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* LEFT PROFILE CARD */}
            <div className="p-6 bg-white border shadow-md rounded-2xl border-slate-200">
              <div className="flex flex-col items-center text-center">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  className="mb-4 border-4 rounded-full w-28 h-28 border-emerald-500"
                  alt="Profile Avatar"
                />

                <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                <p className="mt-1 text-sm text-slate-500">{user.email}</p>

                <button className="flex items-center gap-2 px-4 py-2 mt-4 text-sm transition-all duration-200 rounded-lg bg-slate-100 hover:bg-slate-200">
                  <Edit3 size={16} /> Edit Profile Photo
                </button>
              </div>

              {/* KYC SECTION */}
              <div className="p-4 mt-8 border bg-slate-50 rounded-xl border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield size={22} className="text-emerald-600" />
                    <div>
                      <p className="font-semibold text-slate-800">KYC Status</p>
                      <p className="text-xs text-slate-500">
                        {user.kycStatus === "approved"
                          ? "Your KYC has been verified successfully"
                          : user.kycStatus === "rejected"
                          ? "Your KYC was rejected. Please resubmit."
                          : "Verification Required"}
                      </p>
                    </div>
                  </div>

                  {user.kycStatus === "approved" ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                      Approved
                    </span>
                  ) : user.kycStatus === "rejected" ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-700">
                      Rejected
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="p-6 bg-white border shadow-md rounded-2xl border-slate-200 lg:col-span-2">
              <h2 className="mb-6 text-xl font-bold text-slate-900">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <User size={16} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!editMode}
                    className={`w-full px-4 py-3 mt-2 border rounded-xl ${
                      editMode
                        ? "bg-white border-slate-300"
                        : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Mail size={16} /> Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-100 border-slate-200 text-slate-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Phone size={16} /> Phone Number
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={10}
                    disabled={!editMode}
                    className={`w-full px-4 py-3 mt-2 border rounded-xl ${
                      editMode
                        ? "bg-white border-slate-300"
                        : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  />
                </div>

                {/* Aadhaar */}
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <FileText size={16} /> Aadhaar Number
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    minLength={12}
                    value={aadhaar}
                    onChange={(e) =>
                      setAadhaar(e.target.value.replace(/\D/g, ""))
                    }
                    disabled={!editMode}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border ${
                      editMode
                        ? "bg-white border-slate-300"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  />
                </div>

                {/* Bank Account */}
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Landmark size={16} /> Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) =>
                      setBankAccount(e.target.value.replace(/\D/g, ""))
                    }
                    disabled={!editMode}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border ${
                      editMode
                        ? "bg-white border-slate-300"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  />
                </div>
              </div>

              {/* Save Button */}
              {editMode && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      loading
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </DashboardLayout>
  );
}
