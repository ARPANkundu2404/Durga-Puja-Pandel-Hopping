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
  const [role, setRole] = useState("");

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = api.getToken();
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName") ;
    const savedRole = localStorage.getItem("userRole") ;

    if (token && email) {
      setJwtToken(token);
      setUserEmail(email);
      setUserName(name || "");
      setRole(savedRole || "");
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
  
  const login = (token, email, name = "", role = "") => {
  api.setToken(token);
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userName", name);
  localStorage.setItem("userRole", role);
  setUserEmail(email);
  setUserName(name);
  setRole(role);
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
    setRole("");
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    userEmail,
    userName,
    jwtToken,
    loading,
    role,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
