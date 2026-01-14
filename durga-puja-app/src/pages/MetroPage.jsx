import { useState } from "react";

const MetroPage = () => {
  const [nearestMetro, setNearestMetro] = useState(null);
  const [railwayStations, setRailwayStations] = useState([]);
  const [busStops, setBusStops] = useState([]);
  const [metroRoutes, setMetroRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simple distance calculation (sufficient for nearby sorting)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchMetroRelatedData(latitude, longitude);
      },
      () => {
        setLoading(false);
        setError("Please allow location access");
      }
    );
  };

  const fetchMetroRelatedData = async (lat, lon) => {
    try {
      // ---------- METRO STATIONS ----------
      const metroQuery = `
      [out:json];
      node["railway"="station"]["subway"="yes"](around:2000,${lat},${lon});
      out body;
      `;

      const metroRes = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: metroQuery,
      });
      const metroData = await metroRes.json();

      if (metroData.elements.length > 0) {
        const sorted = metroData.elements
          .map((st) => ({
            ...st,
            distance: getDistance(lat, lon, st.lat, st.lon),
          }))
          .sort((a, b) => a.distance - b.distance);

        setNearestMetro(sorted[0]);
      }

      // ---------- RAILWAY STATIONS ----------
      const railwayQuery = `
      [out:json];
      node["railway"="station"](around:3000,${lat},${lon});
      out body;
      `;

      const railwayRes = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: railwayQuery,
        }
      );
      const railwayData = await railwayRes.json();

      const filteredRailway = railwayData.elements.filter(
        (st) => !st.tags?.subway
      );

      setRailwayStations(filteredRailway.slice(0, 5));

      // ---------- BUS STOPS ----------
      const busQuery = `
      [out:json];
      node["highway"="bus_stop"](around:1500,${lat},${lon});
      out body;
      `;

      const busRes = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: busQuery,
      });
      const busData = await busRes.json();

      setBusStops(busData.elements.slice(0, 5));

      // ---------- METRO ROUTES (SEMI-DYNAMIC) ----------
      const routeQuery = `
      [out:json];
      relation["route"="subway"](around:5000,${lat},${lon});
      out tags;
      `;

      const routeRes = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: routeQuery,
      });
      const routeData = await routeRes.json();

      setMetroRoutes(routeData.elements.slice(0, 5));

      setLoading(false);
    } catch {
      setLoading(false);
      setError("Failed to load metro data. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🚇 Metro Information</h1>

      <button
        onClick={detectLocation}
        className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg mb-6"
      >
        Find Nearby Metro
      </button>

      {loading && <p>Loading nearby transport details...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {nearestMetro && (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold">Nearest Metro Station</h2>
          <p>{nearestMetro.tags?.name || "Unnamed Metro Station"}</p>
        </div>
      )}

      {railwayStations.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold">Nearby Railway Stations</h2>
          <ul className="list-disc ml-5">
            {railwayStations.map((st) => (
              <li key={st.id}>{st.tags?.name || "Railway Station"}</li>
            ))}
          </ul>
        </div>
      )}

      {busStops.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold">Nearby Bus Stops</h2>
          <ul className="list-disc ml-5">
            {busStops.map((stop) => (
              <li key={stop.id}>{stop.tags?.name || "Bus Stop"}</li>
            ))}
          </ul>
        </div>
      )}

      {metroRoutes.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Common Metro Routes</h2>
          <ul className="list-disc ml-5">
            {metroRoutes.map((route) => (
              <li key={route.id}>{route.tags?.name || "Metro Line"}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MetroPage;
