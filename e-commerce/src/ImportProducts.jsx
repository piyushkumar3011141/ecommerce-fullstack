import React, { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "./data/products";
import { addProductsBulk } from "./services/productApi";
import { useAuth } from "./context/AuthContext";
import { useProducts } from "./context/ProductContext";
import { getErrorMessage } from "./services/axiosConfig";

// Ek baar chalane wala page: data/products.js ke saare products MySQL me daalta hai.
function ImportProducts() {
  const { isLoggedIn } = useAuth();
  const { products: existing, refreshProducts } = useProducts();

  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const importProducts = async () => {
    // Pehle se products hain to dobara import karne se duplicate ban jayenge
    if (
      existing.length > 0 &&
      !window.confirm(
        `Database me pehle se ${existing.length} products hain. Dobara import karoge to duplicate ban jayenge. Continue?`
      )
    ) {
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      // id hata rahe hain taaki MySQL naye IDs generate kare
      const productsWithoutId = products.map(({ id, ...product }) => product);

      const response = await addProductsBulk(productsWithoutId);

      setMessage(`${response.data.length} products successfully imported!`);
      await refreshProducts();
    } catch (error) {
      console.error("Import Error:", error);
      setMessage(getErrorMessage(error, "Products import nahi hue."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container py-5">
      <h2>Import Products</h2>

      <p>
        Total products (file me): <strong>{products.length}</strong>
        <br />
        Total products (database me): <strong>{existing.length}</strong>
      </p>

      {!isLoggedIn && (
        <div className="alert alert-warning">
          Import ke liye pehle <Link to="/account">login</Link> karo.
        </div>
      )}

      <button
        className="btn btn-danger"
        onClick={importProducts}
        disabled={!isLoggedIn || busy}
      >
        {busy ? "Importing..." : "Import All Products"}
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default ImportProducts;
