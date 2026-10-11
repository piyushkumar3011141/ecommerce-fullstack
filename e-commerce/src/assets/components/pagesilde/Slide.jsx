import React from "react";
import "./Slide.css";
import { Link } from "react-router-dom";
import { useProducts } from "../../../context/ProductContext";

export default function Slide() {

  // Backend products me se 3 products slider me dikhate hain
  const { products } = useProducts();

  const slideProduct1 = products[0];
  const slideProduct2 = products[1];
  const slideProduct3 = products[2];

  return (
    <div className="slide-section">

      <div
        id="carouselExampleDark"
        className="carousel slide"
        data-bs-ride="carousel"
      >

        {/* ================= INDICATORS ================= */}

        <div className="carousel-indicators">

          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>

          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>

          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>

        </div>


        {/* ================= SLIDES ================= */}

        <div className="carousel-inner">


          {/* ================= SLIDE 1 ================= */}

          <div
            className="carousel-item active"
            data-bs-interval="3000"
          >

            {slideProduct1 && (
              <Link
                to={`/productdetail/${slideProduct1.id}`}
                className="slide-link"
              >

                <img
                  src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                   className="slide-image"
                  alt="Featured Product"
                />

                <div className="slide-overlay"></div>

                <div className="slide-content">

                  <span className="slide-small-text">
                    FEATURED PRODUCT
                  </span>

                  <h1>
                    Upgrade Your
                    <br />
                    Shopping
                  </h1>

                  <p>
                    Discover our featured products
                    specially selected for you.
                  </p>

                  <span className="shop-button">
                    Shop Now
                  </span>

                </div>

              </Link>
            )}

          </div>


          {/* ================= SLIDE 2 ================= */}

          <div
            className="carousel-item"
            data-bs-interval="3000"
          >

            {slideProduct2 && (
              <Link
                to={`/productdetail/${slideProduct2.id}`}
                className="slide-link"
              >

                <img
                  src="https://images.unsplash.com/photo-1598282674886-81688e202188?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  className="slide-image"
                  alt="Fashion Products"
                />

                <div className="slide-overlay"></div>

                <div className="slide-content">

                  <span className="slide-small-text">
                    SPECIAL OFFER
                  </span>

                  <h1>
                    Explore Our
                    <br />
                    Products
                  </h1>

                  <p>
                    Find something special from
                    our latest collection.
                  </p>

                  <span className="shop-button">
                    Explore Now
                  </span>

                </div>

              </Link>
            )}

          </div>


          {/* ================= SLIDE 3 ================= */}

          <div
            className="carousel-item"
            data-bs-interval="3000"
          >

            {slideProduct3 && (
              <Link
                to={`/productdetail/${slideProduct3.id}`}
                className="slide-link"
              >

                <img
                  src="https://images.unsplash.com/photo-1723951174326-2a97221d3b7f?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  className="slide-image"
                  alt="New Products"
                />

                <div className="slide-overlay"></div>

                <div className="slide-content">

                  <span className="slide-small-text">
                    NEW ARRIVALS
                  </span>

                  <h1>
                    Discover
                    <br />
                    New Products
                  </h1>

                  <p>
                    Check out our latest products
                    and discover your next favorite.
                  </p>

                  <span className="shop-button">
                    Discover More
                  </span>

                </div>

              </Link>
            )}

          </div>

        </div>


        {/* ================= PREVIOUS BUTTON ================= */}

        <button
          className="carousel-control-prev slide-arrow"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="prev"
        >

          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>

          <span className="visually-hidden">
            Previous
          </span>

        </button>


        {/* ================= NEXT BUTTON ================= */}

        <button
          className="carousel-control-next slide-arrow"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="next"
        >

          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>

          <span className="visually-hidden">
            Next
          </span>

        </button>

      </div>

    </div>
  );
}