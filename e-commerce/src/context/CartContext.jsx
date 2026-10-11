import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { useProducts } from "./ProductContext";
import { useToast } from "./ToastContext";
import {
  addCartItem,
  clearCartApi,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartApi";
import { getErrorMessage } from "../services/axiosConfig";

const CartContext = createContext(null);

// Guest (login ke bina) cart yahan localStorage me rehta hai.
// Login karte hi ye backend cart me merge ho jata hai.
const GUEST_CART_KEY = "ecom_cart";

function loadGuestCart() {
  try {
    const list = JSON.parse(localStorage.getItem(GUEST_CART_KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Backend ka Cart object -> frontend item
const fromServer = (cart) => ({
  cartId: cart.id,
  id: cart.product.id,
  qty: cart.quantity,
  product: cart.product,
});

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const { getProductById, refreshProducts } = useProducts();
  const { showToast } = useToast();

  const userId = currentUser?.id ?? null;
  const isLoggedIn = userId !== null;

  // item = { id: productId, qty, cartId?, product? }
  const [items, setItems] = useState(() => (userId ? [] : loadGuestCart()));
  const [cartLoading, setCartLoading] = useState(!!userId);
  const syncedFor = useRef(null);
  const syncPromise = useRef(null);

  // =========================
  // GUEST CART SAVE
  // =========================

  useEffect(() => {
    // Logout ke turant baad purane user ke items guest cart me save nahi hone chahiye
    if (!isLoggedIn && syncedFor.current === null) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    }
  }, [items, isLoggedIn]);

  // =========================
  // LOGIN / LOGOUT PAR SYNC
  // =========================

  useEffect(() => {
    // Logout -> khali cart
    if (!userId) {
      const wasLoggedIn = syncedFor.current !== null;
      syncedFor.current = null;
      syncPromise.current = null;
      setCartLoading(false);
      // Logout par cart khali; pehle se guest tha to uska local cart
      setItems(wasLoggedIn ? [] : loadGuestCart());
      return;
    }

    syncedFor.current = userId;

    let cancelled = false;
    setCartLoading(true);

    // Same user ke liye sync sirf ek baar (StrictMode me effect 2 baar chalta hai)
    if (syncPromise.current?.userId !== userId) {
      syncPromise.current = {
        userId,
        promise: (async () => {
          // 1) Guest cart ke items backend me daalo
          const guestItems = loadGuestCart();
          localStorage.removeItem(GUEST_CART_KEY);

          for (const g of guestItems) {
            try {
              await addCartItem(g.id, g.qty);
            } catch (err) {
              console.warn("Guest cart item skip:", g.id, err?.response?.data);
            }
          }

          // 2) Backend ka final cart lo
          const response = await getCart();
          return response.data.map(fromServer);
        })(),
      };
    }

    syncPromise.current.promise
      .then((list) => {
        if (!cancelled) setItems(list);
      })
      .catch((err) => {
        console.error("Cart Fetch Error:", err);
        if (!cancelled) {
          setItems([]);
          showToast(getErrorMessage(err, "Cart load nahi hua."));
        }
      })
      .finally(() => {
        if (!cancelled) setCartLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = useCallback(
    async (productId, qty = 1) => {
      // Guest
      if (!isLoggedIn) {
        const product = getProductById(productId);

        if (product && Number(product.stock) <= 0) {
          showToast("Ye product out of stock hai.");
          return { ok: false };
        }

        setItems((prev) => {
          const existing = prev.find((i) => i.id === productId);
          if (existing) {
            return prev.map((i) =>
              i.id === productId ? { ...i, qty: i.qty + qty } : i
            );
          }
          return [...prev, { id: productId, qty }];
        });
        return { ok: true };
      }

      // Logged in -> backend
      try {
        const response = await addCartItem(productId, qty);
        const saved = fromServer(response.data);

        setItems((prev) =>
          prev.some((i) => i.id === saved.id)
            ? prev.map((i) => (i.id === saved.id ? saved : i))
            : [...prev, saved]
        );
        return { ok: true };
      } catch (err) {
        console.error("Add To Cart Error:", err);
        showToast(getErrorMessage(err, "Cart me add nahi hua."));
        return { ok: false };
      }
    },
    [isLoggedIn, getProductById, showToast]
  );

  // =========================
  // REMOVE
  // =========================

  const removeFromCart = useCallback(
    async (productId) => {
      const item = items.find((i) => i.id === productId);
      if (!item) return;

      if (!isLoggedIn) {
        setItems((prev) => prev.filter((i) => i.id !== productId));
        return;
      }

      try {
        await removeCartItem(item.cartId);
        setItems((prev) => prev.filter((i) => i.id !== productId));
      } catch (err) {
        console.error("Remove Cart Error:", err);
        showToast(getErrorMessage(err, "Item remove nahi hua."));
      }
    },
    [items, isLoggedIn, showToast]
  );

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQty = useCallback(
    async (productId, qty) => {
      if (qty <= 0) {
        return removeFromCart(productId);
      }

      const item = items.find((i) => i.id === productId);
      if (!item) return;

      if (!isLoggedIn) {
        setItems((prev) =>
          prev.map((i) => (i.id === productId ? { ...i, qty } : i))
        );
        return;
      }

      try {
        const response = await updateCartItem(item.cartId, qty);
        const saved = fromServer(response.data);
        setItems((prev) => prev.map((i) => (i.id === productId ? saved : i)));
      } catch (err) {
        console.error("Update Qty Error:", err);
        showToast(getErrorMessage(err, "Quantity update nahi hui."));
      }
    },
    [items, isLoggedIn, removeFromCart, showToast]
  );

  // =========================
  // CLEAR
  // =========================

  const clearCart = useCallback(async () => {
    if (isLoggedIn) {
      try {
        await clearCartApi();
      } catch (err) {
        console.error("Clear Cart Error:", err);
      }
    }
    setItems([]);
  }, [isLoggedIn]);

  // =========================
  // DERIVED VALUES
  // (product details backend se aate hain; guest ke liye ProductContext se)
  // =========================

  const cartProducts = useMemo(
    () =>
      items
        .map((i) => {
          const product = getProductById(i.id) ?? i.product;
          return product ? { ...product, qty: i.qty, cartId: i.cartId } : null;
        })
        .filter(Boolean),
    [items, getProductById]
  );

  const cartCount = cartProducts.reduce((sum, p) => sum + p.qty, 0);
  const cartTotal = cartProducts.reduce((sum, p) => sum + p.price * p.qty, 0);
  const cartMrpTotal = cartProducts.reduce(
    (sum, p) => sum + (p.mrp || p.price) * p.qty,
    0
  );
  const isInCart = (productId) => items.some((i) => i.id === productId);

  return (
    <CartContext.Provider
      value={{
        items,
        cartProducts,
        cartCount,
        cartTotal,
        cartMrpTotal,
        cartLoading,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isInCart,
        refreshProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
