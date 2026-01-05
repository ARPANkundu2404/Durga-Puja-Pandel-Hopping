import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleKeyNavigation = (e, path) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigation(path);
    }
  };

  const items = [
    {
      img: "https://i.pinimg.com/originals/b9/b1/55/b9b155e6b25629664e2e0cef5c59fd3e.png",
      title: "Pandels",
      path: "/pandals",
    },
    {
      img: "https://img.freepik.com/premium-vector/modern-restaurant-logo-design-template_872774-98.jpg",
      title: "Restaurants",
      path: "/restaurants",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/4781/4781517.png",
      title: "Location",
      path: "/map",
    },
    {
      img: "https://static.vecteezy.com/system/resources/previews/007/423/328/non_2x/subway-train-in-front-view-black-silhouette-icon-metro-station-glyph-pictogram-symbol-of-underground-station-for-electric-public-transport-icon-logo-metro-isolated-illustration-vector.jpg",
      title: "Metro Route",
      path: "/metro",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="h-[70vh] w-screen lg:flex border border-[#B22222] shadow-2xl shadow-[#4B2E2E]">
        <div className="md:w-[50%] lg:h-[70vh] w-screen h-[10vh]">
          <h1 className="font-extrabold text-[#B22222] justify-center my-5 text-center text-3xl lg:text-4xl lg:my-40 lg:text-left lg:mx-10">
            Enjoy this puja with us.
          </h1>
          <h3 className="font-medium text-[#B22222] justify-center text-center text-xl lg:-my-40 -my-4 lg:text-left lg:mx-10">
            Visit{" "}
            <span className="font-medium text-[#FFD700] text-2xl cursor-pointer">
              Kolkata →
            </span>
          </h3>
        </div>
        <Carousel />
      </div>

      {/* Functional Section */}
      <section
        aria-label="Functional navigation"
        className="w-screen bg-transparent py-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#4B2E2E] mb-6 text-center">
            Explore
          </h2>

          {/* Grid: 2 columns on small/medium, 4 on large */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
            {items.map((item, idx) => (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                aria-label={`Go to ${item.title}`}
                onClick={() => handleNavigation(item.path)}
                onKeyDown={(e) => handleKeyNavigation(e, item.path)}
                className="
                  group
                  bg-[#FDF5E6]
                  border-2 border-[#B22222]
                  rounded-2xl
                  p-5
                  flex flex-col items-center text-center
                  transform transition-all duration-300
                  hover:scale-105 hover:-translate-y-1 hover:shadow-xl
                  focus:outline-none focus:ring-4 focus:ring-[#B22222]/20
                  cursor-pointer
                "
              >
                {/* Image / Icon container */}
                <div
                  className="
                    w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32
                    bg-white rounded-xl flex items-center justify-center overflow-hidden
                    border border-[#B22222] p-2
                    transition-all duration-300
                    group-hover:shadow-md
                    "
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="object-contain w-full h-full"
                    loading="lazy"
                  />
                </div>

                {/* Title */}
                <h3 className="mt-4 text-[#4B2E2E] font-semibold text-lg md:text-xl">
                  {item.title}
                </h3>

                {/* Subtle CTA / chevron on hover */}
                <div
                  className="
                    mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    text-sm text-[#B22222] flex items-center gap-2
                  "
                >
                  <span className="text-sm">Explore</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 inline-block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#B22222"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
