import React, { useEffect, useState } from "react";

const LocationPage = () => {
  const [pos, setPos] = useState(null);

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
    <>
      <div className="min-h-[70vh] p-8">
        <h1 className="text-3xl font-bold text-[#B22222] text-center mb-6">
          Know Your Nearby
        </h1>
        <div className="flex justify-center mb-8">
          <button
            onClick={() => {
              // Open Google Maps centered on the Pandal's coordinates
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
    </>
  );
};

export default LocationPage;
