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
  addToWishlistApi,
  getWishlist,
  removeFromWishlistApi,
} from "../services/wishlistApi";
import { getErrorMessage } from "../services/axiosConfig";

const WishlistContext = createContext(null);

// Guest wishlist localStorage me; login par backend wishlist me merge ho jati hai.
const GUEST_WISHLIST_KEY = "ecom_wishlist";

function loadGuestWishlist() {
  try {
    const list = JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth();
  const { getProductById } = useProducts();
  const { showToast } = useToast();

  const userId = currentUser?.id ?? null;
  const isLoggedIn = userId !== null;

  const [ids, setIds] = useState(() => (userId ? [] : loadGuestWishlist()));
  const syncedFor = useRef(null);
  const syncPromise = useRef(null);

  // Guest wishlist save
  useEffect(() => {
    // Logout ke turant baad purane user ki wishlist guest me save nahi honi chahiye
    if (!isLoggedIn && syncedFor.current === null) {
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(ids));
    }
  }, [ids, isLoggedIn]);

  // Login / logout par sync
  useEffect(() => {
    if (!userId) {
      const wasLoggedIn = syncedFor.current !== null;
      syncedFor.current = null;
      syncPromise.current = null;
      setIds(wasLoggedIn ? [] : loadGuestWishlist());
      return;
    }

    syncedFor.current = userId;

    let cancelled = false;

    if (syncPromise.current?.userId !== userId) {
      syncPromise.current = {
        userId,
        promise: (async () => {
          const guestIds = loadGuestWishlist();
          localStorage.removeItem(GUEST_WISHLIST_KEY);

          for (const id of guestIds) {
            try {
              await addToWishlistApi(id);
            } catch (err) {
              console.warn("Guest wishlist item skip:", id, err?.response?.data);
            }
          }

          const response = await getWishlist();
          return response.data.map((p) => p.id);
        })(),
      };
    }

    syncPromise.current.promise
      .then((list) => {
        if (!cancelled) setIds(list);
      })
      .catch((err) => {
        console.error("Wishlist Fetch Error:", err);
        if (!cancelled) {
          setIds([]);
          showToast(getErrorMessage(err, "Wishlist load nahi hui."));
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const isWishlisted = (productId) => ids.includes(productId);

  const removeFromWishlist = useCallback(
    async (productId) => {
      const previous = ids;
      setIds((prev) => prev.filter((id) => id !== productId));

      if (!isLoggedIn) return;

      try {
        await removeFromWishlistApi(productId);
      } catch (err) {
        console.error("Wishlist Remove Error:", err);
        setIds(previous);
        showToast(getErrorMessage(err, "Wishlist se remove nahi hua."));
      }
    },
    [ids, isLoggedIn, showToast]
  );

  const toggleWishlist = useCallback(
    async (productId) => {
      if (ids.includes(productId)) {
        return removeFromWishlist(productId);
      }

      const previous = ids;
      setIds((prev) => [...prev, productId]);

      if (!isLoggedIn) return;

      try {
        await addToWishlistApi(productId);
      } catch (err) {
        console.error("Wishlist Add Error:", err);
        setIds(previous);
        showToast(getErrorMessage(err, "Wishlist me add nahi hua."));
      }
    },
    [ids, isLoggedIn, removeFromWishlist, showToast]
  );

  const wishlistProducts = useMemo(
    () => ids.map((id) => getProductById(id)).filter(Boolean),
    [ids, getProductById]
  );

  return (
    <WishlistContext.Provider
      value={{
        ids,
        wishlistProducts,
        wishlistCount: wishlistProducts.length,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
