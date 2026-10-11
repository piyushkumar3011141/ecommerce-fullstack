import React from "react";
import CategoryPage from "../components/CategoryPage/CategoryPage";

export default function Product() {
  return <CategoryPage title="All Products" filter={() => true} />;
}
