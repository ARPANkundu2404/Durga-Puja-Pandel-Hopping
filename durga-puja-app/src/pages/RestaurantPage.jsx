import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

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
      }
    );
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-[#FDF5E6] p-8">
      <div className="relative w-full max-w-4xl bg-linear-to-r from-[#FFCF67]/60 to-[#D3321D]/60 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 max-h-[90vh]">
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
            Nearby Restaurants 🍽️
          </h1>

          <div className="flex justify-center mb-8">
            <button
              onClick={detectLocationAndFetch}
              className="bg-[#B22222] text-[#FFD700] px-6 py-3 rounded-lg hover:bg-[#4B2E2E] hover:cursor-pointer transition-colors"
            >
              Find Nearby Restaurants 📍
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-600">
              Finding nearby restaurants...
            </p>
          )}

          {/* Error */}
          {error && <p className="text-center text-red-600">{error}</p>}

          {/* Restaurant List */}
          {!loading && restaurants.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((place) => (
                <div
                  key={place.id}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-[#4B2E2E]">
                    {place.tags?.name || "Unnamed Restaurant"}
                  </h3>

                  {place.tags?.cuisine && (
                    <p className="text-sm text-gray-600">
                      Cuisine: {place.tags.cuisine}
                    </p>
                  )}

                  {place.tags?.["addr:street"] && (
                    <p className="text-sm text-gray-500 mt-1">
                      {place.tags["addr:street"]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && restaurants.length === 0 && (
            <p className="text-center text-gray-500">
              No restaurants found nearby.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
