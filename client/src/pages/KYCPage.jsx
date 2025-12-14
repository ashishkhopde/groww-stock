import { useState, useEffect } from "react";
import API from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { User, Phone, FileText, Landmark, IdCard } from "lucide-react";

export default function KYCPage() {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch user profile
  useEffect(() => {
    API.get("/auth/profile").then((res) => {
      setUser(res.data);

      if (res.data.kycStatus === "approved") {
        window.location.href = "/dashboard";
      }

      // Pre-fill some fields
      setName(res.data.name || "");
      setMobile(res.data.mobile || "");
    });
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await API.post("/kyc/submit", {
        name,
        mobile,
        aadhaar,
        pan,
    bankAccount,
        ifsc,
        address,
        dob,
      });

      setSubmitted(true);
    } catch (error) {
      alert("Error submitting KYC");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-10">Loading...</div>;

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold text-emerald-600">
            KYC Submitted Successfully 🎉
          </h1>
          <p className="text-slate-600 mt-2">
            Please wait for admin approval. You will be notified once verified.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Complete Your KYC Verification
        </h1>
        <p className="text-slate-600 mb-8">
          Provide your identity & banking details to activate your account.
        </p>

        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow">

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium flex gap-2">
              <User size={18} /> Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 border focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm font-medium flex gap-2">
              <Phone size={18} /> Mobile Number
            </label>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 border focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Aadhaar */}
          <div>
            <label className="text-sm font-medium flex gap-2">
              <FileText size={18} /> Aadhaar Number
            </label>
            <input
              value={aadhaar}
              maxLength={12}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 border"
            />
          </div>

          {/* PAN */}
          <div>
            <label className="text-sm font-medium flex gap-2">
              <IdCard size={18} /> PAN Card Number
            </label>
            <input
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              maxLength={10}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 border"
            />
          </div>

          {/* Bank Account */}
          <div>
            <label className="text-sm font-medium flex gap-2">
              <Landmark size={18} /> Bank Account Number
            </label>
            <input
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ""))}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 border"
            />
          </div>

          {/* IFSC Code */}
          <div>
            <label className="text-sm font-medium flex gap-2">
              <Landmark size={18} /> IFSC Code
            </label>
            <input
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 border"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 border"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium">Full Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 border"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
          >
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
