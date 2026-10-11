import React from "react";
import "./Secondpage.css";

const ProductDetails = () => {
  return (
    <div className="product-page">

      {/* ================= TOP CATEGORY BAR ================= */}

      <div className="category-bar">
        <div className="container-fluid">

          <div className="d-flex gap-4 flex-wrap">

            <span>Grocery & Gourmet Foods</span>
            <span>Bestsellers</span>
            <span>Snack Foods</span>
            <span>Tea, Coffee & Beverages</span>
            <span>Spices & Masalas</span>
            <span>Dried Fruits & Nuts</span>
            <span>Cereal & Muesli</span>

          </div>

        </div>
      </div>


      {/* ================= PRODUCT PAGE ================= */}

      <div className="container product-container">

        {/* Breadcrumb */}

        <div className="breadcrumb-area">

          Grocery & Gourmet Foods &nbsp;›&nbsp;
          Snacks & Sweets &nbsp;›&nbsp;
          Chocolate Candy &nbsp;›&nbsp;
          Bars

        </div>


        <div className="row g-4">


          {/* =================================================
              LEFT IMAGE SECTION
          ================================================= */}

          <div className="col-lg-6">

            <div className="row">


              {/* THUMBNAILS */}

              <div className="col-2">

                <div className="thumbnail-list">

                  <div className="thumbnail active-thumb">

                    <img
                      src="https://media.istockphoto.com/id/463813283/photo/dark-chocolate-bar-on-rustic-wood-table.jpg?s=1024x1024&w=is&k=20&c=FVZanTMxT6SvB9MLdP3oF4zixywjTb_bDUNfxNiqXEQ="
                      alt="product"
                    />

                  </div>


                  <div className="thumbnail">

                    <img
                      src="https://media.istockphoto.com/id/463813283/photo/dark-chocolate-bar-on-rustic-wood-table.jpg?s=1024x1024&w=is&k=20&c=FVZanTMxT6SvB9MLdP3oF4zixywjTb_bDUNfxNiqXEQ="
                      alt="product"
                    />

                  </div>


                  <div className="thumbnail">

                    <img
                      src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=200&q=80"
                      alt="product"
                    />

                  </div>


                  <div className="thumbnail">

                    <img
                      src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80"
                      alt="product"
                    />

                  </div>


                  <div className="thumbnail">

                    <img
                      src="https://images.unsplash.com/photo-1582176604856-e824b4736522?auto=format&fit=crop&w=200&q=80"
                      alt="product"
                    />

                  </div>


                  <div className="more-thumb">
                    2+
                  </div>

                </div>

              </div>


              {/* MAIN IMAGE */}

              <div className="col-10">

                <div className="main-image-container">

                  <img
                    src="https://media.istockphoto.com/id/490313673/photo/dark-chocolate.jpg?s=1024x1024&w=is&k=20&c=PDVilGec01jU_e-GpZ0lUq-8SsCHWIbHzGdrPhSnYBU="
                    className="main-product-image"
                  />

                </div>


                <p className="text-center see-full">
                  Click to see full view
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              MIDDLE PRODUCT INFORMATION
          ================================================= */}

          <div className="col-lg-4">

            <div className="product-info">


              {/* TITLE */}

              <h1 className="product-title">

                Loyka Dubai Kunafa Chocolate Bar 40g |
                Premium Pistachio Kunafa Chocolate Bar |
                Inspired by Dubai Kunafa Dessert |
                Rich Creamy Centre with Crispy Vermicelli &
                Pistachio Chunks | Perfect Gifting Treat

              </h1>


              <p className="visit-store">
                Visit the LOYKA Store
              </p>


              {/* RATING */}

              <div className="rating-section">

                <span className="rating-number">
                  3.3
                </span>

                <span className="stars">
                  ★★★☆☆
                </span>

                <span className="review-link">
                  (172)
                </span>

              </div>


              <p className="bought">
                1K+ bought in past month
              </p>


              <hr />


              {/* PRICE */}

              <div className="price-section">

                <span className="discount-red">
                  -26%
                </span>

                <span className="price">
                  ₹125
                </span>

                <span className="per-price">
                  ₹312.50 / 100 g
                </span>

              </div>


              <div className="mrp">

                M.R.P.:
                <del> ₹169</del>

              </div>


              <p className="tax-text">
                Inclusive of all taxes
              </p>


              {/* OFFERS */}

              <div className="offers-title">
                🏷️ Offers
              </div>


              <div className="row g-2">


                <div className="col-md-4">

                  <div className="offer-card">

                    <strong>
                      Cashback
                    </strong>

                    <p>
                      Upto ₹3.00 cashback as Amazon Pay Balance when you...
                    </p>

                    <a href="#">
                      1 offer ›
                    </a>

                  </div>

                </div>


                <div className="col-md-4">

                  <div className="offer-card">

                    <strong>
                      Bank Offer
                    </strong>

                    <p>
                      Upto ₹18.75 discount on select Credit Cards
                    </p>

                    <a href="#">
                      6 offers ›
                    </a>

                  </div>

                </div>


                <div className="col-md-4">

                  <div className="offer-card">

                    <strong>
                      Partner Offers
                    </strong>

                    <p>
                      Get GST invoice and save upto 18% on business purchases.
                    </p>

                    <a href="#">
                      1 offer ›
                    </a>

                  </div>

                </div>

              </div>


              {/* FEATURES */}

              <div className="feature-row">

                <div className="feature">
                  🚚
                  <small>Free Delivery</small>
                </div>

                <div className="feature">
                  ↩️
                  <small>Non-Returnable</small>
                </div>

                <div className="feature">
                  📦
                  <small>Amazon Delivered</small>
                </div>

                <div className="feature">
                  💳
                  <small>Pay on Delivery</small>
                </div>

                <div className="feature">
                  🔒
                  <small>Secure Transaction</small>
                </div>

              </div>


              <hr />


              {/* PACK SIZE */}

              <div className="pack-title">
                Size: <strong>Pack of 1</strong>
              </div>


              <div className="pack-options">

                <button className="pack active-pack">

                  Pack of 1

                  <br />

                  <strong>₹125.00</strong>

                  <br />

                  <small>
                    ₹312.50 /100g
                  </small>

                </button>


                <button className="pack">

                  Pack of 3

                  <br />

                  <strong>₹375.00</strong>

                  <br />

                  <small>
                    ₹312.50 /100g
                  </small>

                </button>

              </div>


              {/* DETAILS ACCORDION STYLE */}

              <div className="details-box">

                <div className="detail-row">
                  <strong>Top highlights</strong>
                  <span>⌄</span>
                </div>

                <div className="detail-row">
                  <strong>Item details</strong>
                  <span>⌄</span>
                </div>

                <div className="detail-row">
                  <strong>Measurements</strong>
                  <span>⌄</span>
                </div>

              </div>


              <button className="specification-btn">
                See all product specifications
              </button>

            </div>

          </div>


          {/* =================================================
              RIGHT BUY BOX
          ================================================= */}

          <div className="col-lg-2">

            <div className="buy-box">

              {/* PRICE */}

              <div className="buy-price">
                ₹125
                <sup>00</sup>
              </div>


              <p className="per-price">
                ₹312.50 / 100 g
              </p>


              <span className="fulfilled">
                ▣ Fulfilled
              </span>


              {/* DELIVERY */}

              <p className="delivery">

                <strong>
                  FREE delivery Tuesday, 1 September
                </strong>

                on your first order.

                <a href="#">
                  Details
                </a>

              </p>


              <p className="fast-delivery">

                Or fastest delivery
                <strong> Tomorrow, 31 August.</strong>

              </p>


              <p className="location">
                📍 Delivering to Ghaziabad 201102
              </p>


              <p className="stock">
                In stock
              </p>


              {/* QUANTITY */}

              <select className="form-select quantity">

                <option>
                  Quantity: 1
                </option>

                <option>
                  Quantity: 2
                </option>

                <option>
                  Quantity: 3
                </option>

                <option>
                  Quantity: 4
                </option>

              </select>


              {/* BUTTONS */}

              <button className="btn btn-warning w-100 buy-btn">
                Add to cart
              </button>


              <button className="btn btn-warning w-100 buy-now">
                Buy Now
              </button>


              {/* SELLER DETAILS */}

              <div className="seller-info">

                <p>
                  Ships from
                  <span>Amazon</span>
                </p>

                <p>
                  Sold by
                  <span>Amazon Retail</span>
                </p>

                <p>
                  Payment
                  <span>Secure transaction</span>
                </p>

                <p>
                  Gift options
                  <span>Available at checkout</span>
                </p>

              </div>


              {/* WISHLIST */}

              <button className="btn btn-outline-secondary w-100 wishlist-btn">
                Add to Wish List
              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            BELOW PRODUCT SECTION
        ================================================= */}

        <div className="row mt-4">

          <div className="col-lg-10 offset-lg-2">

            <div className="product-description">

              <h3>
                About this item
              </h3>


              <ul>

                <li>
                  Premium Dubai Kunafa inspired chocolate bar.
                </li>

                <li>
                  Rich creamy centre with crispy vermicelli.
                </li>

                <li>
                  Contains delicious pistachio chunks.
                </li>

                <li>
                  Perfect snack and gifting option.
                </li>

                <li>
                  Carefully packed to maintain freshness.
                </li>

              </ul>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;