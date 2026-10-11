import React, { useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";

const SHOP_LINKS = [
  ["/allproduct", "All Products"],
  ["/fashion", "Fashion"],
  ["/electronics", "Electronics"],
  ["/beauty", "Beauty"],
  ["/homeliving", "Home & Living"],
  ["/deals", "Deals / Offers"],
  ["/featuredproducts", "Featured Products"],
  ["/books", "Books"],
  ["/sportsfitness", "Sports & Fitness"],
  ["/toyskids", "Toys & Kids"],
  ["/newarrivals", "New Arrivals"],
];

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentUser, isLoggedIn, isAdmin, logout } = useAuth();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="site-nav">
      <div className="site-nav__row">

        {/* ================= LOGO ================= */}
        <Link className="site-nav__brand logohover" to="/">
          E-Commerce
        </Link>

        {/* ================= DESKTOP LEFT MENU ================= */}
        <ul className="site-nav__menu d-none d-lg-flex">
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle hover border-0 bg-transparent"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Shop
            </button>
            <ul className="dropdown-menu">
              {SHOP_LINKS.slice(0, 10).map(([to, label]) => (
                <li key={to}>
                  <Link className="dropdown-item hover2" to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="nav-item" style={{margin:"0px 4px 0px 4px"}}>
            <Link className="nav-link" to="/allproduct">
              <span className="fontsize1 hover1">Products</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/newarrivals">
              <span className="fontsize1 hover1">New Arrivals</span>
            </Link>
          </li>
        </ul>

        {/* ================= SEARCH ================= */}
        <form className="site-nav__search" role="search" onSubmit={handleSearch}>
          <div className="search-box">
            <button type="submit" className="border-0 bg-transparent" aria-label="Search">
              <i className="fa-solid fa-magnifying-glass searchicon"></i>
            </button>
            <input
              className="form-control"
              type="search"
              placeholder="Search products, brands and categories"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>

        {/* ================= RIGHT SIDE (mobile par bhi dikhta hai) ================= */}
        <ul className="site-nav__actions">

          {/* Shop menu (sirf mobile / tablet) */}
          <li className="nav-item dropdown d-lg-none">
            <button
              className="site-nav__icon-btn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Shop menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              {SHOP_LINKS.map(([to, label]) => (
                <li key={to}>
                  <Link className="dropdown-item" to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Account */}
          {isLoggedIn ? (
            <li className="nav-item dropdown">
              <button
                className="site-nav__icon-btn site-nav__user"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Account menu"
              >
                <i className="fa-regular fa-user"></i>
                <span className="site-nav__user-name d-none d-md-inline">
                  Hi, {currentUser.name.split(" ")[0]}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {isAdmin && (
                  <li><Link className="dropdown-item fw-semibold" to="/admin">Admin panel</Link></li>
                )}
                <li><Link className="dropdown-item" to="/account">Account</Link></li>
                <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => { logout(); navigate("/"); }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="site-nav__icon-btn site-nav__user" to="/account" aria-label="Sign in">
                <i className="fa-regular fa-user"></i>
                <span className="site-nav__user-name d-none d-md-inline">Sign in</span>
              </Link>
            </li>
          )}

          {/* Wishlist */}
          <li className="nav-item">
            <Link className="site-nav__icon-btn position-relative" to="/wishlist" aria-label="Wishlist">
              <i className="fa-regular fa-heart"></i>
              {wishlistCount > 0 && <span className="navbadge">{wishlistCount}</span>}
            </Link>
          </li>

          {/* Cart */}
          <li className="nav-item">
            <Link className="site-nav__icon-btn position-relative" to="/cart" aria-label="Cart">
              <i className="fa-solid fa-cart-shopping"></i>
              {cartCount > 0 && <span className="navbadge">{cartCount}</span>}
            </Link>
          </li>

        </ul>
      </div>
    </nav>
  );
}
