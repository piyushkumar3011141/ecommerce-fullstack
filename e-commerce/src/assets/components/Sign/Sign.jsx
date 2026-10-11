import React, { useState } from "react";
import "./Sign.css";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const emptyForm = { name: "", email: "", password: "", phone: "" };

export default function Sign() {
  const { isLoggedIn, currentUser, login, signup, logout } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState(null); // null | "signin" | "signup"
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    const result = mode === "signup" ? await signup(form) : await login(form);

    setBusy(false);

    if (!result.ok) {
      setError(result.message);
    } else {
      setMode(null);
      setForm(emptyForm);
    }
  };

  if (isLoggedIn) {
    return (
      <>
        <div className="d-flex justify-content-center flex-column align-items-center sign-welcome">
          <h4 className="text-center">Welcome back, {currentUser.name}! 👋</h4>

          <div className="d-flex gap-2 mt-2">
            <button className="btn btn-outline-danger" onClick={() => navigate("/orders")}>
              My Orders
            </button>
            <button className="btn btn-danger" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
        <hr />
      </>
    );
  }

  return (
    <>
      {!mode ? (
        <div className="sign-intro">
          <h2 className="sign-heading">See personalized recommendations</h2>

          <div className="d-flex justify-content-center">
            <button className="btn btn-primary" onClick={() => setMode("signin")}>
              Sign in
            </button>
          </div>

          <div className="d-flex justify-content-center align-items-center mt-2">
            <h6 className="mb-0">New customer?</h6>
            <button
              className="btn btn-link p-0 ms-2"
              onClick={() => setMode("signup")}
            >
              Start here
            </button>
          </div>
        </div>
      ) : (
        <div className="sign-form-wrap">
          <form className="sign-form" onSubmit={handleSubmit}>
            <h4 className="text-center mb-3">
              {mode === "signup" ? "Create account" : "Sign in"}
            </h4>

            {error && <div className="alert alert-danger py-1">{error}</div>}

            {mode === "signup" && (
              <input
                className="form-control mb-2"
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            )}

            <input
              className="form-control mb-2"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            {mode === "signup" && (
              <input
                className="form-control mb-2"
                name="phone"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={handleChange}
              />
            )}

            <input
              className="form-control mb-3"
              name="password"
              type="password"
              placeholder={mode === "signup" ? "Password (min 6 characters)" : "Password"}
              value={form.password}
              onChange={handleChange}
              required
            />

            <button className="btn btn-danger w-100 mb-2" type="submit" disabled={busy}>
              {busy ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
            </button>

            <button
              type="button"
              className="btn btn-link w-100"
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setError("");
              }}
            >
              {mode === "signup"
                ? "Already have an account? Sign in"
                : "New here? Create an account"}
            </button>
          </form>
        </div>
      )}
      <hr />
    </>
  );
}
