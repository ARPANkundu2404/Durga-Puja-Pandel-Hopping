import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Trash2 } from "lucide-react";
import { useAuth } from "../context/useAuth";
import api from "../utils/api";

const AdminDashboard = () => {
  const [pendingPandals, setPendingPandals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  // Redirect if not authenticated or not ADMIN
  useEffect(() => {
    if (!isAuthenticated || role !== "ADMIN") {
      navigate("/");
      return;
    }

    fetchPendingPandals();
  }, [isAuthenticated, role, navigate]);

  // Fetch pending pandals
  const fetchPendingPandals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/pandals/admin/pending");
      if (response.ok && response.data) {
        setPendingPandals(response.data);
      } else {
        setError("Failed to load pending pandals");
      }
    } catch (err) {
      console.error("Error fetching pending pandals:", err);
      setError("Error loading pending pandals");
    } finally {
      setLoading(false);
    }
  };

  // Handle approve pandal
  const handleApprove = async (pandalId) => {
    try {
      setActionInProgress(pandalId);
      const response = await api.put(`/pandals/${pandalId}/approve`, {});

      if (response.ok) {
        await fetchPendingPandals();
      } else {
        setError(response.data?.message || "Failed to approve pandal");
      }
    } catch (err) {
      console.error("Error approving pandal:", err);
      setError("Error approving pandal. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle delete pandal
  const handleDelete = async (pandalId) => {
    if (
      !window.confirm("Are you sure you want to delete this pandal request?")
    ) {
      return;
    }

    try {
      setActionInProgress(pandalId);
      const response = await api.delete(`/pandals/${pandalId}`);

      if (response.ok) {
        await fetchPendingPandals();
      } else {
        setError("Failed to delete pandal");
      }
    } catch (err) {
      console.error("Error deleting pandal:", err);
      setError("Error deleting pandal. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#FDF5E6] flex items-center justify-center p-4 md:p-8">
      <div className="relative bg-linear-to-r from-[#FFCF67]/70 to-[#D3321D]/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] p-6 md:p-8">
        {/* Back Arrow */}
        <button
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 p-2 rounded-full text-[#4B2E2E] hover:bg-white/20 transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="overflow-y-auto max-h-[78vh] mt-8">
          <h1 className="font-bold italic text-3xl text-center text-[#4B2E2E] mb-6">
            Admin Panel - Pending Approval
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

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#B22222]"></div>
              <p className="mt-4 text-[#4B2E2E] font-semibold">
                Loading pending pandals...
              </p>
            </div>
          ) : pendingPandals.length === 0 ? (
            <div className="text-center py-12 bg-white/50 rounded-lg">
              <p className="text-[#4B2E2E] text-lg font-semibold">
                ✓ No pending requests - All pandals approved!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stats */}
              <div className="bg-white/60 rounded-lg p-4 mb-6 border border-white/20">
                <p className="text-[#4B2E2E] font-bold">
                  Pending Requests:{" "}
                  <span className="text-[#B22222] text-xl">
                    {pendingPandals.length}
                  </span>
                </p>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto bg-white/60 rounded-lg">
                <table className="w-full">
                  <thead className="bg-[#D3321D]/30">
                    <tr className="text-left text-[#4B2E2E]">
                      <th className="px-4 py-3 font-bold">Pandal Name</th>
                      <th className="px-4 py-3 font-bold">Zone</th>
                      <th className="px-4 py-3 font-bold">Address</th>
                      <th className="px-4 py-3 font-bold">Authority Email</th>
                      <th className="px-4 py-3 font-bold">Details</th>
                      <th className="px-4 py-3 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPandals.map((pandal) => (
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
                        <td className="px-4 py-3 text-[#4B2E2E] text-sm max-w-xs">
                          {pandal.address}
                        </td>
                        <td className="px-4 py-3 text-[#4B2E2E] text-sm">
                          {pandal.authorityEmail || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-[#4B2E2E] text-sm max-w-xs">
                          {pandal.details || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApprove(pandal.id)}
                              disabled={actionInProgress === pandal.id}
                              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(pandal.id)}
                              disabled={actionInProgress === pandal.id}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                              title="Reject"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {pendingPandals.map((pandal) => (
                  <div
                    key={pandal.id}
                    className="bg-white/60 rounded-lg p-4 border border-white/20"
                  >
                    <div className="mb-3">
                      <h3 className="font-bold text-[#4B2E2E] text-lg">
                        {pandal.name}
                      </h3>
                      <div className="text-sm text-[#7f1b1b] space-y-1 mt-2">
                        <p>
                          <strong>Zone:</strong> {pandal.zone}
                        </p>
                        <p>
                          <strong>Authority:</strong>{" "}
                          {pandal.authorityEmail || "N/A"}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[#4B2E2E] mb-2">
                      <strong>Address:</strong> {pandal.address}
                    </p>

                    {pandal.details && (
                      <p className="text-sm text-[#4B2E2E] mb-3">
                        <strong>Details:</strong> {pandal.details}
                      </p>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(pandal.id)}
                        disabled={actionInProgress === pandal.id}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-all duration-300 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDelete(pandal.id)}
                        disabled={actionInProgress === pandal.id}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all duration-300 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                      >
                        <Trash2 size={18} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
