import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Order.css";
import { useOrders } from "../../context/OrderContext";
import { getErrorMessage } from "../../services/axiosConfig";

const STATUS_STEPS = ["Confirmed", "Processing", "Shipped", "Delivered"];

const STATUS_COLOR = {
  Confirmed: "primary",
  Processing: "info",
  Shipped: "warning",
  Delivered: "success",
  Cancelled: "danger",
};

const PAYMENT_COLOR = {
  PAID: "success",
  PENDING: "warning",
  REFUNDED: "secondary",
  CANCELLED: "secondary",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "N/A";

const Orders = () => {
  const { orders, cancelOrder } = useOrders();
  const [busyId, setBusyId] = useState(null);

  const handleCancel = async (order) => {
    if (!window.confirm("Cancel this order? Stock is restored and any prepaid amount is refunded.")) return;

    setBusyId(order.id);
    try {
      await cancelOrder(order.id);
    } catch (error) {
      alert(getErrorMessage(error, "Order cancel nahi hua."));
    } finally {
      setBusyId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="container-fluid bg-light py-5" style={{ minHeight: "60vh" }}>
        <div className="container text-center">
          <h2 className="fw-bold">No orders yet</h2>
          <p className="text-secondary">Your placed orders will show up here.</p>
          <Link to="/allproduct" className="btn btn-danger">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="fw-bold">My Orders</h2>
          <p className="text-secondary">{orders.length} order(s)</p>
        </div>

        {orders.map((order) => {
          const status = order.status || "Confirmed";
          const cancellable = status === "Confirmed" || status === "Processing";
          const stepIndex = STATUS_STEPS.indexOf(status);

          return (
            <div className="card border-0 shadow-sm mb-3" key={order.id}>
              <div className="card-body">
                {/* HEADER */}
                <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
                  <div>
                    <strong>Order #{order.orderNumber || order.id}</strong>
                    <p className="text-secondary small mb-0">Placed on {formatDate(order.orderDate)}</p>
                  </div>

                  <div className="d-flex align-items-start gap-2 flex-wrap">
                    <span className={`badge text-bg-${STATUS_COLOR[status] || "secondary"}`}>{status}</span>
                    {order.paymentStatus && (
                      <span className={`badge text-bg-${PAYMENT_COLOR[order.paymentStatus] || "secondary"}`}>
                        Payment {order.paymentStatus.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* PROGRESS */}
                {status !== "Cancelled" && (
                  <div className="order-steps" aria-label="Order progress">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className={`order-step ${i <= stepIndex ? "done" : ""}`}>
                        <span className="order-step__dot"></span>
                        <span className="order-step__label">{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                <hr />

                {/* ITEMS */}
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div className="d-flex align-items-center mb-3 gap-3" key={item.id}>
                      <div className="order-thumb">
                        <img src={item.image} alt={item.productName} />
                      </div>

                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        {item.productId ? (
                          <Link to={`/productdetail/${item.productId}`} className="mb-1 fw-semibold d-block text-dark text-decoration-none">
                            {item.productName}
                          </Link>
                        ) : (
                          <p className="mb-1 fw-semibold">{item.productName}</p>
                        )}
                        <p className="mb-0 text-secondary small">
                          Qty: {item.quantity} · ₹{Number(item.price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="fw-semibold text-nowrap">
                        ₹{(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary">No product details available.</p>
                )}

                <hr />

                {/* DETAILS */}
                <div className="mb-3 small">
                  <p className="mb-1"><strong>Customer:</strong> {order.customerName || "N/A"}{order.customerCity ? `, ${order.customerCity}` : ""}</p>
                  <p className="mb-1"><strong>Payment:</strong> {order.payment || "N/A"}</p>
                  {order.transactionId && (
                    <p className="mb-0"><strong>Reference:</strong> {order.transactionId}</p>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div>
                    <span className="text-secondary me-2">Order Total</span>
                    <strong>₹{Number(order.total || 0).toLocaleString("en-IN")}</strong>
                  </div>

                  {cancellable && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleCancel(order)}
                      disabled={busyId === order.id}
                    >
                      {busyId === order.id ? "Cancelling..." : "Cancel order"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
