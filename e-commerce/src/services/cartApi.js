import api from "./axiosConfig";

const API_URL = "/api/cart";

export const getCart = () => api.get(API_URL);

export const addCartItem = (productId, quantity = 1) =>
  api.post(API_URL, null, { params: { productId, quantity } });

export const updateCartItem = (cartId, quantity) =>
  api.put(`${API_URL}/${cartId}`, null, { params: { quantity } });

export const removeCartItem = (cartId) => api.delete(`${API_URL}/${cartId}`);

export const clearCartApi = () => api.delete(API_URL);
