import React, { useState } from "react";
import "./LoginSecurity.css";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Loginandsecurity = () => {
  const { currentUser, isLoggedIn, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN CHECK
  // =========================

  if (!isLoggedIn) {
    return (
      <div className="container text-center py-5" style={{ minHeight: "50vh" }}>
        <h3>Please sign in first</h3>

        <Link to="/account" className="btn btn-danger mt-2">
          Go to Account
        </Link>
      </div>
    );
  }

  // =========================
  // SAVE CHANGES
  // =========================

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    const result = await updateProfile({ name, phone, password });

    setLoading(false);

    if (result.ok) {
      setPassword("");
      setMsg("Profile updated successfully!");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container" style={{ maxWidth: "500px" }}>
        <h2 className="fw-bold mb-4">Login & Security</h2>

        {msg && <div className="alert alert-success py-2">{msg}</div>}
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form className="card border-0 shadow-sm p-4" onSubmit={handleSave}>
          {/* NAME */}
          <label className="small text-secondary">Name</label>
          <input
            className="form-control mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* EMAIL */}
          <label className="small text-secondary">Email</label>
          <input className="form-control mb-3" value={currentUser.email} disabled />

          {/* PHONE */}
          <label className="small text-secondary">Phone</label>
          <input
            className="form-control mb-3"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* PASSWORD */}
          <label className="small text-secondary">New password</label>
          <input
            className="form-control mb-3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current (min 6 characters)"
          />

          {/* SAVE BUTTON */}
          <button className="btn btn-danger" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Loginandsecurity;
