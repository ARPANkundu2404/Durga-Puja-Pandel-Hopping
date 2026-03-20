import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Bus, Train, Zap, Navigation } from "lucide-react";
import { useAuth } from "../context/useAuth";

const MetroPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [nearestMetro, setNearestMetro] = useState(null);
  const [railwayStations, setRailwayStations] = useState([]);
  const [busStops, setBusStops] = useState([]);
  const [metroRoutes, setMetroRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);

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
        setUserLocation({ latitude, longitude });
        fetchMetroRelatedData(latitude, longitude);
      },
      () => {
        setLoading(false);
        setError("Please allow location access");
      },
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
        },
      );
      const railwayData = await railwayRes.json();

      const filteredRailway = railwayData.elements.filter(
        (st) => !st.tags?.subway,
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

  const openGoogleMaps = (name, lat, lon) => {
    if (!isAuthenticated) {
      alert("Please sign in to access map features.");
      navigate("/login");
      return;
    }

    const query = encodeURIComponent(name);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}@${lat},${lon}`,
      "_blank",
    );
  };

  const getDirections = (name, lat, lon) => {
    if (!isAuthenticated) {
      alert("Please sign in to access directions.");
      navigate("/login");
      return;
    }

    if (!userLocation) {
      alert("Location not available. Please detect location first.");
      return;
    }

    const origin = `${userLocation.latitude},${userLocation.longitude}`;

    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${lat},${lon}`,
      "_blank",
    );
  };

  const renderDetailView = () => {
    const { name, lat, lon, type } = selectedTransport;

    let icon = null;
    switch (type) {
      case "metro":
        icon = <Zap className="h-6 w-6" />;
        break;
      case "railway":
        icon = <Train className="h-6 w-6" />;
        break;
      case "bus":
        icon = <Bus className="h-6 w-6" />;
        break;
      case "route":
        icon = <Zap className="h-6 w-6" />;
        break;
      default:
        icon = <MapPin className="h-6 w-6" />;
    }

    return (
      <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-3xl rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 bg-linear-to-r from-[#FFCF67]/70 to-[#D3321D]/70 p-6 md:p-8">
          {/* Back Button - Inside Card */}
          <button
            aria-label="Back"
            onClick={() => setSelectedTransport(null)}
            className="flex items-center gap-2 text-[#4B2E2E] hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-105 mb-6"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Content */}
          <div className="space-y-6">
            {/* Title - Centered */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 flex items-center justify-center gap-2 text-[#B22222]">
                {icon}
                {name}
              </h1>
              <p className="text-center text-sm text-[#7f1b1b] font-medium">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </p>
            </div>

            {/* Location Info Section */}
            <div className="bg-white/40 rounded-lg p-4 backdrop-blur-sm border border-white/20">
              <div className="flex items-start gap-3">
                <MapPin className="text-[#B22222] shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="font-semibold mb-1 text-[#4B2E2E]">Location</p>
                  <p className="text-sm leading-relaxed text-[#4B2E2E]">
                    Latitude: {lat.toFixed(4)}, Longitude: {lon.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                className="flex items-center justify-center gap-2 bg-[#B22222] text-white py-2 px-4 rounded-full hover:bg-[#7f1b1b] transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium text-sm md:text-base flex-1"
                onClick={() => openGoogleMaps(name, lat, lon)}
              >
                <MapPin size={18} />
                View on Map
              </button>

              <button
                className="flex items-center justify-center gap-2 bg-[#4B2E2E] text-white py-2 px-4 rounded-full hover:bg-[#2a1a1a] transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium text-sm md:text-base flex-1"
                onClick={() => getDirections(name, lat, lon)}
              >
                <Navigation size={18} />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show detail view if transport is selected
  if (selectedTransport) {
    return renderDetailView();
  }

  return (
    <div className="min-h-screen bg-[#FDF5E6] flex items-center justify-center px-4 py-6">
      {/* Main Card Container */}
      <div className="w-full max-w-3xl rounded-2xl shadow-2xl backdrop-blur-md bg-linear-to-r from-[#FFCF67]/70 to-[#D3321D]/70 border border-white/20 p-6 md:p-8">
        {/* Back Button - Inside Card */}
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
            🚇 Metro Information
          </h1>

          {/* Location Detection Button */}
          <div className="flex justify-center">
            <button
              onClick={detectLocation}
              disabled={loading}
              className="bg-[#B22222] text-white px-8 py-3 rounded-full font-semibold hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Detecting Location..." : "Find Nearby Metro"}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#B22222]"></div>
              <p className="text-[#4B2E2E] font-medium">
                Loading nearby transport details...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100/80 border border-red-400 text-red-800 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Nearest Metro Station */}
          {nearestMetro && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#4B2E2E] flex items-center gap-2">
                <Zap className="h-6 w-6" />
                Nearest Metro Station
              </h2>
              <button
                onClick={() =>
                  setSelectedTransport({
                    name: nearestMetro.tags?.name || "Unnamed Metro Station",
                    lat: nearestMetro.lat,
                    lon: nearestMetro.lon,
                    type: "metro",
                  })
                }
                className="w-full bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/50 hover:shadow-sm hover:scale-[1.02] transition-all duration-200 cursor-pointer text-left"
              >
                <p className="text-[#4B2E2E] font-semibold text-lg">
                  {nearestMetro.tags?.name || "Unnamed Metro Station"}
                </p>
              </button>
            </div>
          )}

          {/* Railway Stations */}
          {railwayStations.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#4B2E2E] flex items-center gap-2">
                <Train className="h-6 w-6" />
                Nearby Railway Stations
              </h2>
              <div className="space-y-2">
                {railwayStations.map((st) => (
                  <button
                    key={st.id}
                    onClick={() =>
                      setSelectedTransport({
                        name: st.tags?.name || "Railway Station",
                        lat: st.lat,
                        lon: st.lon,
                        type: "railway",
                      })
                    }
                    className="w-full bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/50 hover:shadow-sm hover:scale-[1.02] transition-all duration-200 cursor-pointer text-left"
                  >
                    <p className="text-[#4B2E2E] font-medium">
                      📍 {st.tags?.name || "Railway Station"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bus Stops */}
          {busStops.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#4B2E2E] flex items-center gap-2">
                <Bus className="h-6 w-6" />
                Nearby Bus Stops
              </h2>
              <div className="space-y-2">
                {busStops.map((stop) => (
                  <button
                    key={stop.id}
                    onClick={() =>
                      setSelectedTransport({
                        name: stop.tags?.name || "Bus Stop",
                        lat: stop.lat,
                        lon: stop.lon,
                        type: "bus",
                      })
                    }
                    className="w-full bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/50 hover:shadow-sm hover:scale-[1.02] transition-all duration-200 cursor-pointer text-left"
                  >
                    <p className="text-[#4B2E2E] font-medium">
                      🚌 {stop.tags?.name || "Bus Stop"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Metro Routes */}
          {metroRoutes.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#4B2E2E] flex items-center gap-2">
                <Zap className="h-6 w-6" />
                Common Metro Routes
              </h2>
              <div className="space-y-2">
                {metroRoutes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() =>
                      setSelectedTransport({
                        name: route.tags?.name || "Metro Line",
                        lat: 22.5726,
                        lon: 88.3639,
                        type: "route",
                      })
                    }
                    className="w-full bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/50 hover:shadow-sm hover:scale-[1.02] transition-all duration-200 cursor-pointer text-left"
                  >
                    <p className="text-[#4B2E2E] font-medium">
                      🚇 {route.tags?.name || "Metro Line"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading &&
            !nearestMetro &&
            railwayStations.length === 0 &&
            busStops.length === 0 &&
            metroRoutes.length === 0 &&
            !error && (
              <div className="text-center py-8">
                <p className="text-[#4B2E2E] text-lg font-medium">
                  Click the button above to find nearby metro, railway, and bus
                  information
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MetroPage;
