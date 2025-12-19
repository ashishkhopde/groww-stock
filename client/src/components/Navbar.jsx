import { LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/charts/logo.png";

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">

        {/* LEFT : LOGO */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Dashboard Logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* 📱 MOBILE ONLY (<640px) : ICONS */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-md hover:bg-slate-100"
              aria-label="Dashboard"
            >
              <LayoutDashboard size={22} />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-rose-600 hover:bg-rose-50"
              aria-label="Logout"
            >
              <LogOut size={22} />
            </button>
          </div>

          {/* 📲 TABLET + DESKTOP (≥640px) : TEXT BUTTONS */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate("/portfolio")}
              className="px-4 py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-900 transition"
            >
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-700 text-white text-sm rounded-md hover:bg-rose-600 transition"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
