import { createContext, useContext, useEffect, useState } from "react";

import {
  getOrdersByUser,
  createOrder,
  cancelOrderApi,
} from "../services/orderApi";

import {
  getAddressesByUser,
  addAddress as addAddressApi,
  updateAddress as updateAddressApi,
  deleteAddress as deleteAddressApi,
} from "../services/addressApi";

import { useAuth } from "./AuthContext";
import { useProducts } from "./ProductContext";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const { currentUser } = useAuth();
  const { refreshProducts } = useProducts();

  const userId = currentUser?.id;
  const userEmail = currentUser?.email;

  // ==========================================
  // USER BADALTE HI ORDERS + ADDRESSES LAO
  // (logout par dono khali)
  // ==========================================

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setAddresses([]);
      return;
    }

    let cancelled = false;

    getOrdersByUser(userEmail)
      .then((response) => {
        if (!cancelled) setOrders(response.data);
      })
      .catch((error) => console.error("Orders Fetch Error:", error));

    getAddressesByUser(userId)
      .then((response) => {
        if (!cancelled) setAddresses(response.data);
      })
      .catch((error) => console.error("Addresses Fetch Error:", error));

    return () => {
      cancelled = true;
    };
  }, [userId, userEmail]);

  // ==========================================
  // PLACE ORDER
  // (user backend JWT se pehchanta hai; price aur stock bhi backend check karta hai)
  // ==========================================

  const placeOrder = async ({ items, total, address, payment, paymentDetails }) => {
    const orderItems = items.map((item) => ({
      productId: item.id,
      productName: item.name,
      price: Number(item.price),
      quantity: Number(item.qty),
      image: item.image,
    }));

    const orderData = {
      orderNumber: "ORD" + Date.now(),
      total: Number(total),
      payment,
      paymentDetails,
      customerName: address?.name || "",
      customerCity: address?.city || "",
      items: orderItems,
    };

    const response = await createOrder(orderData);
    const newOrder = response.data;

    setOrders((prev) => [newOrder, ...prev]);

    // Order ke baad stock badal gaya, products dobara lao
    refreshProducts();

    return newOrder;
  };

  // ==========================================
  // CANCEL ORDER (stock wapas, prepaid ho to refund)
  // ==========================================

  const cancelOrder = async (id) => {
    const response = await cancelOrderApi(id);

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        String(order.id) === String(id) ? response.data : order
      )
    );

    // Stock wapas aaya, products refresh
    refreshProducts();
  };

  // ==========================================
  // ADDRESSES
  // ==========================================

  const addAddress = async (addr) => {
    if (!userId) {
      throw new Error("Please login first.");
    }

    const response = await addAddressApi(addr);
    setAddresses((prev) => [...prev, response.data]);
    return response.data;
  };

  const updateAddress = async (id, addr) => {
    const response = await updateAddressApi(id, addr);

    setAddresses((prev) =>
      prev.map((address) =>
        String(address.id) === String(id) ? response.data : address
      )
    );

    return response.data;
  };

  const removeAddress = async (id) => {
    await deleteAddressApi(id);

    setAddresses((prev) =>
      prev.filter((address) => String(address.id) !== String(id))
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        cancelOrder,
        addresses,
        addAddress,
        updateAddress,
        removeAddress,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
