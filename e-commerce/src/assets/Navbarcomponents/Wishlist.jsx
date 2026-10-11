import React from "react";
import { Link } from "react-router-dom";
import "./Wishlist.css";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const Wishlist = () => {
  const { wishlistProducts, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistProducts.length === 0) {
    return (
      <div className="container-fluid bg-light py-5" style={{ minHeight: "60vh" }}>
        <div className="container text-center">
          <h2 className="fw-bold">Your wishlist is empty</h2>
          <p className="text-secondary">Tap the heart icon on any product to save it here.</p>
          <Link to="/allproduct" className="btn btn-danger">Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        <div className="mb-4">
          <h2 className="fw-bold">My Wishlist</h2>
          <p className="text-secondary">{wishlistProducts.length} saved item(s)</p>
        </div>

        <div className="row g-4">
          {wishlistProducts.map((p) => (
            <div className="col-md-3 col-sm-6" key={p.id}>
              <div className="card border-0 shadow-sm h-100">
                <Link to={`/productdetail/${p.id}`}>
                  <img src={p.image} alt={p.name} className="card-img-top" style={{ height: "180px", objectFit: "contain", padding: "10px" }} />
                </Link>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{p.name}</h6>
                  <p className="fw-bold mb-2">₹{p.price.toLocaleString("en-IN")}</p>
                  <div className="mt-auto d-flex gap-2">
                    <button className="btn btn-warning btn-sm flex-grow-1" onClick={() => addToCart(p.id, 1)}>
                      Add to cart
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromWishlist(p.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
