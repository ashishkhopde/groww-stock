import { useState } from "react";
import API from "../../api/axios";
import { ShieldCheck, Lock, Mail } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/admin/login", { email, password });

      localStorage.setItem("adminToken", res.data.token);

      window.location.href = "/admin/dashboard"; // Redirect to admin dashboard
    } catch (err) {
      setError("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
            <ShieldCheck size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mt-4">
            Admin Login
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Authorized personnel only
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-2 bg-rose-500/20 text-rose-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-slate-300 text-sm mb-2 block">Admin Email</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white">
              <Mail size={18} className="mr-2 text-slate-300" />
              <input
                type="email"
                className="bg-transparent flex-1 outline-none placeholder-slate-400"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-slate-300 text-sm mb-2 block">Password</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white">
              <Lock size={18} className="mr-2 text-slate-300" />
              <input
                type="password"
                className="bg-transparent flex-1 outline-none placeholder-slate-400"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-semibold rounded-xl shadow-lg transition"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>

        </form>
      </div>
    </div>
  );
}
