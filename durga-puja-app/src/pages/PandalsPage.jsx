import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { ArrowLeft, MapPin, Compass } from "lucide-react";
import api from "../utils/api";

// Zone images map
const zoneImagesMap = {
  "North Kolkata":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq3yMZiBFtbGnQEfYZYQSceTul8HS1GD5h5Eyr6cgcI2B4lEbrrFU4Ndz_4b8VrY5i8DI&usqp=CAU",
  "Central Kolkata":
    "https://mediaim.expedia.com/destination/2/c900425215144c352c957f5de9bb2aea.jpg",
  "South Kolkata":
    "https://kolkatatourism.travel/images/places-to-visit/headers/kalighat-kali-temple-kolkata-tourism-entry-fee-timings-holidays-reviews-header.jpg",
  Khidirpore: "https://i.ytimg.com/vi/uhoh2Soy8J0/maxresdefault.jpg",
};

const PandalsPage = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedPandal, setSelectedPandal] = useState(null);
  const [pandals, setPandals] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch approved pandals from API
  useEffect(() => {
    const fetchPandals = async () => {
      try {
        setLoading(true);
        const response = await api.get("/pandals/approved");
        if (response.ok && response.data) {
          setPandals(response.data);

          // Extract unique zones and create zone objects
          const uniqueZones = [...new Set(response.data.map((p) => p.zone))];
          const zoneObjects = uniqueZones.map((zone) => ({
            id: zone.toLowerCase().replace(/\s+/g, ""),
            name: zone,
            img:
              zoneImagesMap[zone] ||
              "https://via.placeholder.com/400x300?text=" +
                encodeURIComponent(zone),
          }));
          setZones(zoneObjects);
        } else {
          setError("Failed to load pandals");
        }
      } catch (err) {
        console.error("Error fetching pandals:", err);
        setError("Error loading pandals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPandals();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-[#FDF5E6]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#B22222]"></div>
          <p className="mt-4 text-[#4B2E2E] font-semibold">
            Loading pandals...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-[#FDF5E6] p-8">
        <div className="text-center">
          <p className="text-[#B22222] font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#B22222] text-white py-2 px-6 rounded-full hover:bg-[#7f1b1b] transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Pandal Details View
  if (selectedPandal) {
    return (
      <div className="w-screen h-screen overflow-hidden flex items-center justify-center text-center text-[#4B2E2E] p-8 bg-[#FDF5E6]">
        <div className="relative bg-linear-to-r from-[#FFCF67]/70 to-[#D3321D]/70 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl max-w-2xl max-h-[90vh] w-full">
          {/* Back Arrow (top-left inside card) */}
          <button
            aria-label="Back"
            onClick={() => setSelectedPandal(null)}
            className="absolute left-4 top-4 p-2 rounded-full text-[#4B2E2E] hover:bg-white/20 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="overflow-y-auto max-h-[78vh] pr-4">
            <h1 className="text-3xl font-bold mb-4">{selectedPandal.name}</h1>
            <h2 className="text-xl mb-2">Zone: {selectedPandal.zone}</h2>
            <p className="mb-2">Puja Code: {selectedPandal.id}</p>
            <p className="mb-4">
              <strong>Address:</strong> {selectedPandal.address}{" "}
              <span
                className="hover:cursor-pointer text-2xl"
                onClick={() => {
                  if (!isAuthenticated) {
                    alert(
                      "Please sign in to access directions and navigation features.",
                    );
                    navigate("/login");
                    return;
                  }

                  const query = encodeURIComponent(
                    `${selectedPandal.name}, ${selectedPandal.address}`,
                  );
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${query}`,
                    "_blank",
                  );
                }}
              >
                <MapPin className="shrink-0 text-[#B22222]" />
              </span>
            </p>
            {selectedPandal.details && (
              <p className="mb-4">
                <strong>Details:</strong> {selectedPandal.details}
              </p>
            )}

            <button
              className="bg-[#B22222] text-white py-2 px-6 rounded-full hover:bg-[#7f1b1b] transition-all duration-300 mb-4 mr-4 shadow-md hover:scale-105"
              onClick={() => {
                if (!isAuthenticated) {
                  alert(
                    "Please sign in to access directions and navigation features.",
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
                      `${selectedPandal.name}, ${selectedPandal.address}`,
                    );

                    window.open(
                      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
                      "_blank",
                    );
                  },
                  () => {
                    alert("Please enable location access to get directions.");
                  },
                );
              }}
            >
              Get Directions <Compass size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pandal List View
  if (selectedZone) {
    const zoneData = pandals.filter((p) => p.zone === selectedZone);
    return (
      <div className="w-screen h-screen overflow-hidden p-8 flex items-center justify-center bg-[#FDF5E6]">
        <div className="max-w-2xl w-full mx-auto">
          <div className="relative bg-linear-to-r from-[#FFCF67]/70 to-[#D3321D]/70 backdrop-blur-md border border-white/20 rounded-2xl text-center text-[#4B2E2E] shadow-2xl p-6 max-h-[90vh]">
            <button
              aria-label="Back"
              onClick={() => setSelectedZone(null)}
              className="absolute left-4 top-4 p-2 rounded-full text-[#4B2E2E] hover:bg-white/20 transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="overflow-y-auto max-h-[76vh] pr-4">
              <h1 className="font-bold italic text-2xl mb-4">{selectedZone}</h1>
              <hr className="border-t border-[#B22222] mx-1 rounded-full my-4" />
              <ul className="marker:text-[#4B2E2E] list-disc pl-8 space-y-3 text-left">
                {zoneData.map((pandal) => (
                  <li
                    key={pandal.id}
                    className="hover:underline cursor-pointer hover:text-[#7f1b1b] transition-all duration-300"
                    onClick={() => setSelectedPandal(pandal)}
                  >
                    {pandal.name}
                  </li>
                ))}
              </ul>
              {zoneData.length === 0 && (
                <p className="text-center text-[#7f1b1b] mt-8">
                  No pandals found in this zone.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Zone Selection View
  return (
    <div className="w-screen h-screen overflow-hidden p-4 md:p-10 flex flex-col md:flex-row items-center md:justify-between md:gap-8 gap-4 bg-[#FDF5E6]">
      {zones.map((zone) => (
        <div
          key={zone.id}
          className="items-center flex flex-col w-full md:w-auto"
        >
          <div
            className="rounded-full flex flex-col items-center space-y-1 hover:cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={() => setSelectedZone(zone.name)}
          >
            <img
              className="object-cover w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#B22222] shadow-lg"
              src={zone.img}
              alt={zone.name}
            />
            <h1 className="font-semibold text-[#B22222] text-lg md:text-xl text-center mt-5 hover:text-[#D3321D] transition-colors">
              {zone.name}
            </h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PandalsPage;
