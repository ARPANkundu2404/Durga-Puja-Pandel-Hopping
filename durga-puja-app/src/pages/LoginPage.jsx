import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/useAuth";
import PasswordInputWithStrength from "../components/PasswordInputWithStrength";

const LoginPage = () => {
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  // For handling password reset success message from UpdatePassword page
  const successMessage = location.state?.successMessage;
  const [showSuccess, setShowSuccess] = useState(!!successMessage);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null); // Clear errors on change
  };

  const handleSignup = async () => {
    // Basic client-side validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);

    const userAddRequest = {
      name: formData.name,
      email: formData.email,
      mobileno: formData.mobile, // Note: backend uses 'mobileno'
      password: formData.password,
    };
    try {
      const res = await api.post("/users", userAddRequest);
      if (res.ok && (res.status === 201 || res.status === 200)) {
        // registration successful
        navigate("/login", {
          state: { successMessage: "Registration successful. Please sign in." },
        });
        setIsSignup(false);
      } else if (res.status === 409) {
        setError(res.data?.message || "Email already registered.");
      } else {
        setError(res.data?.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    setLoading(true);
    setError(null);
    const loginRequest = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await api.post("/auth/login", loginRequest);
      if (res.ok && (res.status === 200 || res.status === 201)) {
        const token = res.data?.data?.token || res.data?.token;
        const email = formData.email;
        let name =
          res.data?.data?.name ||
          res.data?.data?.username ||
          res.data?.name ||
          "";
        if (token) {
          login(token, email, name);
        }
        navigate("/");
      } else if (res.status === 401) {
        setError(res.data?.message || "Invalid credentials.");
      } else {
        setError(res.data?.message || "Sign in failed.");
      }
    } catch {
      setError("Network error. Could not complete sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      handleSignup();
    } else {
      handleSignin();
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-[#FDF5E6] py-8 px-4">
      {/* ✅ Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 bg-[#4B2E2E] text-[#FFD700] text-sm px-4 py-2 rounded-md shadow-lg transition-opacity animate-fadeIn z-50">
          {successMessage}
        </div>
      )}

      <div className="relative w-full max-w-md bg-linear-to-r from-[#FFCF67]/80 to-[#D3321D]/80 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl shadow-[#8b7777] max-h-[90vh]">
        <button
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 p-2 rounded-full text-[#4B2E2E] hover:bg-white/20 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="overflow-y-auto max-h-[78vh] pr-4">
          <header className="text-4xl text-[#4B2E2E] font-bold mb-6 text-center">
            {isSignup ? "SIGN-UP" : "SIGN-IN"}
          </header>

          <form
            onSubmit={handleSubmit}
            className="p-4 border border-[#4B2E2E]/40 rounded-md space-y-4"
          >
            {/* ... Input Fields (Name, Email, Mobile, Password, ConfirmPassword) remain the same ... */}

            {/* --- Name Field (Sign-up only) --- */}
            {isSignup && (
              <div>
                <label className="block font-medium text-[#B22222] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#4B2E2E] bg-white/20 backdrop-blur-sm"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            {/* --- Email --- */}
            <div>
              <label className="block font-medium text-[#B22222] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#4B2E2E] bg-white/20 backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* --- Mobile --- */}
            {isSignup && (
              <div>
                <label className="block font-medium text-[#B22222] mb-2">
                  Mobile No.
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#4B2E2E] bg-white/20 backdrop-blur-sm"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
            )}

            {/* --- Password --- */}
            <div>
              <PasswordInputWithStrength
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setError(null);
                }}
                showStrength={isSignup}
              />
            </div>

            {/* --- Confirm Password --- */}
            {isSignup && (
              <div>
                <label className="block font-medium text-[#B22222] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#4B2E2E] bg-white/20 backdrop-blur-sm"
                  placeholder="Confirm your password"
                  required
                />
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-[#B22222] text-xs mt-1">
                      *Passwords do not match
                    </p>
                  )}
              </div>
            )}

            {/* --- Error Message --- */}
            {error && (
              <p className="text-sm text-[#B22222] font-medium text-center">
                {error}
              </p>
            )}

            {/* --- Forgot Password (Login only) --- */}
            {!isSignup && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/otp_request", {
                      state: { email: formData.email },
                    })
                  }
                  className="text-sm text-[#4B2E2E] underline hover:text-[#B22222] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* --- Submit Button --- */}
            <button
              type="submit"
              disabled={loading}
              className={`font-semibold py-2 px-4 rounded-full w-full transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#B22222] text-white hover:bg-[#7f1b1b]"
              }`}
            >
              {loading
                ? isSignup
                  ? "Signing Up..."
                  : "Signing In..."
                : isSignup
                ? "Sign Up"
                : "Sign In"}
            </button>
          </form>

          {/* --- Toggle Sign-in/Sign-up --- */}
          <p className="mt-4 text-center text-[#4B2E2E] font-mono text-xs">
            {isSignup ? "Have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-[#B22222] font-mono text-sm cursor-pointer hover:underline"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Sign-in" : "Sign-up"} →
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
