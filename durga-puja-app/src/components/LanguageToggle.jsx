import React from "react";

/**
 * LanguageToggle
 * Props:
 * - language: 'en' | 'bn'
 * - setLanguage: function to update language
 *
 * This keeps the original checkbox style but wired to React state.
 */
export default function LanguageToggle({ language, setLanguage }) {
  const checked = language === "en";

  const handleChange = (e) => {
    setLanguage(e.target.checked ? "en" : "bn");
  };

  return (
    <div className="flex items-center">
      <span className={`mr-2 ${checked ? "hidden" : ""} text-sm`}>বাংলা</span>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="sr-only peer"
          aria-label="Toggle language"
        />
        <div
          className={`w-12 h-6 bg-[#FDF5E6] rounded-full peer-focus:ring-4 peer-focus:ring-[#FFD700]
                      peer-checked:bg-[#4B2E2E] relative transition-all`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full border-[#B22222] border bg-[#FDF5E6]
                        transform transition-transform peer-checked:translate-x-6`}
          />
        </div>
      </label>

      <span className={`ml-2 ${checked ? "" : "hidden"} text-sm`}>English</span>
    </div>
  );
}
