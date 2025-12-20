import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  let userData = JSON.parse(localStorage.getItem("user"));
  //    console.log(userData)

  if (!userData) {
    return <Navigate to={"/login"} />;
  } else if (userData.kycStatus == "not_submitted") {
    return <Navigate to={"/kyc"} />;
  }

  return children;
}
