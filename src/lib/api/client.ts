import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Instance axios dùng chung cho toàn app
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export default apiClient;
