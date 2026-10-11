import React, { useState } from "react";
import "./Payment.css";
import { useLocation, Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { getErrorMessage } from "../../services/axiosConfig";

const METHODS = [
  { id: "COD", label: "Cash on Delivery", icon: "fa-solid fa-money-bill-wave" },
  { id: "UPI", label: "UPI", icon: "fa-solid fa-mobile-screen" },
  { id: "Credit / Debit Card", label: "Credit / Debit Card", icon: "fa-regular fa-credit-card" },
  { id: "Net Banking", label: "Net Banking", icon: "fa-solid fa-building-columns" },
];

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Kotak Mahindra Bank"];

// 4111111111111111 -> "4111 1111 1111 1111"
const formatCard = (value) =>
  value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();

// 1234 -> "12/34"
const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const Payment = () => {
  const location = useLocation();

  const { cartProducts, cartCount, cartTotal, clearCart } = useCart();
  const { addresses, placeOrder } = useOrders();

  const [method, setMethod] = useState("COD");
  const [placed, setPlaced] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [card, setCard] = useState({ cardNumber: "", cardName: "", expiry: "", cvv: "" });

  const addressId = location.state?.addressId;
  const address = addresses.find((a) => a.id === addressId);

  const emptyBox = (title, linkTo, linkText) => (
    <div className="container-fluid bg-light py-5" style={{ minHeight: "60vh" }}>
      <div className="container text-center">
        <h2 className="fw-bold">{title}</h2>
        <Link to={linkTo} className="btn btn-danger">{linkText}</Link>
      </div>
    </div>
  );

  if (cartCount === 0 && !placed) return emptyBox("Your cart is empty", "/allproduct", "Start shopping");
  if (!address && !placed) return emptyBox("Select a delivery address first", "/address", "Choose address");

  // =========================
  // ORDER PLACED
  // =========================
  if (placed) {
    const paid = placed.paymentStatus === "PAID";

    return (
      <div className="container-fluid bg-light py-5" style={{ minHeight: "60vh" }}>
        <div className="container text-center">
          <h2 className="fw-bold text-success">Order placed! 🎉</h2>

          <p className="text-secondary mb-1">Order #{placed.orderNumber || placed.id}</p>

          <p className="fw-bold mb-1">
            {paid ? "Total paid" : "Amount to pay on delivery"}: ₹
            {Number(placed.total).toLocaleString("en-IN")}
          </p>

          <p className="text-secondary small">
            {placed.payment} · Payment {String(placed.paymentStatus || "").toLowerCase()}
            {placed.transactionId ? ` · Ref ${placed.transactionId}` : ""}
          </p>

          <Link to="/orders" className="btn btn-danger me-2">View orders</Link>
          <Link to="/allproduct" className="btn btn-outline-danger">Continue shopping</Link>
        </div>
      </div>
    );
  }

  // =========================
  // PLACE ORDER
  // =========================
  const handlePlaceOrder = async () => {
    setError("");
    setBusy(true);

    try {
      const paymentDetails =
        method === "UPI"
          ? { upiId }
          : method === "Net Banking"
          ? { bank }
          : method === "Credit / Debit Card"
          ? { ...card, cardNumber: card.cardNumber.replace(/\s/g, "") }
          : {};

      const order = await placeOrder({
        items: cartProducts,
        total: cartTotal,
        address,
        payment: method,
        paymentDetails,
      });

      // Cart tabhi khali hota hai jab order + payment dono successful ho
      await clearCart();
      setPlaced(order);
    } catch (err) {
      console.error("Order Place Error:", err);
      setError(getErrorMessage(err, "Order place nahi hua."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <h2 className="fw-bold mb-4">Payment</h2>

        <div className="row g-4">
          {/* LEFT SIDE */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-3 mb-3">
              <h6 className="fw-bold">Delivering to</h6>
              <p className="mb-0 text-secondary">
                {address.name}, {address.line1}, {address.city}, {address.state} - {address.pincode}
              </p>
            </div>

            <div className="card border-0 shadow-sm p-3">
              <h6 className="fw-bold mb-3">Choose payment method</h6>

              {METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`pay-option d-flex align-items-center gap-2 mb-2 ${method === m.id ? "pay-option--active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={method === m.id}
                    onChange={() => {
                      setMethod(m.id);
                      setError("");
                    }}
                  />
                  <i className={m.icon}></i>
                  {m.label}
                </label>
              ))}

              {/* METHOD DETAILS */}
              <div className="pay-details mt-2">
                {method === "COD" && (
                  <p className="small text-secondary mb-0">
                    Pay in cash when your order arrives. No extra charges.
                  </p>
                )}

                {method === "UPI" && (
                  <>
                    <label className="small text-secondary">UPI ID</label>
                    <input
                      className="form-control"
                      placeholder="name@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </>
                )}

                {method === "Net Banking" && (
                  <>
                    <label className="small text-secondary">Select your bank</label>
                    <select className="form-select" value={bank} onChange={(e) => setBank(e.target.value)}>
                      <option value="">Choose bank</option>
                      {BANKS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </>
                )}

                {method === "Credit / Debit Card" && (
                  <div className="row g-2">
                    <div className="col-12">
                      <label className="small text-secondary">Card number</label>
                      <input
                        className="form-control"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 5678 9012 3456"
                        value={card.cardNumber}
                        onChange={(e) => setCard({ ...card, cardNumber: formatCard(e.target.value) })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="small text-secondary">Name on card</label>
                      <input
                        className="form-control"
                        autoComplete="cc-name"
                        value={card.cardName}
                        onChange={(e) => setCard({ ...card, cardName: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="small text-secondary">Expiry (MM/YY)</label>
                      <input
                        className="form-control"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="08/29"
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="small text-secondary">CVV</label>
                      <input
                        className="form-control"
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })}
                      />
                    </div>
                  </div>
                )}

                {method !== "COD" && (
                  <p className="small text-muted mt-2 mb-0">
                    Demo store: payments are simulated, no real money is charged.
                    {method === "Credit / Debit Card" && " Test card: 4111 1111 1111 1111 (any future expiry, any CVV)."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-3">
              <h6 className="fw-bold mb-3">Order Summary</h6>

              {cartProducts.map((item) => (
                <div className="d-flex justify-content-between small mb-1 gap-2" key={item.id}>
                  <span>{item.name} × {item.qty}</span>
                  <span className="text-nowrap">
                    ₹{(Number(item.price) * Number(item.qty)).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>Total</span>
                <span>₹{Number(cartTotal).toLocaleString("en-IN")}</span>
              </div>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <button className="btn btn-danger w-100" onClick={handlePlaceOrder} disabled={busy}>
                {busy ? "Processing..." : method === "COD" ? "Place order" : `Pay ₹${Number(cartTotal).toLocaleString("en-IN")}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
