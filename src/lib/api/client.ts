import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Instance axios dùng chung cho toàn app
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Interceptor: tự động đính kèm JWT vào mọi request
apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  // Ưu tiên đọc từ localStorage "user_data" (auth-context lưu tại đây)
  const raw = localStorage.getItem("user_data");
  if (raw) {
    try {
      const auth = JSON.parse(raw);
      if (auth.jwtToken) {
        config.headers.Authorization = `Bearer ${auth.jwtToken}`;
        return config;
      }
    } catch { /* ignore */ }
  }

  // Fallback: đọc từ cookie "token"
  const token = document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
