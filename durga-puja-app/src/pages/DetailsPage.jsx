import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link instead of using <a>
import DetailSection from "../components/DetailSection";
import data from "../data/durgaPujaDetails.json";

export default function DetailsPage() {
  const [language, setLanguage] = useState("bn"); // default Bengali
  const [contentVisible, setContentVisible] = useState(true);

  useEffect(() => {
    setContentVisible(false);
    const t = setTimeout(() => setContentVisible(true), 160);
    return () => clearTimeout(t);
  }, [language]);

  const days = data.filter((d) => d.type === "day");
  const rituals = data.filter((d) => d.type === "ritual");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "bn" ? "en" : "bn"));
  };

  return (
    <div className="min-h-screen bg-[#FDF5E6] text-[#4B2E2E]">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div
          className={`transition-opacity duration-300 ${
            contentVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <header className="mb-6 flex items-center justify-between">
            <h1 className="bg-[#B22222] text-[#FDF5E6] font-extrabold text-xl py-2 px-4 rounded-lg">
              {language === "bn" ? "দুর্গা পূজা:" : "Durga Puja:"}
            </h1>

            {/* Toggle: pill with sliding dot + rotating icon */}
            <button
              onClick={toggleLanguage}
              aria-pressed={language === "en"}
              className="relative inline-flex items-center h-10 px-2 rounded-full bg-[#4B2E2E] hover:bg-[#3a2626] transition-colors duration-300 focus:outline-none"
            >
              {/* Labels */}
              <span
                className={`text-xs text-[#FDF5E6] mr-4 pl-1 transition-opacity duration-200 ${
                  language === "bn" ? "opacity-40" : "opacity-80"
                }`}
              >
                বাংলা
              </span>
              <span
                className={`text-xs text-[#FDF5E6] ml-6 pr-1 transition-opacity duration-200 ${
                  language === "en" ? "opacity-40" : "opacity-80"
                }`}
              >
                EN
              </span>

              {/* Sliding dot */}
              <span
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FFD700] rounded-full shadow transform transition-transform duration-300 ${
                  language === "en" ? "translate-x-13" : "translate-x-0"
                }`}
              >
                <span
                  className={` w-full h-full flex items-center justify-center text-xl transition-transform duration-500 ${
                    language === "en" ? "rotate-180" : ""
                  }`}
                >
                  🌸
                </span>
              </span>
            </button>
          </header>

          {/* Days */}
          <section aria-label="Days">
            {days.map((item, idx) => (
              <DetailSection
                key={item.id}
                item={item}
                language={language}
                index={idx}
              />
            ))}
          </section>

          {/* Rituals heading */}
          <section className="mt-8">
            <h2 className="font-medium bg-[#FFD700] text-[#4B2E2E] px-3 py-2 my-4 inline-block rounded-e-full">
              {language === "bn"
                ? "দুর্গাপূজার নিয়মাবলি ও আচার:"
                : "Rituals and Practices of Durga Puja:"}
            </h2>

            {rituals.map((item, idx) => (
              <DetailSection
                key={item.id}
                item={item}
                language={language}
                index={days.length + idx}
              />
            ))}
          </section>

          {/* Home button (using Link instead of <a>) */}
          <div className="mt-8">
            <Link to="/" className="inline-block">
              <button className="bg-[#4B2E2E] text-[#FDF5E6] p-2 rounded-full hover:bg-[#B22222] transition">
                {language === "bn" ? "হোম" : "Home"}
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
