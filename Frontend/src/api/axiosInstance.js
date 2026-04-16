import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response && error.response.status === 401) {
      console.error("Authentication error:", error.response.data?.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    
    // Handle 403 Forbidden - Account blocked or insufficient permissions
    if (error.response && error.response.status === 403) {
      const message = error.response.data?.message || "Access denied";
      console.error("Access denied:", message);
      
      // Only alert for blocked accounts
      if (message.includes("blocked")) {
        alert("Your account has been blocked. Please contact the admin team.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      // For pending verification, don't alert (login page handles it)
      // For other 403 errors, just log them
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
