import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

// Create the Auth Context (named export so other modules can import it)
const AuthContext = createContext(null);

/**
 * AuthProvider component to wrap the app.
 * Manages global authentication state and persists to localStorage.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(true); // Track if context is initializing

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = api.getToken();
    const email = localStorage.getItem("userEmail") || "";
    const name = localStorage.getItem("userName") || "";

    if (token && email) {
      setJwtToken(token);
      setUserEmail(email);
      setUserName(name);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  /**
   * Login function: stores user data and JWT
   * @param {string} token - JWT token from backend
   * @param {string} email - User email
   * @param {string} name - User name (optional)
   */
  const login = (token, email, name = "") => {
    api.setToken(token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name || "");
    setJwtToken(token);
    setUserEmail(email);
    setUserName(name || "");
    setIsAuthenticated(true);
  };

  /**
   * Logout function: clears user data and JWT
   */
  const logout = () => {
    api.removeToken();
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setJwtToken("");
    setUserEmail("");
    setUserName("");
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    userEmail,
    userName,
    jwtToken,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
