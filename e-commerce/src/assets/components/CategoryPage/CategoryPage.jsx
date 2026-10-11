import React, { useMemo, useState } from "react";
import { useProducts } from "../../../context/ProductContext";
import ProductCard from "../ProductCard/ProductCard";
import ProductsStatus from "../ProductsStatus/ProductsStatus";
import "./CategoryPage.css";

export default function CategoryPage({ title, filter }) {

  // Products backend se ek hi baar load hote hain (ProductContext)
  const { products: allProducts } = useProducts();

  const [sort, setSort] = useState("popularity");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [minRating, setMinRating] = useState(0);


  // Category filter
  const baseList = useMemo(() => {

    return typeof filter === "function"
      ? allProducts.filter(filter)
      : allProducts.filter(
          (product) => product.category === filter
        );

  }, [allProducts, filter]);


  // Price + Rating + Sorting
  const list = useMemo(() => {

    let arr = baseList.filter(
      (product) =>
        Number(product.price) <= maxPrice &&
        Number(product.rating) >= minRating
    );


    switch (sort) {

      // Price Low → High
      case "priceLow":

        arr = [...arr].sort(
          (a, b) =>
            Number(a.price) - Number(b.price)
        );

        break;


      // Price High → Low
      case "priceHigh":

        arr = [...arr].sort(
          (a, b) =>
            Number(b.price) - Number(a.price)
        );

        break;


      // Customer Rating
      case "rating":

        arr = [...arr].sort(
          (a, b) =>
            Number(b.rating) - Number(a.rating)
        );

        break;


      // Discount
      case "discount":

        arr = [...arr].sort(
          (a, b) =>
            Number(b.discount) - Number(a.discount)
        );

        break;


      // Popularity = reviews
      default:

        arr = [...arr].sort(
          (a, b) =>
            Number(b.reviews) - Number(a.reviews)
        );

        break;
    }

    return arr;

  }, [baseList, sort, maxPrice, minRating]);


  return (

    <div className="container-fluid catpage">

      <div className="container py-4">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">

          <div>

            <h2 className="fw-bold mb-0">
              {title}
            </h2>

            <p className="text-secondary mb-0">
              {list.length} products
            </p>

          </div>


          {/* Sort */}

          <select
            className="form-select w-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >

            <option value="popularity">
              Sort: Popularity
            </option>

            <option value="priceLow">
              Price: Low to High
            </option>

            <option value="priceHigh">
              Price: High to Low
            </option>

            <option value="rating">
              Customer Rating
            </option>

            <option value="discount">
              Discount
            </option>

          </select>

        </div>


        <div className="row g-4">

          {/* Filters */}

          <div className="col-lg-2 col-md-3">

            <div className="catpage-filters">

              <h6 className="fw-bold">
                Filters
              </h6>


              {/* Max Price */}

              <label className="small text-secondary mt-2">

                Max price:
                ₹{maxPrice.toLocaleString("en-IN")}

              </label>


              <input
                type="range"
                min="200"
                max="200000"
                step="100"
                className="form-range"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Number(e.target.value))
                }
              />


              {/* Rating */}

              <label className="small text-secondary mt-2">
                Min rating
              </label>


              <div className="d-flex gap-1 flex-wrap">

                {[0, 3, 3.5, 4, 4.5].map((r) => (

                  <button
                    key={r}
                    className={`btn btn-sm ${
                      minRating === r
                        ? "btn-dark"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setMinRating(r)}
                  >

                    {r === 0
                      ? "All"
                      : `${r}+`}

                  </button>

                ))}

              </div>

            </div>

          </div>


          {/* Product List */}

          <div className="col-lg-10 col-md-9">

            <ProductsStatus />

            {list.length === 0 ? (

              <p className="text-secondary">
                No products match these filters.
              </p>

            ) : (

              <div className="catpage-grid">

                {list.map((product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}