import React, { useEffect } from "react";
import "./Logout.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    const t = setTimeout(() => navigate("/"), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="container text-center" style={{ minHeight: "50vh" }}>
      <h2 className="fw-bold">You've been signed out</h2>
      <p className="text-secondary">Redirecting to home...</p>
    </div>
  );
};

export default Logout;
