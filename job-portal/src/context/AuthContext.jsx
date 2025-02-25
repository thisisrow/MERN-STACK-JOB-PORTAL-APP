import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null); // Error state


  // Load user & token from local storage on startup
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  // Fetch full user details
  const fetchUserData = async (userId, receivedToken) => {
    try {
      const { data } = await axios.get(`http://localhost:8081/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${receivedToken}` },
      });

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data.");
    }
  };

  // Refresh user data (Used after applying/saving jobs)
  const refreshUserData = async () => {
    if (!user?._id || !token) return;

    try {
      const { data } = await axios.get(`http://localhost:8081/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await axios.post("http://localhost:8081/api/auth/login", { email, password });

      if (data.token && data.userId) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        await fetchUserData(data.userId, data.token);
        return true; // Return success
      } else {
        setError("Invalid response from server.");
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Login failed. Please try again.");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, error, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
