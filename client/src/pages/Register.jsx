import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // STEP 1 → Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/send-email-otp", { email: form.email });

      alert("OTP sent to your email address");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 → Verify OTP & Register User
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    try {
      const res = await API.post("/auth/verify-email-otp", {
        email: form.email,
        otp,
        name: form.name,
        phone: form.phone,
        password: form.password,
      });

      // Save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Registration successful!");
      nav("/kyc");
    } catch (err) {
      alert(err.response?.data?.msg || "Incorrect OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-[#1e293b]">
          {step === 1 ? "Create Account" : "Verify Email OTP"}
        </h2>

        <p className="mt-1 text-center text-gray-600">
          {step === 1
            ? "Start your investment journey"
            : `We sent an OTP to ${form.email}`}
        </p>

        {/* STEP 1 FORM */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="mt-8 space-y-5">
            <div>
              <label className="font-medium text-gray-700">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                className="w-full px-4 py-3 mt-1 border outline-none rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="w-full px-4 py-3 mt-1 border outline-none rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="Email address"
                required
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                className="w-full px-4 py-3 mt-1 border outline-none rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="10-digit mobile number"
                required
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">Password</label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                className="w-full px-4 py-3 mt-1 border outline-none rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="Create password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg text-white bg-emerald-600 rounded-xl hover:bg-emerald-700"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 OTP SCREEN */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
            <div>
              <label className="font-medium text-gray-700">Enter OTP</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                maxLength={6}
                className="mt-1 w-full px-4 py-3 border rounded-xl focus:ring-2
                focus:ring-emerald-500 outline-none tracking-[0.6em] text-center text-lg"
                placeholder="••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={otpLoading}
              className="w-full py-3 text-lg text-white bg-emerald-600 rounded-xl hover:bg-emerald-700"
            >
              {otpLoading ? "Verifying..." : "Verify & Register"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-2 text-sm underline text-slate-500"
            >
              Change details
            </button>
          </form>
        )}

        <p className="mt-5 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-emerald-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
