import React from "react";
import { useProducts } from "../../../context/ProductContext";

// Products load ho rahe hon ya error aaye to message dikhata hai.
// Sab theek ho to kuch render nahi karta (null).
export default function ProductsStatus() {
  const { loading, error, products, refreshProducts } = useProducts();

  if (loading) {
    return (
      <div className="text-center py-5 text-secondary">
        <div className="spinner-border spinner-border-sm me-2" role="status" />
        Loading products...
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-danger mb-2">{error}</p>
        <button className="btn btn-outline-danger btn-sm" onClick={refreshProducts}>
          Try again
        </button>
      </div>
    );
  }

  return null;
}
