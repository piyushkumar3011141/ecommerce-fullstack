import React from "react";
import "./Nav.css";
import { Link } from "react-router-dom";

import {
  FaThLarge,
  FaLaptop,
  FaTshirt,
  FaHome,
  FaSpa,
  FaTag,
  FaStar
} from "react-icons/fa";

export default function Nav() {
  return (
    <>
    <div className="nav">

      <div className="category-container">

        {/* ================= ALL ================= */}

        


        {/* ================= ELECTRONICS ================= */}

        <Link
          to="/electronics"
          className="category-box"
        >
          <FaLaptop className="category-icon" />
          <span>Electronics</span>
        </Link>


        {/* ================= FASHION ================= */}

        <Link
          to="/fashion"
          className="category-box"
          >
          <FaTshirt className="category-icon" />
          <span>Fashion</span>
        </Link>


        {/* ================= HOME & LIVING ================= */}

        <Link
          to="/homeliving"
          className="category-box"
        >
          <FaHome className="category-icon" />
          <span>Home & Living</span>
        </Link>


        {/* ================= BEAUTY ================= */}

        <Link
          to="/beauty"
          className="category-box"
        >
          <FaSpa className="category-icon" />
          <span>Beauty</span>
        </Link>


        {/* ================= DEALS ================= */}

        <Link
          to="/deals"
          className="category-box"
        >
          <FaTag className="category-icon" />
          <span>Deals</span>
        </Link>


        {/* ================= NEW ARRIVALS ================= */}

        <Link
          to="/newarrivals"
          className="category-box"
        >
          <FaStar className="category-icon" />
          <span>New Arrivals</span>
        </Link>

      </div>

      <hr />

    </div>
          </>
  );
}