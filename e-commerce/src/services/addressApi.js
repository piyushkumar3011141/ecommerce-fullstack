import api from "./axiosConfig";

const API_URL = "/api/addresses";

// Get addresses of logged-in user
export const getAddressesByUser = (userId) => {
  return api.get(
    `${API_URL}/user/${userId}`
  );
};

// Add address
export const addAddress = (address) => {
  return api.post(
    API_URL,
    address
  );
};

// Update address
export const updateAddress = (
  id,
  address
) => {
  return api.put(
    `${API_URL}/${id}`,
    address
  );
};

// Delete address
export const deleteAddress = (id) => {
  return api.delete(
    `${API_URL}/${id}`
  );
};