import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";
import { useWishlist } from "../../context/WishlistContext";

const emptyForm = { name: "", email: "", password: "", phone: "" };

const Account = () => {
  const { currentUser, isLoggedIn, isAdmin, login, signup, logout } = useAuth();
  const { orders } = useOrders();
  const { wishlistCount } = useWishlist();

  const location = useLocation();
  const navigate = useNavigate();

  // Checkout se aaye the to login ke baad wapas wahin bhejo
  const redirectTo = location.state?.from;

  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // =========================
  // LOGIN + SIGNUP
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    const result =
      mode === "signup"
        ? await signup(form)
        : await login({ email: form.email, password: form.password });

    setBusy(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setForm(emptyForm);

    if (redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  };

  // =========================
  // LOGIN / SIGNUP SCREEN
  // =========================

  if (!isLoggedIn) {
    return (
      <div className="container-fluid bg-light py-5" style={{ minHeight: "70vh" }}>
        <div className="container d-flex justify-content-center">
          <form
            className="card border-0 shadow-sm p-4"
            style={{ maxWidth: "380px", width: "100%" }}
            onSubmit={handleSubmit}
          >
            <h4 className="text-center mb-3">
              {mode === "signup" ? "Create account" : "Sign in to your account"}
            </h4>

            {error && <div className="alert alert-danger py-1">{error}</div>}

            {/* NAME */}
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

            {/* EMAIL */}
            <input
              className="form-control mb-2"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            {/* PHONE */}
            {mode === "signup" && (
              <input
                className="form-control mb-2"
                name="phone"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={handleChange}
              />
            )}

            {/* PASSWORD */}
            <input
              className="form-control mb-3"
              name="password"
              type="password"
              placeholder={mode === "signup" ? "Password (min 6 characters)" : "Password"}
              value={form.password}
              onChange={handleChange}
              required
            />

            {/* SUBMIT */}
            <button className="btn btn-danger w-100 mb-2" type="submit" disabled={busy}>
              {busy
                ? "Please wait..."
                : mode === "signup"
                ? "Create account"
                : "Sign in"}
            </button>

            {/* SWITCH LOGIN / SIGNUP */}
            <button
              type="button"
              className="btn btn-link w-100"
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setError("");
                setForm(emptyForm);
              }}
            >
              {mode === "signup"
                ? "Already have an account? Sign in"
                : "New here? Create an account"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================
  // LOGGED-IN ACCOUNT PAGE
  // =========================

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="fw-bold">Account Settings</h2>
          <p className="text-secondary">
            Manage your account information and preferences
          </p>
        </div>

        <div className="row g-4">
          {/* LEFT MENU */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  <span className="list-group-item active py-3">
                    👤 {currentUser.name}
                  </span>

                  {isAdmin && (
                    <Link to="/admin" className="list-group-item list-group-item-action py-3 fw-semibold">
                      🛠️ Admin panel
                    </Link>
                  )}

                  <Link to="/orders" className="list-group-item list-group-item-action py-3">
                    📦 My Orders ({orders.length})
                  </Link>

                  <Link to="/wishlist" className="list-group-item list-group-item-action py-3">
                    ❤️ Wishlist ({wishlistCount})
                  </Link>

                  <Link to="/cart" className="list-group-item list-group-item-action py-3">
                    🛒 Cart
                  </Link>

                  <Link to="/address" className="list-group-item list-group-item-action py-3">
                    📍 Addresses
                  </Link>

                  <Link to="/loginandsecurity" className="list-group-item list-group-item-action py-3">
                    🔒 Login & Security
                  </Link>

                  <button
                    className="list-group-item list-group-item-action py-3 text-danger"
                    onClick={logout}
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PROFILE */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-3">Profile Information</h5>

              <p>
                <strong>Name:</strong> {currentUser.name}
              </p>

              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>

              <p>
                <strong>Phone:</strong> {currentUser.phone || "Not added"}
              </p>

              <Link
                to="/loginandsecurity"
                className="btn btn-outline-danger mt-2"
                style={{ width: "fit-content" }}
              >
                Edit profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
