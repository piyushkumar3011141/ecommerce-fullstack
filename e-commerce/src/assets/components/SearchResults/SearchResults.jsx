import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../../../context/ProductContext";
import ProductCard from "../ProductCard/ProductCard";
import ProductsStatus from "../ProductsStatus/ProductsStatus";
import "../CategoryPage/CategoryPage.css";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const { products, loading } = useProducts();

  const results = useMemo(() => {
    if (!q) return [];

    const has = (value) => (value || "").toLowerCase().includes(q);

    return products.filter(
      (p) =>
        has(p.name) || has(p.brand) || has(p.category) || has(p.subCategory)
    );
  }, [q, products]);

  return (
    <div className="container-fluid">
      <div className="container py-4">
        <h2 className="fw-bold">
          Search results for "{q}" ({results.length})
        </h2>

        <ProductsStatus />

        {!loading && results.length === 0 ? (
          <p className="text-secondary mt-3">
            Koi product nahi mila. Kuch aur search karke dekho.
          </p>
        ) : (
          <div className="product-grid mt-3">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
