import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

// Login ke bina ye pages (address, payment, orders) nahi khulte.
// Login ke baad user wapas isi page par aa jata hai.
export default function RequireLogin({ children, admin = false }) {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoggedIn && (!admin || isAdmin)) return children;

  if (isLoggedIn && admin) {
    return (
      <div className="container-fluid bg-light py-5" style={{ minHeight: "60vh" }}>
        <div className="container text-center">
          <h3 className="fw-bold">Admin access only</h3>
          <p className="text-secondary">Your Account dose not allowed this page.</p>
          <button className="btn btn-danger" onClick={() => navigate("/")}>Go to home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light py-5" style={{ minHeight: "60vh" }}>
      <div className="container text-center">
        <h3 className="fw-bold">Please sign in to continue</h3>
        <p className="text-secondary">
          Is page ko dekhne ke liye apne account me login karo.
        </p>
        <button
          className="btn btn-danger"
          onClick={() =>
            navigate("/account", { state: { from: location.pathname } })
          }
        >
          Sign in / Create account
        </button>
      </div>
    </div>
  );
}
