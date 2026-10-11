import { Link } from "react-router-dom";
import "./Card.css";

import { useProducts } from "../../../context/ProductContext";
import ProductCard from "../ProductCard/ProductCard";
import ProductsStatus from "../ProductsStatus/ProductsStatus";

export default function Card() {
  const { products } = useProducts();

  const suggested = products.slice(0, 8);

  return (
    <>
      <hr />

      <div className="container-fluid page-gutter">
        {/* Heading + See All */}
        <div className="section-head">
          <h1 className="section-title">Suggested items for you</h1>

          <Link to="/allproduct" className="section-link">
            See all →
          </Link>
        </div>

        <ProductsStatus />

        {/* Products */}
        <div className="product-grid">
          {suggested.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <hr />
      </div>
    </>
  );
}
