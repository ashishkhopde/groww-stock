import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

export default function PrivateRoute({ children }) {
  const [userData, setUserData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          localStorage.removeItem("user");
          setUserData(null);
          setLoading(false);
          return;
        }

        // ✅ Fetch latest profile
        const { data: freshUser } = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 🧠 If local copy is missing or outdated → update it
        const oldUser = JSON.parse(localStorage.getItem("user"));
        if (!oldUser || oldUser.kycStatus !== freshUser.kycStatus) {
          console.log(
            `%c🔄 Updating user localStorage — KYC changed from "${oldUser?.kycStatus}" to "${freshUser.kycStatus}"`,
            "color: #16a34a; font-weight: bold;"
          );
          localStorage.setItem("user", JSON.stringify(freshUser));
        }

        setUserData(freshUser);
      } catch (err) {
        console.error("❌ Failed to fetch user profile:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-slate-600">Checking user status...</div>
      </DashboardLayout>
    );
  }

  // ✅ If not logged in
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  // ✅ KYC: not submitted → redirect to /kyc
  if (userData.kycStatus === "not_submitted") {
    return <Navigate to="/kyc" replace />;
  }

  // ✅ KYC: pending → show waiting message
  if (userData.kycStatus === "pending") {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold text-emerald-600">
            KYC Submitted Successfully 🎉
            <br />
            Pending Verification
          </h1>
          <p className="mt-2 text-slate-600">
            Please wait for admin approval. You will be notified once verified.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ✅ KYC: rejected → show message and option to resubmit
  if (userData.kycStatus === "rejected") {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold text-rose-600">
            KYC Rejected ❌
          </h1>
          <p className="mt-2 text-slate-600">
            Your KYC submission was rejected. Please update your details and resubmit.
          </p>
          <a
            href="/kyc"
            className="inline-block mt-4 px-5 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Resubmit KYC
          </a>
        </div>
      </DashboardLayout>
    );
  }

  // ✅ Otherwise (approved or no KYC restriction)
  return children;
}
