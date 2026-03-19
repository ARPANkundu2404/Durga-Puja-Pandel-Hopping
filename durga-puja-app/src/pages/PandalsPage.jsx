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
      <div className="min-h-screen flex items-center justify-center bg-[#FDF5E6]">
        <div className="text-center px-4">
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
      <div className="min-h-screen flex items-center justify-center bg-[#FDF5E6] px-4 py-6">
        <div className="text-center max-w-sm">
          <p className="text-[#B22222] font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-[#B22222] text-white py-2 px-6 rounded-full hover:bg-[#7f1b1b] transition-all duration-300 hover:scale-105 hover:shadow-lg mx-auto font-medium"
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
      <div className="min-h-screen px-4 py-6 md:py-12 bg-[#FDF5E6]">
        <div className="max-w-2xl mx-auto bg-linear-to-r from-[#FFCF67]/70 to-[#D3321D]/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
          {/* Back Button */}
          <button
            aria-label="Back"
            onClick={() => setSelectedPandal(null)}
            className="flex items-center gap-2 text-[#4B2E2E] hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-105 mb-6"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Content */}
          <div className="space-y-5 text-[#4B2E2E]">
            {/* Title - Centered */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                {selectedPandal.name}
              </h1>
              <p className="text-center text-sm text-[#7f1b1b] font-medium">
                Puja Code: {selectedPandal.id}
              </p>
            </div>

            {/* Zone Info */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-[#B22222]">
                {selectedPandal.zone}
              </h2>
            </div>

            {/* Address Section - Left Aligned */}
            <div className="bg-white/40 rounded-lg p-4 backdrop-blur-sm border border-white/30">
              <div className="flex items-start gap-3">
                <MapPin className="text-[#B22222] shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="font-semibold mb-1">Address</p>
                  <p className="text-sm leading-relaxed">
                    {selectedPandal.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Section - Left Aligned */}
            {selectedPandal.details && (
              <div className="bg-white/40 rounded-lg p-4 backdrop-blur-sm border border-white/30">
                <p className="font-semibold mb-2">Details</p>
                <p className="text-sm leading-relaxed">
                  {selectedPandal.details}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                className="flex items-center justify-center gap-2 bg-[#B22222] text-white py-2 px-4 rounded-full hover:bg-[#7f1b1b] transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium text-sm md:text-base flex-1"
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
                <MapPin size={18} />
                View on Map
              </button>

              <button
                className="flex items-center justify-center gap-2 bg-[#4B2E2E] text-white py-2 px-4 rounded-full hover:bg-[#2a1a1a] transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium text-sm md:text-base flex-1"
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
                <Compass size={18} />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pandal List View
  if (selectedZone) {
    const zoneData = pandals.filter((p) => p.zone === selectedZone);
    return (
      <div className="min-h-screen px-4 py-6 md:py-12 bg-[#FDF5E6]">
        <div className="max-w-2xl mx-auto bg-linear-to-r from-[#FFCF67]/70 to-[#D3321D]/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
          {/* Back Button */}
          <button
            aria-label="Back"
            onClick={() => setSelectedZone(null)}
            className="flex items-center gap-2 text-[#4B2E2E] hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-105 mb-6"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Zone Title */}
          <h1 className="font-bold italic text-3xl md:text-4xl text-center text-[#4B2E2E] mb-6">
            {selectedZone}
          </h1>

          <hr className="border-t border-[#B22222] rounded-full mb-6" />

          {/* Pandal List */}
          {zoneData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#7f1b1b] font-medium">
                No pandals found in this zone.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {zoneData.map((pandal) => (
                <button
                  key={pandal.id}
                  onClick={() => setSelectedPandal(pandal)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-white/30 hover:bg-white/50 text-[#4B2E2E] font-medium transition-all duration-300 hover:shadow-md hover:translate-x-1 border border-white/20"
                >
                  <span className="text-[#B22222] mr-2">•</span>
                  {pandal.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Zone Selection View
  return (
    <div className="min-h-screen px-4 py-8 md:px-10 md:py-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 bg-[#FDF5E6]">
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-6 md:gap-8">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone.name)}
            className="flex flex-col items-center space-y-3 hover:cursor-pointer transition-all duration-300 group"
          >
            <div className="relative">
              <img
                className="object-cover w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#B22222] shadow-lg group-hover:scale-110 transition-transform duration-300"
                src={zone.img}
                alt={zone.name}
              />
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
            </div>
            <h1 className="font-semibold text-[#B22222] text-lg md:text-xl text-center group-hover:text-[#D3321D] transition-colors">
              {zone.name}
            </h1>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PandalsPage;
