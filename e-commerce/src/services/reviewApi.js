import api from "./axiosConfig";

export const getReviews = (productId) =>
  api.get(`/api/products/${productId}/reviews`);

export const saveReview = (productId, review) =>
  api.post(`/api/products/${productId}/reviews`, review);

export const deleteReview = (reviewId) => api.delete(`/api/reviews/${reviewId}`);
