import React from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

export default function PrivateRoute({ children }) {
  let userData = JSON.parse(localStorage.getItem("user"));
  //    console.log(userData)

  if (!userData) {
    return <Navigate to={"/login"} />;
  } else if (userData.kycStatus == "not_submitted") {
    return <Navigate to={"/kyc"} />;
  } else if (userData.kycStatus == "pending") {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold text-center text-emerald-600">
            KYC Submitted Successfully 🎉<br />
            Pending Verification
          </h1>
          <p className="mt-2 text-slate-600">
            Please wait for admin approval. You will be notified once verified.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return children;
}
