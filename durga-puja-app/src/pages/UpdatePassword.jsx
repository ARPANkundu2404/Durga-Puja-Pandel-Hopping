import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordInputWithStrength from "../components/PasswordInputWithStrength";
import api from "../utils/api";

const OTP_LENGTH = 6;

const UpdatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Assume prefilledEmail is set after successful email request on /otp_request page
  const prefilledEmail = location?.state?.email || "test@example.com"; // Use a fallback email for testing

  // Steps: 'verify_otp' | 'set_password'
  const [step, setStep] = useState("verify_otp");

  // OTP state
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [otpSuccess, setOtpSuccess] = useState(null);

  // Password step states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // autofocus first input on mount
  useEffect(() => {
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  }, []);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const next = [...otp];
    next[index] = value.slice(-1); // only last digit
    setOtp(next);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
      const prev = [...otp];
      prev[index - 1] = "";
      setOtp(prev);
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const collectOtpString = () => otp.join("");

  const verifyOtp = async (e) => {
    e?.preventDefault();
    setOtpError(null);
    setOtpSuccess(null);

    const otpStr = collectOtpString();
    if (otpStr.length !== OTP_LENGTH) {
      setOtpError("Please enter the full OTP.");
      return;
    }

    setOtpLoading(true);

    try {
      setOtpSuccess("OTP accepted. Enter your new password.");
      setTimeout(() => setStep("set_password"), 600);
    } catch {
      setOtpError("Network error during OTP validation.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (newPassword !== confirmPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }
    const isStrongPassword = (pw) => {
      if (!pw || pw.length < 8) return false;
      if (!/[A-Z]/.test(pw)) return false;
      if (!/[a-z]/.test(pw)) return false;
      if (!/[0-9]/.test(pw)) return false;
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return false;
      return true;
    };

    if (!isStrongPassword(newPassword)) {
      setSubmitError("Password does not meet strength requirements.");
      return;
    }

    const updateRequest = {
      email: prefilledEmail,
      password: newPassword,
      otp: collectOtpString(),
    };

    setSubmitLoading(true);

    try {
      const res = await api.put("/users", updateRequest);
      if (res.ok && (res.status === 200 || res.status === 201)) {
        navigate("/login", {
          state: {
            successMessage: "Password updated successfully. Please log in.",
          },
        });
      } else {
        const msg = res.data?.message || "Failed to update password.";
        if (
          msg.toLowerCase().includes("invalid") ||
          msg.toLowerCase().includes("expired")
        ) {
          setSubmitError("Invalid or expired OTP. Please request a new one.");
          setStep("verify_otp");
        } else if (msg.toLowerCase().includes("not found")) {
          // user not found - send back to login
          navigate("/login", {
            state: {
              successMessage: "User not found. Please sign up or try again.",
            },
          });
        } else {
          setSubmitError(msg);
        }
      }
    } catch {
      setSubmitError("Network error during password update.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const isStrongPassword = (pw) => {
    if (!pw || pw.length < 8) return false;
    if (!/[A-Z]/.test(pw)) return false;
    if (!/[a-z]/.test(pw)) return false;
    if (!/[0-9]/.test(pw)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return false;
    return true;
  };

  const canSubmit =
    newPassword &&
    newPassword === confirmPassword &&
    isStrongPassword(newPassword) &&
    collectOtpString().length === OTP_LENGTH;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF5E6] p-6">
      <div className="w-full max-w-md bg-linear-to-r from-[#FFCF67]/80 to-[#D3321D]/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6">
        {/* Adjusted max-w-2xl to max-w-md */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#4B2E2E]">Reset Password</h1>
          <p className="text-sm text-[#4B2E2E]">
            {step === "verify_otp"
              ? `Enter the OTP sent to ${prefilledEmail}.`
              : "Set your new password."}
          </p>
        </div>
        {step === "verify_otp" && (
          <form onSubmit={verifyOtp} className="space-y-4">
            {/* ... OTP input fields remain the same ... */}
            <div>
              <label className="block text-sm font-medium text-[#B22222] mb-2">
                One-Time Password (OTP)
              </label>
              <div className="flex gap-2">
                {Array.from({ length: OTP_LENGTH }).map((_, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    value={otp[idx]}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    maxLength={1}
                    className="w-12 h-12 text-center rounded-md border border-[#4B2E2E] focus:outline-none focus:ring-2 focus:ring-[#4B2E2E] text-xl bg-white/20 backdrop-blur-sm"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    aria-label={`OTP digit ${idx + 1}`}
                  />
                ))}
              </div>

              {otpError && (
                <div className="text-sm text-[#B22222] mt-2">{otpError}</div>
              )}
              {otpSuccess && (
                <div className="text-sm text-[#4B2E2E] mt-2">{otpSuccess}</div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={otpLoading}
                className={`px-5 py-2 rounded-full text-white font-semibold transition-colors ${
                  otpLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#B22222] hover:bg-[#7f1b1b]"
                }`}
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={async () => {
                  // Resend OTP: Hit the /api/otps endpoint
                  setOtpLoading(true);
                  setOtpError(null);
                  try {
                    const res = await api.post("/otps", {
                      email: prefilledEmail,
                    });
                    if (res.ok && (res.status === 200 || res.status === 201)) {
                      setOtpSuccess("New OTP sent successfully.");
                    } else {
                      setOtpError(res.data?.message || "Failed to resend OTP.");
                    }
                  } catch {
                    setOtpError("Network error during resend request.");
                  } finally {
                    setOtpLoading(false);
                    setTimeout(() => setOtpSuccess(null), 3000);
                  }
                }}
                className="text-sm text-[#4B2E2E] underline"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
        {step === "set_password" && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            {/* ... Password inputs remain the same ... */}
            <div>
              <label className="block text-sm font-medium text-[#B22222] mb-2">
                New Password
              </label>
              <PasswordInputWithStrength
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                showStrength={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B22222] mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 rounded-md border border-[#4B2E2E] focus:outline-none focus:ring-2 focus:ring-[#4B2E2E]"
                required
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <div className="text-sm text-[#B22222] mt-2">
                  Passwords do not match.
                </div>
              )}
            </div>

            {submitError && (
              <div className="text-sm text-[#B22222]">{submitError}</div>
            )}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={!canSubmit || submitLoading}
                className={`px-5 py-2 rounded-full text-white font-semibold transition-colors ${
                  submitLoading || !canSubmit
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#B22222] hover:bg-[#7f1b1b]"
                }`}
              >
                {submitLoading ? "Updating..." : "Submit"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("verify_otp");
                  setOtp(Array(OTP_LENGTH).fill(""));
                  if (inputsRef.current[0]) inputsRef.current[0].focus();
                }}
                className="text-sm text-[#4B2E2E] underline"
              >
                Back to OTP
              </button>
            </div>

            <div className="text-xs text-[#4B2E2E]/80 mt-2">
              Password must be at least 8 characters, include uppercase,
              lowercase, a number, and a special symbol.
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
