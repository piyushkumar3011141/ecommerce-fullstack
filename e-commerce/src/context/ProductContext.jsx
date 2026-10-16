import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProducts } from "../services/productApi";
import { getErrorMessage } from "../services/axiosConfig";

const ProductContext = createContext(null);

// Saare products backend (MySQL) se ek hi baar aate hain,
// phir poori website (home, search, cart, wishlist...) yahin se use karti hai.
export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshProducts = useCallback(async () => {
    try {
      const response = await getProducts();
      setProducts(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      console.error("Products Fetch Error:", err);
      setError(getErrorMessage(err, "Products can not  loading."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const value = useMemo(() => {
    const byId = new Map(products.map((p) => [Number(p.id), p]));

    return {
      products,
      loading,
      error,
      refreshProducts,
      getProductById: (id) => byId.get(Number(id)),
      getProductsByCategory: (category) =>
        products.filter((p) => p.category === category),
    };
  }, [products, loading, error, refreshProducts]);

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
