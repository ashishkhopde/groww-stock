import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    
    try {
      
      const res = await API.post("/auth/login", form);
      
      localStorage.setItem("token", res.data.token);
      // optional: save user info
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userId", res.data.user.id);
      
      // console.log(res.data.user.kycStatus);
      
      if (res.data.user.kycStatus === "not_submitted") {
        nav("/kyc");
      } else {
        nav("/dashboard");
      }
      
      alert("Login successful");
      // nav("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-[#1e293b]">Welcome Back</h2>
        <p className="mt-1 text-center text-gray-600">Login to continue</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="font-medium text-gray-700">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-3 mt-1 border outline-none rounded-xl focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter email"
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
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-lg text-white bg-emerald-600 rounded-xl hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-600">
          New user?{" "}
          <Link to="/register" className="font-medium text-emerald-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
