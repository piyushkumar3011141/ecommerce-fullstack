import React from "react";
import "./Multiplecard.css";
import { CATEGORIES } from "../../../data/categories";
import { useProducts } from "../../../context/ProductContext";
import ProductCard from "../ProductCard/ProductCard";
import { Link } from "react-router-dom";

const CATEGORY_ROUTES = {
  Electronics: "/electronics",
  Fashion: "/fashion",
  Beauty: "/beauty",
  Books: "/books",
  "Home & Living": "/homeliving",
  "Sports & Fitness": "/sportsfitness",
  "Toys & Kids": "/toyskids",
};

export default function Multiplecard() {
  const { getProductsByCategory } = useProducts();

  return (
    <div className="container-fluid page-gutter">
      {CATEGORIES.map((cat) => {
        const items = getProductsByCategory(cat).slice(0, 4);
        if (items.length === 0) return null;

        return (
          <div key={cat} className="mc-row">
            <div className="section-head">
              <h4 className="fw-bold mb-0">{cat}</h4>
              <Link to={CATEGORY_ROUTES[cat] || "/allproduct"} className="mc-viewall">
                See all &rarr;
              </Link>
            </div>

            <div className="product-grid">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
