import api from "./axiosConfig";

const API_URL = "/api/wishlist";

// Products ki list milti hai
export const getWishlist = () => api.get(API_URL);

export const addToWishlistApi = (productId) =>
  api.post(`${API_URL}/${productId}`);

export const removeFromWishlistApi = (productId) =>
  api.delete(`${API_URL}/${productId}`);
