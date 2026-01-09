import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LocationPage = () => {
  const [pos, setPos] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setPos(position),
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  const user_lat = pos?.coords?.latitude;
  const user_lng = pos?.coords?.longitude;

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-[#FDF5E6] p-8">
      <div className="relative w-full max-w-2xl bg-linear-to-r from-[#FFCF67]/60 to-[#D3321D]/60 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 max-h-[90vh]">
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

        <div className="overflow-y-auto max-h-[80vh] pr-4">
          <h1 className="text-3xl font-bold text-[#B22222] text-center mb-6">
            Know Your Nearby
          </h1>
          <div className="flex justify-center mb-8">
            <button
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${user_lat},${user_lng}`,
                  "_blank"
                );
              }}
              className="bg-[#B22222] text-[#FFD700] px-6 py-3 rounded-lg hover:bg-[#4B2E2E] hover:cursor-pointer transition-colors"
            >
              Find Nearby Restaurants 📍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
