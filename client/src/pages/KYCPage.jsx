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
      
      let user = JSON.parse(localStorage.getItem("user"));
      user.kycStatus = "pending";
      localStorage.setItem("user", JSON.stringify(user));
      
      alert("submitted KYC");
    } catch (error) {
      alert("Error submitting KYC");
      console.log(error);
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
          <p className="mt-2 text-slate-600">
            Please wait for admin approval. You will be notified once verified.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl p-6 mx-auto lg:p-10">

        <h1 className="mb-6 text-3xl font-bold text-slate-900">
          Complete Your KYC Verification
        </h1>
        <p className="mb-8 text-slate-600">
          Provide your identity & banking details to activate your account.
        </p>

        <div className="p-6 space-y-6 bg-white border shadow rounded-2xl border-slate-200">

          {/* Full Name */}
          <div>
            <label className="flex gap-2 text-sm font-medium">
              <User size={18} /> Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 mt-2 border outline-none rounded-xl bg-slate-100 focus:bg-white focus:border-emerald-500"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="flex gap-2 text-sm font-medium">
              <Phone size={18} /> Mobile Number
            </label>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              className="w-full px-4 py-3 mt-2 border outline-none rounded-xl bg-slate-100 focus:bg-white focus:border-emerald-500"
            />
          </div>

          {/* Aadhaar */}
          <div>
            <label className="flex gap-2 text-sm font-medium">
              <FileText size={18} /> Aadhaar Number
            </label>
            <input
              value={aadhaar}
              maxLength={12}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-100"
            />
          </div>

          {/* PAN */}
          <div>
            <label className="flex gap-2 text-sm font-medium">
              <IdCard size={18} /> PAN Card Number
            </label>
            <input
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              maxLength={10}
              className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-100"
            />
          </div>

          {/* Bank Account */}
          <div>
            <label className="flex gap-2 text-sm font-medium">
              <Landmark size={18} /> Bank Account Number
            </label>
            <input
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-100"
            />
          </div>

          {/* IFSC Code */}
          <div>
            <label className="flex gap-2 text-sm font-medium">
              <Landmark size={18} /> IFSC Code
            </label>
            <input
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-100"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-100"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-medium">Full Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 mt-2 border rounded-xl bg-slate-100"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 font-bold text-white transition bg-emerald-600 rounded-xl hover:bg-emerald-700"
          >
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
