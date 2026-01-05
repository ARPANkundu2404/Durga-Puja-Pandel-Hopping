import React, { useEffect, useState } from "react";

/**
 * DetailSection
 * Props:
 * - item: { id, bengaliTitle, englishTitle, bengaliContent, englishContent, type }
 * - language: 'en' | 'bn'
 * - index: number (for staggered animations)
 */
export default function DetailSection({ item, language, index = 0 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Staggered entrance animation
    const t = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(t);
  }, [index]);

  const title = language === "bn" ? item.bengaliTitle : item.englishTitle;
  const content = language === "bn" ? item.bengaliContent : item.englishContent;

  return (
    <section
      aria-labelledby={item.id}
      className={`mb-6 transform transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <h2
        id={item.id}
        className={`font-medium bg-[#B22222] text-[#FFD700] px-3 py-2 my-2 inline-block w-full sm:w-auto rounded-e-full text-center`}
      >
        {title}
      </h2>

      <p className="mt-3 text-[#4B2E2E] leading-relaxed text-sm sm:text-base">
        {content}
      </p>
    </section>
  );
}
