import React, { useState, useEffect } from 'react';

/**
 * Reusable Password Input component with a dynamic strength bar and label.
 * Props:
 * - value: current password string
 * - onChange: function(e) -> handles parent state update
 * - showStrength: boolean -> whether to show the strength bar (e.g., only in signup)
 * - className: optional Tailwind classes for styling consistency
 */
const PasswordInputWithStrength = ({ value, onChange, showStrength = false, className = '' }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');

  // --- Calculate password strength ---
  useEffect(() => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++; // ✅ Corrected regex for numbers

    setStrength(score);

    if (score <= 2) setLabel('Weak');
    else if (score <= 4) setLabel('Medium');
    else setLabel('Strong');
  }, [value]);

  // --- Dynamic styles ---
  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getStrengthWidth = () => `${(strength / 5) * 100}%`;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block font-medium text-[#B22222]">Password</label>
      <input
        type="password"
        name="password"
        value={value}
        onChange={onChange}
        placeholder="Enter your password"
        className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#4B2E2E]"
        required
      />

      {/* Password strength bar (only shown in signup or enabled mode) */}
      {showStrength && (
        <div className="mt-2">
          <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
            <div
              className={`${getStrengthColor()} h-2 transition-all duration-500 ease-in-out rounded-full`}
              style={{ width: getStrengthWidth() }}
            ></div>
          </div>
          <p
            className={`text-sm mt-1 font-medium transition-colors ${
              strength <= 2
                ? 'text-red-600'
                : strength <= 4
                ? 'text-amber-600'
                : 'text-green-600'
            }`}
          >
            {label && `Password Strength: ${label}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordInputWithStrength;
