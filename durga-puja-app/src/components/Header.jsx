import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/useAuth";
import api from "../utils/api";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userEmail, userName, logout } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Avatar initial (from name or email)
  const initial =
    (userName && userName.trim().charAt(0).toUpperCase()) ||
    (userEmail && userEmail.trim().charAt(0).toUpperCase()) ||
    "U";

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // If there's no token locally, just clear state
      const token = api.getToken();
      if (!token) {
        logout();
        navigate("/login");
        return;
      }

      // Call backend logout endpoint with JWT token (no body)
      console.debug(
        "Logging out token:",
        token ? token.slice(0, 8) + "..." : null
      );
      const res = await api.post("/auth/logout", undefined, {
        headers: api.authHeaders ? api.authHeaders() : {},
      });

      // If backend forbids the request (e.g., token invalid/blacklisted), still clear local state
      if (res && res.status === 403) {
        console.warn(
          "Logout returned 403 - token may be invalid or already expired."
        );
      }

      // Clear auth state regardless of backend response
      logout();

      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear auth state on error
      logout();
      navigate("/login");
    } finally {
      setLogoutLoading(false);
      setDropdownOpen(false);
      setSidebarOpen(false);
    }
  };

  const navLinkClass =
    "py-2 px-3 font-medium text-[#FDF5E6] rounded-lg transition-colors duration-200 hover:bg-[#4B2E2E]";

  return (
    <nav className="bg-[#B22222] w-full px-2">
      <div className="relative flex items-center justify-between">
        <Link to="/details">
          <img
            className="h-8 w-auto rounded-t-full flex shrink-0"
            src="https://images.pexels.com/photos/14007628/pexels-photo-14007628.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="logo"
          />
        </Link>
        <h1 className="font-extrabold font-serif text-[#FFD700] text-xl">
          আলোয় ভরা শহর!
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:justify-center">
          <Link
            to="/"
            className={`hover:rounded-lg hover:bg-[#4B2E2E] hover:cursor-pointer py-2 px-3 font-medium text-[#FDF5E6] ${
              location.pathname === "/" ? "bg-[#4B2E2E]" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/pandals"
            className={`hover:rounded-lg hover:bg-[#4B2E2E] hover:cursor-pointer py-2 px-3 font-medium text-[#FDF5E6] ${
              location.pathname === "/pandals" ? "bg-[#4B2E2E]" : ""
            }`}
          >
            Pandel
          </Link>
          <Link
            to="/map"
            className={`hover:rounded-lg hover:bg-[#4B2E2E] hover:cursor-pointer py-2 px-3 font-medium text-[#FDF5E6] ${
              location.pathname === "/map" ? "bg-[#4B2E2E]" : ""
            }`}
          >
            Map
          </Link>

          {/* User Section - Desktop */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className={`${navLinkClass} hidden md:inline-block`}
              >
                Sign-in/Sign-up
              </Link>
            ) : (
              <div className="relative">
                <button
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((s) => !s)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {/* Avatar circle */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#B22222] font-semibold shadow-sm"
                    style={{ backgroundColor: "#FFD700" }}
                  >
                    {initial}
                  </div>

                  {/* small caret */}
                  <span className="hidden md:inline text-[#FDF5E6] select-none">
                    ▾
                  </span>
                </button>

                {/* Animated dropdown - stays in DOM for smooth transition */}
                <div
                  className={`absolute right-0 mt-3 w-56 rounded-lg z-50 transform transition-all duration-300 origin-top-right
                  ${
                    dropdownOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }
                `}
                  role="menu"
                  aria-hidden={!dropdownOpen}
                >
                  <div className="bg-[#B22222] border border-[#FFD700] rounded-lg shadow-lg overflow-hidden">
                    <div className="px-4 py-3 text-sm text-[#FFD700] border-b border-[#FFD700]">
                      {userEmail}
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className="w-full text-left px-4 py-2 text-[#FDF5E6] hover:bg-[#4B2E2E] flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut size={16} />
                      {logoutLoading ? "Signing Out..." : "Sign Out"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-[#FFD700] focus:outline-none"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar + Backdrop (always in DOM for smooth transition) */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen w-[85vw] max-w-xs z-50 transform transition-transform duration-300 shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ backgroundColor: "#FDF5E6" }}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#4B2E2E]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#B22222] font-semibold shadow-sm"
              style={{ backgroundColor: "#FFD700" }}
            >
              {initial}
            </div>
            <div className="text-[#4B2E2E] font-bold">
              {userName || userEmail}
            </div>
          </div>

          <button
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="text-[#4B2E2E]"
          >
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-4 py-4">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="py-2 px-3 text-[#4B2E2E] font-bold text-lg rounded-lg transition-colors duration-200 hover:bg-[#4B2E2E] hover:text-[#FFD700] flex justify-center"
          >
            Home
          </Link>
          <Link
            to="/pandals"
            onClick={() => setSidebarOpen(false)}
            className="py-2 px-3 text-[#4B2E2E] font-bold text-lg rounded-lg transition-colors duration-200 hover:bg-[#4B2E2E] hover:text-[#FFD700] flex justify-center"
          >
            Pandel
          </Link>
          <Link
            to="/map"
            onClick={() => setSidebarOpen(false)}
            className="py-2 px-3 text-[#4B2E2E] font-bold text-lg rounded-lg transition-colors duration-200 hover:bg-[#4B2E2E] hover:text-[#FFD700] flex justify-center"
          >
            Map
          </Link>

          {!isAuthenticated ? (
            <Link
              to="/login"
              onClick={() => setSidebarOpen(false)}
              className="mt-4 py-2 px-3 text-[#4B2E2E] font-bold text-lg rounded-lg transition-colors duration-200 hover:bg-[#4B2E2E] hover:text-[#FFD700] flex justify-center"
            >
              Sign-in/Sign-up
            </Link>
          ) : (
            <>
              <div className="w-full py-2 px-3 text-[#4B2E2E] font-bold text-sm border-t border-[#4B2E2E] mt-2">
                {userEmail}
              </div>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="w-full text-left px-3 py-2 text-[#B22222] hover:bg-[#4B2E2E] hover:text-[#FFD700] font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                <LogOut size={16} />
                {logoutLoading ? "Signing Out..." : "Sign Out"}
              </button>
            </>
          )}
        </nav>
      </aside>
    </nav>
  );
};

export default Header;
