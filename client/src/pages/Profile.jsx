import { useState, useEffect } from "react";
import API from "../api/axios";
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit3,
  Landmark,
  FileText
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

/* ✅ ADDED */
// import DashboardNavbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import TickerStrip from "../components/TickerStrip.jsx";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [aadhaar, setAadhaar] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  useEffect(() => {
    API.get("/auth/profile")
      .then((res) => {
        setUser(res.data);
        setAadhaar(res.data.aadhaar || "");
        setBankAccount(res.data.bankAccount || "");
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  if (!user)
    return (
      <DashboardLayout>
        <div className="p-10">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

        {/* ✅ HEADER */}
        {/* <DashboardNavbar /> */}

        {/* ✅ TICKER */}
        <TickerStrip />

        {/* ===== PAGE CONTENT ===== */}
        <div className="flex-grow p-6 lg:p-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500">
              Manage your personal details & security.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT PROFILE CARD */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  className="w-28 h-28 rounded-full border-4 border-emerald-500 mb-4"
                />

                <h2 className="text-xl font-bold text-slate-900">
                  {user.name}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {user.email}
                </p>

                <button className="flex items-center gap-2 mt-4 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-sm">
                  <Edit3 size={16} /> Edit Profile Photo
                </button>
              </div>

              {/* KYC SECTION */}
              <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <Shield size={22} className="text-emerald-600" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        KYC Status
                      </p>
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
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Approved
                    </span>
                  ) : user.kycStatus === "rejected" ? (
                    <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Rejected
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                    <User size={16} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                    <Mail size={16} /> Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                    <Phone size={16} /> Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Add phone number"
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                    <FileText size={16} /> Aadhaar Number
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaar}
                    onChange={(e) =>
                      setAadhaar(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                    <Landmark size={16} /> Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) =>
                      setBankAccount(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-100 border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700">
                  Save Changes
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ✅ FOOTER */}
        <Footer />
      </div>
    </DashboardLayout>
  );
}

