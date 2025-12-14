import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// ✅ ONLY ONE INTERCEPTOR – DO NOT TOUCH handlers
API.interceptors.request.use(
  (req) => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("token");

    // ADMIN ROUTES
    if (req.url.startsWith("/admin")) {
      if (adminToken) {
        req.headers.Authorization = `Bearer ${adminToken}`;
      }
      return req;
    }

    // PAYMENT ROUTES (admin-controlled)
    if (req.url.startsWith("/payment")) {
      if (adminToken) {
        req.headers.Authorization = `Bearer ${adminToken}`;
      }
      return req;
    }

    // USER ROUTES
    if (userToken) {
      req.headers.Authorization = `Bearer ${userToken}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
