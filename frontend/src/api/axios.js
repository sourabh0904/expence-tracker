import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "/api", // Proxy will handle the domain
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
