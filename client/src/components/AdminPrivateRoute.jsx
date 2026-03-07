import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import API from "../api/axios";

export default function AdminPrivateRoute({ children }) {
  const [adminData, setAdminData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          localStorage.removeItem("admin");
          setAdminData(null);
          setLoading(false);
          return;
        }

        // Fetch admin profile
        const { data: freshAdmin } = await API.get("/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update localStorage if needed
        const oldAdmin = JSON.parse(localStorage.getItem("admin"));
        if (!oldAdmin || oldAdmin.email !== freshAdmin.email) {
          localStorage.setItem("admin", JSON.stringify(freshAdmin));
        }

        setAdminData(freshAdmin);
      } catch (err) {
        console.error("Failed to fetch admin profile:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin");
          setAdminData(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAdmin();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-slate-600">Checking admin status...</div>
      </AdminLayout>
    );
  }

  // If not logged in as admin
  if (!adminData) {
    return <Navigate to="/admin/login" replace />;
  }

  // Otherwise, allow access
  return children;
}
