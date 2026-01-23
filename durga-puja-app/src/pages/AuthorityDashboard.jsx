import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../context/useAuth";
import api from "../utils/api";

const AuthorityDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [myPandals, setMyPandals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    zone: "",
    details: "",
  });

  const zones = [
    "North Kolkata",
    "Central Kolkata",
    "South Kolkata",
    "Khidirpore",
  ];

  // Redirect if not authenticated or not AUTHORITY
  useEffect(() => {
    if (!isAuthenticated || role !== "AUTHORITY") {
      navigate("/");
      return;
    }

    fetchMyPandals();
  }, [isAuthenticated, role, navigate]);

  // Fetch user's pandals
  const fetchMyPandals = async () => {
    try {
      setLoading(true);
      const response = await api.get("/pandals/my-pandals");
      if (response.ok && response.data) {
        setMyPandals(response.data);
      } else {
        setError("Failed to load your pandals");
      }
    } catch (err) {
      console.error("Error fetching pandals:", err);
      setError("Error loading pandals");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.zone) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await api.post("/pandals", formData);

      if (response.ok) {
        setFormData({ name: "", address: "", zone: "", details: "" });
        setShowForm(false);
        await fetchMyPandals();
      } else {
        setError(response.data?.message || "Failed to submit pandal");
      }
    } catch (err) {
      console.error("Error submitting pandal:", err);
      setError("Error submitting pandal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete pandal
  const handleDelete = async (pandalId) => {
    if (!window.confirm("Are you sure you want to delete this pandal?")) {
      return;
    }

    try {
      const response = await api.delete(`/pandals/${pandalId}`);
      if (response.ok) {
        await fetchMyPandals();
      } else {
        setError("Failed to delete pandal");
      }
    } catch (err) {
      console.error("Error deleting pandal:", err);
      setError("Error deleting pandal");
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const isApproved = status === "APPROVED";
    const bgColor = isApproved ? "bg-green-100" : "bg-yellow-100";
    const textColor = isApproved ? "text-green-800" : "text-yellow-800";
    return (
      <span
        className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-sm font-semibold`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#FDF5E6] flex items-center justify-center p-4 md:p-8">
      <div className="relative bg-linear-to-r from-[#FFCF67]/70 to-[#D3321D]/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] p-6 md:p-8">
        {/* Back Arrow */}
        <button
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 p-2 rounded-full text-[#4B2E2E] hover:bg-white/20 transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Add Pandal Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="absolute right-4 top-4 p-2 rounded-full bg-[#B22222] text-white hover:bg-[#7f1b1b] transition-all duration-300 hover:scale-110"
        >
          <Plus size={24} />
        </button>

        <div className="overflow-y-auto max-h-[78vh] mt-12">
          <h1 className="font-bold italic text-3xl text-center text-[#4B2E2E] mb-6">
            My Pandal Dashboard
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100/90 border border-red-400 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 font-bold text-red-800"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form Section */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white/90 rounded-xl p-6 mb-6 backdrop-blur-sm border border-white/30"
            >
              <h2 className="text-2xl font-bold text-[#4B2E2E] mb-4">
                Submit New Pandal
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Pandal Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-[#D3321D]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B22222] bg-white/80"
                />

                <select
                  name="zone"
                  value={formData.zone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-[#D3321D]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B22222] bg-white/80"
                >
                  <option value="">Select Zone *</option>
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                name="address"
                placeholder="Full Address *"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-[#D3321D]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B22222] bg-white/80 mb-4"
              />

              <textarea
                name="details"
                placeholder="Additional Details (optional)"
                value={formData.details}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-[#D3321D]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B22222] bg-white/80 mb-4"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#B22222] text-white py-2 rounded-lg hover:bg-[#7f1b1b] transition-all duration-300 font-semibold disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Pandal"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      name: "",
                      address: "",
                      zone: "",
                      details: "",
                    });
                  }}
                  className="flex-1 bg-white/70 text-[#4B2E2E] py-2 rounded-lg hover:bg-white transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Pandals List */}
          <div>
            <h2 className="text-2xl font-bold text-[#4B2E2E] mb-4">
              Your Pandals ({myPandals.length})
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#B22222]"></div>
                <p className="mt-2 text-[#4B2E2E]">Loading your pandals...</p>
              </div>
            ) : myPandals.length === 0 ? (
              <div className="text-center py-8 bg-white/50 rounded-lg">
                <p className="text-[#4B2E2E] text-lg">
                  No pandals submitted yet. Click the + button to add one!
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {/* Table for Desktop */}
                <div className="hidden md:block overflow-x-auto bg-white/60 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-[#D3321D]/30">
                      <tr className="text-left text-[#4B2E2E]">
                        <th className="px-4 py-3 font-bold">Name</th>
                        <th className="px-4 py-3 font-bold">Zone</th>
                        <th className="px-4 py-3 font-bold">Address</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myPandals.map((pandal) => (
                        <tr
                          key={pandal.id}
                          className="border-b border-white/30 hover:bg-white/40 transition-colors"
                        >
                          <td className="px-4 py-3 text-[#4B2E2E] font-semibold">
                            {pandal.name}
                          </td>
                          <td className="px-4 py-3 text-[#4B2E2E]">
                            {pandal.zone}
                          </td>
                          <td className="px-4 py-3 text-[#4B2E2E] text-sm">
                            {pandal.address}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={pandal.status || "PENDING"} />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDelete(pandal.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cards for Mobile */}
                <div className="md:hidden space-y-3">
                  {myPandals.map((pandal) => (
                    <div
                      key={pandal.id}
                      className="bg-white/60 rounded-lg p-4 border border-white/20"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-[#4B2E2E] text-lg">
                            {pandal.name}
                          </h3>
                          <p className="text-sm text-[#7f1b1b]">
                            {pandal.zone}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(pandal.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-sm text-[#4B2E2E] mb-2">
                        {pandal.address}
                      </p>
                      <StatusBadge status={pandal.status || "PENDING"} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
