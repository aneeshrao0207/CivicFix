const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("civicfix_token");

  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(options.headers || {}),
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};