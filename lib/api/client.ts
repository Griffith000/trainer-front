import axios, { type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryableConfig;

    if (
      error.response?.status === 401 &&
      !config._retry &&
      config.url !== "/api/auth/token/refresh/"
    ) {
      if (isRefreshing) {
        return new Promise<void>((resolve) => queue.push(resolve)).then(() =>
          api(config),
        );
      }

      config._retry = true;
      isRefreshing = true;

      try {
        await api.post("/api/auth/token/refresh/");
        for (const resolve of queue) resolve();
        return api(config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        queue = [];
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
