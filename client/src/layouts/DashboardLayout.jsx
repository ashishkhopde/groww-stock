import React, { useEffect, useState } from "react";
import API from "../api/axios";
import {
  LayoutDashboard,
  Wallet,
  ArrowUpRight,
  Users,
  Bell,
  Menu,
  X,
  TrendingUp,
  CreditCard,
  LogOut,
} from "lucide-react";

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

  const handleNavigate = (path) => {
    setActive(path);
    window.location.href = path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-800 overflow-hidden">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
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
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-lg">
              F
            </div>
            <span className="tracking-wide">Angel Smartlgo</span>
          </div>

          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* MENU */}
        <nav className="px-4 py-2 space-y-1">
          <p className="px-4 mb-2 text-xs text-slate-500 uppercase tracking-wider">
            Menu
          </p>

          {/* UPDATED MENU LIST WITH PROFILE ADDED */}
          {[
            {
              label: "Dashboard",
              icon: <LayoutDashboard size={20} />,
              path: "/dashboard",
            },
            {
              label: "Portfolio",
              icon: <TrendingUp size={20} />,
              path: "/portfolio",
            },
            {
              label: "Profile",
              icon: <Users size={20} />,
              path: "/profile",
            },
            {
              label: "Withdrawal List",
              icon: <ArrowUpRight size={20} />,
              path: "/withdrawal",
            },
            {
              label: "Plan List",
              icon: <CreditCard size={20} />,
              path: "/plans",
            },
            {
              label: "Wallet History",
              icon: <Wallet size={20} />,
              path: "/wallet",
            },
          ].map((item) => (
            <div
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
              ${
                active === item.path
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
          ))}

          {/* Logout */}
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-red-400 hover:bg-red-700/20 hover:text-red-300 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </div>
        </nav>

        {/* USER FOOTER */}
        <div className="absolute bottom-0 w-full p-4 bg-slate-800/40 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=UserAvatar"
              className="w-10 h-10 rounded-full border border-slate-600"
            />
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-auto relative">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0">
          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-slate-100"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <h2 className="text-lg font-semibold tracking-tight">
            {active.replace("/", "").toUpperCase() || "Dashboard"}
          </h2>

          <button className="p-2 rounded-full hover:bg-slate-100">
            <Bell size={20} />
          </button>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
