import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* LEFT SIDEBAR — KEEP ONLY ONE */}
      <aside className="w-64 p-6 space-y-6 text-white bg-slate-900">

        <h2 className="text-lg font-bold">Admin</h2>

        <nav className="space-y-4">
          <a href="/admin" className="block hover:text-emerald-400">Dashboard</a>
          <a href="/admin/users" className="block hover:text-emerald-400">Users</a>
          <a href="/admin/kyc" className="block hover:text-emerald-400">KYC Requests</a>
          <a href="/admin/withdrawal" className="block hover:text-emerald-400">Withdrawal Requests</a>
          <a href="/admin/stocks" className="block hover:text-emerald-400">Stocks</a>
          <a href="/admin/wallet" className="block hover:text-emerald-400">Wallet / Deposits</a>
        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
