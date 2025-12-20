import React, { useEffect, useState } from "react";
import API from "../api/axios";
import {
  LayoutDashboard,
  Wallet,
  ArrowUpRight,
  Users,
  TrendingUp,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import logo from "../assets/charts/logo.png";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [active, setActive] = useState(window.location.pathname);
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/auth/profile")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Portfolio", path: "/portfolio", icon: <TrendingUp size={18} /> },
    { label: "Profile", path: "/profile", icon: <Users size={18} /> },
    { label: "Withdrawals", path: "/withdrawal", icon: <ArrowUpRight size={18} /> },
    { label: "Plans", path: "/plans", icon: <CreditCard size={18} /> },
    { label: "Wallet", path: "/wallet", icon: <Wallet size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] overflow-hidden">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#0F172A] text-white z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3 text-xl font-bold">
            <span>AngelSmartAlgo</span>
          </div>

          <button
            className="lg:hidden text-slate-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={() => {
                setActive(item.path);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                active === item.path
                  ? "bg-emerald-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}

          {/* Logout */}
          <a
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-4 text-red-400 cursor-pointer hover:bg-red-700/20 rounded-xl"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 overflow-auto">
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-30 w-full bg-white border-b shadow-sm border-slate-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* LEFT : TOGGLE + LOGO */}
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-md lg:hidden hover:bg-slate-100"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={22} />
              </button>

              <img
                src={logo}
                alt="Dashboard Logo"
                className="object-contain w-auto h-10"
              />
            </div>

            {/* MOBILE ONLY */}
            <div className="flex items-center gap-2 sm:hidden">
              <a
                href="/dashboard"
                className="p-2 rounded-md hover:bg-slate-100"
              >
                <LayoutDashboard size={22} />
              </a>

              <a
                onClick={handleLogout}
                className="p-2 rounded-md cursor-pointer text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={22} />
              </a>
            </div>

            {/* TABLET + DESKTOP */}
            <div className="items-center hidden gap-3 sm:flex">
              <a
                href="/dashboard"
                className="px-4 py-2 text-sm text-white rounded-md bg-slate-800 hover:bg-slate-900"
              >
                Dashboard
              </a>

              <a
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white rounded-md cursor-pointer bg-slate-700 hover:bg-rose-600"
              >
                Logout
              </a>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        {children}
      </main>
    </div>
  );
}
