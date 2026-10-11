import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { getProductById } from "../../../services/productApi";
import { useProducts } from "../../../context/ProductContext";

import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

import ProductCard from "../ProductCard/ProductCard";
import Reviews from "../Reviews/Reviews";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, isInCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { products: allProducts, refreshProducts } = useProducts();

  const [qty, setQty] = useState(1);

  // Get product from backend
  useEffect(() => {
    setLoading(true);

    getProductById(id)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Product Detail API Error:", error);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  // Related products (ProductContext me pehle se loaded hain)
  useEffect(() => {
    if (!product) return;

    setRelated(
      allProducts
        .filter(
          (p) =>
            p.category === product.category &&
            Number(p.id) !== Number(product.id)
        )
        .slice(0, 4)
    );
  }, [product, allProducts]);

  // Review add/delete ke baad product ki rating dobara lao
  const reloadProduct = () => {
    getProductById(id)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Product reload error:", error));
    refreshProducts();
  };

  // Loading
  if (loading) {
    return (
      <div
        className="container text-center py-5"
      >
        <h3>Loading product...</h3>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div
        className="container text-center py-5"
      >
        <h3>Product not found.</h3>

        <Link
          to="/allproduct"
          className="btn btn-danger mt-3"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const liked = isWishlisted(product.id);
  const inCart = isInCart(product.id);

  return (
    <div className="container-fluid">
      <div className="container py-4">

        {/* PRODUCT DETAILS */}
        <div className="row g-5">

          {/* PRODUCT IMAGE */}
          <div className="col-md-5 text-center">

            <img
              src={product.image}
              alt={product.name}
              className="pd-image"
            />

          </div>

          {/* PRODUCT INFORMATION */}
          <div className="col-md-7">

            {/* BRAND */}
            <p className="text-secondary mb-1">
              {product.brand}
            </p>

            {/* NAME */}
            <h2 className="fw-bold">
              {product.name}
            </h2>

            {/* RATING */}
            <div className="d-flex align-items-center gap-2 my-2">

              <span className="pd-rating">
                {Number(product.rating).toFixed(1)}

                <i className="fa-solid fa-star"></i>
              </span>

              <span className="text-secondary">
                {Number(product.reviews).toLocaleString("en-IN")} ratings
              </span>

            </div>

            <hr />

            {/* PRICE */}
            <div className="d-flex align-items-baseline gap-3">

              <span className="pd-price">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>

              {Number(product.mrp) > Number(product.price) && (
                <span className="text-secondary text-decoration-line-through">
                  ₹{Number(product.mrp).toLocaleString("en-IN")}
                </span>
              )}

              {Number(product.discount) > 0 && (
                <span className="text-success fw-bold">
                  {product.discount}% off
                </span>
              )}

            </div>

            <p className="text-secondary small mt-1">
              Inclusive of all taxes
            </p>

            {/* DESCRIPTION */}
            <p className="mt-3">
              {product.description}
            </p>

            {/* CATEGORY */}
            <p className="mb-1">
              <strong>Category:</strong>{" "}
              {product.category}

              {product.subCategory && (
                <> / {product.subCategory}</>
              )}
            </p>

            {/* STOCK */}
            <p
              className={
                Number(product.stock) > 0
                  ? "text-success"
                  : "text-danger"
              }
            >
              {Number(product.stock) > 0
                ? `In stock (${product.stock} left)`
                : "Out of stock"}
            </p>

            {/* QUANTITY */}
            <div className="d-flex align-items-center gap-3 my-3">

              <span>Qty:</span>

              <div className="pd-qty">

                <button
                  onClick={() =>
                    setQty((q) => Math.max(1, q - 1))
                  }
                >
                  -
                </button>

                <span>{qty}</span>

                <button
                  onClick={() =>
                    setQty((q) =>
                      Math.min(
                        Number(product.stock),
                        q + 1
                      )
                    )
                  }
                  disabled={qty >= Number(product.stock)}
                >
                  +
                </button>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="d-flex flex-wrap gap-2 gap-md-3">

              {/* ADD TO CART */}
              <button
                className="btn btn-warning px-4"
                onClick={() =>
                  addToCart(product.id, qty)
                }
                disabled={Number(product.stock) === 0}
              >
                {inCart
                  ? "Added to cart ✓"
                  : "Add to cart"}
              </button>

              {/* BUY NOW */}
              <button
                className="btn btn-danger px-4"
                disabled={Number(product.stock) === 0}
                onClick={() => {
                  addToCart(product.id, qty);
                  navigate("/cart");
                }}
              >
                Buy now
              </button>

              {/* WISHLIST */}
              <button
                className={`btn ${
                  liked
                    ? "btn-outline-danger"
                    : "btn-outline-secondary"
                }`}
                onClick={() =>
                  toggleWishlist(product.id)
                }
              >
                <i
                  className={
                    liked
                      ? "fa-solid fa-heart"
                      : "fa-regular fa-heart"
                  }
                ></i>{" "}

                {liked
                  ? "Wishlisted"
                  : "Wishlist"}
              </button>

            </div>

          </div>

        </div>

        {/* CUSTOMER REVIEWS */}
        <Reviews productId={product.id} onChanged={reloadProduct} />

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mt-5">

            <h4 className="fw-bold mb-3">
              Related products
            </h4>

            <div className="pd-related">

              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}