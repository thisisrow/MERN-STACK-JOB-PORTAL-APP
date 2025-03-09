import { createContext, useState, useEffect } from "react";
import axios from "../config/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch full user details
  const fetchUserData = async (userId) => {
    try {
      const { data } = await axios.get(`/api/users/${userId}`);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data.");
      logout();
    }
  };

  // Refresh user data (Used after applying/saving jobs)
  const refreshUserData = async () => {
    if (user?._id && token) {
      await fetchUserData(user._id);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await axios.post("/api/auth/login", { email, password });

      if (data.token && data.userId) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        await fetchUserData(data.userId);
        return { success: true };
      } else {
        setError("Invalid response from server.");
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          await fetchUserData(decoded.id);
        } catch (error) {
          console.error("Error initializing auth:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        error,
        refreshUserData,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
