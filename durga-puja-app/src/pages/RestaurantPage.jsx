import React, { useState } from "react";

const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="min-h-[70vh] p-8">
      <h1 className="text-3xl font-bold text-[#B22222] text-center mb-6 ">
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
  );
};

export default RestaurantPage;
