import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordEmailRequest = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successText, setSuccessText] = useState(null);

  const validateEmailFormat = (value) => {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessText(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!validateEmailFormat(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Simulate backend check with 1.5s delay
    setTimeout(() => {
      setLoading(false);

      if (email.trim().toLowerCase() === "unregistered@test.com") {
        setError("User not found. Please sign up first.");
        return;
      }

      // Success: store email via navigation state and navigate to update password page
      setSuccessText("Verification code (OTP) sent to your email.");
      // small delay so user sees the success message
      setTimeout(() => {
        navigate("/update_password", { state: { email } });
      }, 700);
    }, 1500);
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-[#FDF5E6] p-6">
      <div className="relative w-full max-w-md bg-linear-to-r from-[#FFCF67]/70 to-[#D3321D]/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-[#8b7777] p-6 max-h-[90vh]">
        <button
          aria-label="Back to login"
          onClick={() => navigate("/login")}
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
          <h2 className="text-2xl font-bold text-[#4B2E2E] text-center">
            Forgot Password
          </h2>
          <p className="text-sm text-[#4B2E2E] mt-4 mb-6">
            Enter the email associated with your account. We'll send an OTP to
            reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-[#B22222] font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-md border border-[#4B2E2E] focus:outline-none focus:ring-2 focus:ring-[#4B2E2E] bg-white/20 backdrop-blur-sm"
              aria-label="email"
            />

            {error && <div className="text-sm text-red-700">{error}</div>}
            {successText && (
              <div className="text-sm text-green-700">{successText}</div>
            )}

            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2 rounded-full text-white font-semibold transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#B22222] hover:bg-[#7f1b1b]"
                }`}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </form>
        </div>
        <div className="mt-6 text-xs text-[#4B2E2E]/80">
          Tip: Use <span className="font-mono">registered@test.com</span> to
          test a successful flow.
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordEmailRequest;
