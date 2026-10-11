import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { cartProducts, cartCount, cartTotal, cartMrpTotal, cartLoading, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const savings = cartMrpTotal - cartTotal;

  if (cartLoading) {
    return (
      <div className="container-fluid bg-light py-5" style={{ minHeight: "60vh" }}>
        <div className="container text-center text-secondary">Loading your cart...</div>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="container-fluid bg-light py-5" style={{ minHeight: "60vh" }}>
        <div className="container text-center">
          <h2 className="fw-bold">Your cart is empty</h2>
          <p className="text-secondary">Add some products to see them here.</p>
          <Link to="/allproduct" className="btn btn-danger">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">

        <div className="mb-4">
          <h2 className="fw-bold">Shopping Cart</h2>
          <p className="text-secondary">{cartCount} item{cartCount > 1 ? "s" : ""} in your cart</p>
        </div>

        <div className="row g-4">

          <div className="col-lg-8">
            {cartProducts.map((item) => (
              <div className="card border-0 shadow-sm mb-3" key={item.id}>
                <div className="card-body">
                  <div className="row align-items-center">

                    <div className="col-md-3 text-center">
                      <img src={item.image} alt={item.name} className="cart-image" />
                    </div>

                    <div className="col-md-5">
                      <h5 className="fw-semibold">{item.name}</h5>
                      <p className="text-secondary mb-1">by {item.brand}</p>
                      <p className="fw-bold mb-0">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>

                    <div className="col-md-2">
                      <div className="d-flex align-items-center border rounded">
                        <button className="btn btn-sm" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                        <span className="px-3">{item.qty}</span>
                        <button className="btn btn-sm" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      </div>
                    </div>

                    <div className="col-md-2 text-md-end">
                      <p className="fw-bold mb-2">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>
                        Remove
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Price Details</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span>Price ({cartCount} items)</span>
                  <span>₹{cartMrpTotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount</span>
                  <span>- ₹{savings.toLocaleString("en-IN")}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery</span>
                  <span className="text-success">FREE</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>

                <button
                  className="btn btn-danger w-100"
                  onClick={() => navigate("/address")}
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
