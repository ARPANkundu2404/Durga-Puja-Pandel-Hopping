import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { pandalData } from "../data/pandalData";

const PandalsPage = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedPandal, setSelectedPandal] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const zones = [
    {
      id: "northKolkata",
      name: "North Kolkata",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq3yMZiBFtbGnQEfYZYQSceTul8HS1GD5h5Eyr6cgcI2B4lEbrrFU4Ndz_4b8VrY5i8DI&usqp=CAU",
    },
    {
      id: "centralKolkata",
      name: "Central Kolkata",
      img: "https://mediaim.expedia.com/destination/2/c900425215144c352c957f5de9bb2aea.jpg",
    },
    {
      id: "southKolkata",
      name: "South Kolkata",
      img: "https://kolkatatourism.travel/images/places-to-visit/headers/kalighat-kali-temple-kolkata-tourism-entry-fee-timings-holidays-reviews-header.jpg",
    },
    {
      id: "khidirpore",
      name: "Khidirpore",
      img: "https://i.ytimg.com/vi/uhoh2Soy8J0/maxresdefault.jpg",
    },
  ];

  // Pandal Details View
  if (selectedPandal) {
    return (
      <div className="w-screen h-screen overflow-hidden flex items-center justify-center text-center text-[#4B2E2E] p-8">
        <div className="relative bg-linear-to-r from-[#FFCF67]/80 to-[#D3321D]/80 backdrop-blur-md border border-white/20 rounded-lg p-8 shadow-2xl shadow-[#4B2E2E] max-w-2xl max-h-[90vh] w-full">
          {/* Back Arrow (top-left inside card) */}
          <button
            aria-label="Back"
            onClick={() => setSelectedPandal(null)}
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
            <h1 className="text-3xl font-bold mb-4">{selectedPandal.name}</h1>
            <h2 className="text-xl mb-2">
              Zone: {zones.find((z) => z.id === selectedZone)?.name}
            </h2>
            <p className="mb-2">Puja Code: {selectedPandal.code}</p>
            <p className="mb-4">
              <strong>Address:</strong> {selectedPandal.address}{" "}
              <span
                className="hover:cursor-pointer"
                onClick={() => {
                  if (!isAuthenticated) {
                    alert(
                      "Please sign in to access directions and navigation features."
                    );
                    navigate("/login");
                    return;
                  }

                  const query = encodeURIComponent(
                    `${selectedPandal.name}, ${selectedPandal.address}`
                  );
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${query}`,
                    "_blank"
                  );
                }}
              >
                📍
              </span>
            </p>

            <button
              className="bg-[#B22222] text-white py-2 px-6 rounded-full hover:bg-[#7f1b1b] transition-colors mb-4 mr-4 shadow-md"
              onClick={() => {
                if (!isAuthenticated) {
                  alert(
                    "Please sign in to access directions and navigation features."
                  );
                  navigate("/login");
                  return;
                }

                if (!navigator.geolocation) {
                  alert("Geolocation not supported");
                  return;
                }

                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
                    const destination = encodeURIComponent(
                      `${selectedPandal.name}, ${selectedPandal.address}`
                    );

                    window.open(
                      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
                      "_blank"
                    );
                  },
                  () => {
                    alert("Please enable location access to get directions.");
                  }
                );
              }}
            >
              Get Directions 🧭
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pandal List View
  if (selectedZone) {
    const pandals = pandalData[selectedZone];
    return (
      <div className="w-screen h-screen overflow-hidden p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto">
          <div className="relative bg-linear-to-r from-[#FFCF67]/70 to-[#D3321D]/70 backdrop-blur-md border border-white/20 rounded-lg text-center text-[#4B2E2E] shadow-xl shadow-[#4B2E2E] p-6 max-h-[90vh]">
            <button
              aria-label="Back"
              onClick={() => setSelectedZone(null)}
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
            <div className="overflow-y-auto max-h-[76vh] pr-4">
              <h1 className="font-bold italic text-2xl mb-4">
                {zones.find((z) => z.id === selectedZone)?.name}
              </h1>
              <hr className="border-t border-[#B22222] mx-1 rounded-full my-4" />
              <ul className="marker:text-[#4B2E2E] list-disc pl-8 space-y-3 text-left">
                {pandals.map((pandal) => (
                  <li
                    key={pandal.id}
                    className="hover:underline cursor-pointer hover:text-[#4B2E2E]"
                    onClick={() => setSelectedPandal(pandal)}
                  >
                    {pandal.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Zone Selection View
  return (
    <div className="w-screen h-screen overflow-hidden p-10 flex flex-col md:flex-row items-center md:justify-between mt-1 md:mt-[10vh] gap-8 bg-[#FDF5E6]">
      {zones.map((zone) => (
        <div key={zone.id} className="items-center flex flex-col">
          <div
            className="rounded-full flex flex-col items-center space-y-1 hover:cursor-pointer transition-transform transform duration-500 ease-in-out hover:scale-110"
            onClick={() => setSelectedZone(zone.id)}
          >
            <img
              className="object-cover w-40 h-40 rounded-full border border-[#B22222] shadow-lg shadow-[#4B2E2E]"
              src={zone.img}
              alt={zone.name}
            />
            <h1 className="font-semibold text-[#B22222] text-xl text-center mt-5 hover:text-[#4B2E2E]">
              {zone.name}
            </h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PandalsPage;
