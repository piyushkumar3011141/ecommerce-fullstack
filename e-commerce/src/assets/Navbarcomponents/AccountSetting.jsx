import React from "react";
import { Navigate } from "react-router-dom";

// Account settings now lives at /account — keep this route working by redirecting.
export default function AccountSetting() {
  return <Navigate to="/account" replace />;
}
