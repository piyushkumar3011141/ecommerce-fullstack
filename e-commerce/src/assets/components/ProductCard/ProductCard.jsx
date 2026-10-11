import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {

  const { addToCart, isInCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const navigate = useNavigate();

  const inCart = isInCart(product.id);
  const liked = isWishlisted(product.id);
  const outOfStock = Number(product.stock) <= 0;


  // Add To Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product.id, 1);
  };


  // Buy Now
  const handleBuyNow = async (e) => {
    e.preventDefault();

    if (!inCart) {
      const result = await addToCart(product.id, 1);
      if (!result?.ok) return;
    }

    navigate("/cart");
  };


  // Wishlist
  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };


  return (

    <div className="pcard">

      {/* Wishlist */}
      <button
        className={`pcard-wish ${liked ? "active" : ""}`}
        onClick={handleWishlist}
        title={liked ? "Remove from wishlist" : "Add to wishlist"}
        aria-label="Toggle wishlist"
      >
        <i className={liked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
      </button>


      {/* Discount */}
      {Number(product.discount) > 0 && (
        <span className="pcard-badge">{product.discount}% off</span>
      )}


      {/* Product Image */}
      <Link to={`/productdetail/${product.id}`} className="pcard-imgwrap">
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>


      {/* Product Body */}
      <div className="pcard-body">

        {/* Product Name */}
        <Link to={`/productdetail/${product.id}`} className="pcard-title">
          {product.name}
        </Link>

        {/* Brand */}
        <p className="pcard-brand">
          {product.brand ? `by ${product.brand}` : product.category}
        </p>

        {/* Rating */}
        <div className="pcard-rating">
          <span className="pcard-rating-badge">
            {Number(product.rating).toFixed(1)}
            <i className="fa-solid fa-star"></i>
          </span>

          <span className="pcard-reviews">
            ({Number(product.reviews).toLocaleString("en-IN")})
          </span>
        </div>

        {/* Description */}
        <p className="pcard-description">{product.description}</p>

        {/* Price */}
        <div className="pcard-price">
          <span className="pcard-current">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          {Number(product.mrp) > Number(product.price) && (
            <span className="pcard-mrp">
              ₹{Number(product.mrp).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Buttons */}
        {outOfStock ? (
          <p className="pcard-out">Out of stock</p>
        ) : (
          <div className="pcard-actions">
            <button
              className="btn btn-warning btn-sm"
              onClick={handleAddToCart}
            >
              {inCart ? "Added ✓" : "Add to cart"}
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={handleBuyNow}
            >
              Buy now
            </button>
          </div>
        )}

      </div>

    </div>

  );
}
