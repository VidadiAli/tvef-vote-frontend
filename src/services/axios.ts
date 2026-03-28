import axios from "axios";

export const api = axios.create({
  baseURL: "https://tvef-vote-backend.onrender.com/api",
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const isAuthEndpoint =
      originalReq.url.includes("/auth/admin/refresh") ||
      originalReq.url.includes("/admin/login") ||
      originalReq.url.includes("/admin/logout");

    if (status === 401 && !originalReq._retry && !isAuthEndpoint) {
      originalReq._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = api.post("/auth/admin/refresh");
        }

        await refreshPromise;

        isRefreshing = false;
        refreshPromise = null;

        return api(originalReq);
      } catch (refreshError) {
        isRefreshing = false;
        refreshPromise = null;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);