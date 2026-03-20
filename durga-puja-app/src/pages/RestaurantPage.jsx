import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { ArrowLeft } from "lucide-react";

const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchNearbyRestaurants = async (lat, lon) => {
    const radius = 800;

    const query = `
    [out:json][timeout:25];
    node["amenity"="restaurant"](around:${radius},${lat},${lon});
    out body;
  `;

    for (const server of OVERPASS_SERVERS) {
      try {
        const response = await fetch(server, {
          method: "POST",
          body: query,
          headers: { "Content-Type": "text/plain" },
        });

        if (!response.ok) continue;

        const data = await response.json();
        setRestaurants(data.elements || []);
        setLoading(false);
        return;
      } catch {
        // try next server
      }
    }

    setError("All free map servers are busy. Try again later.");
    setLoading(false);
  };

  const OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.nchc.org.tw/api/interpreter",
  ];

  const detectLocationAndFetch = () => {
    if (!isAuthenticated) {
      alert("Please sign in to access directions and navigation features.");
      navigate("/login");
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);
    setRestaurants([]);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchNearbyRestaurants(latitude, longitude);
      },
      () => {
        setError("Please enable location services");
        setLoading(false);
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 bg-linear-to-r from-[#FFCF67]/70 to-[#D3321D]/70 p-6 md:p-8">
        {/* Back Button */}
        <button
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#4B2E2E] hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-105 mb-6"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="space-y-6">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#B22222] text-center">
            Nearby Restaurants 🍽️
          </h1>

          {/* Find Button */}
          <div className="flex justify-center">
            <button
              onClick={detectLocationAndFetch}
              disabled={loading}
              className="bg-[#B22222] text-white px-8 py-3 rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading
                ? "Finding Restaurants..."
                : "Find Nearby Restaurants 📍"}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#B22222]"></div>
              <p className="text-[#4B2E2E] font-medium">
                Finding nearby restaurants...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100/80 border border-red-400 text-red-800 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Restaurant Cards Grid */}
          {!loading && restaurants.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map((place) => (
                <div
                  key={place.id}
                  className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-[#4B2E2E] mb-2">
                    {place.tags?.name || "Unnamed Restaurant"}
                  </h3>

                  {place.tags?.cuisine && (
                    <p className="text-sm text-[#7f1b1b] font-medium mb-1">
                      🍴 {place.tags.cuisine}
                    </p>
                  )}

                  {place.tags?.["addr:street"] && (
                    <p className="text-sm text-[#4B2E2E] leading-relaxed">
                      📍 {place.tags["addr:street"]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No Results State */}
          {!loading && !error && restaurants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[#4B2E2E] text-lg font-medium">
                Click the button above to find nearby restaurants
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
