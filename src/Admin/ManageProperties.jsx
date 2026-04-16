import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/properties`);
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties", error);
      Swal.fire("Error", "Failed to load properties", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const updateStatus = async (id, status) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to mark this property as "${status}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "verified" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${status} it!`,
    });

    if (!result.isConfirmed) return;

    setUpdatingId(id);
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/properties/${id}/status`, { status });
      await fetchProperties();
      Swal.fire("Success", `Property marked as "${status}"`, "success");
    } catch (error) {
      console.error("Failed to update property status", error);
      Swal.fire("Error", "Failed to update property status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Manage Properties</h2>
      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Location</th>
              <th className="border p-2 text-left">Agent Name</th>
              <th className="border p-2 text-left">Agent Email</th>
              <th className="border p-2 text-left">Price Range</th>
              <th className="border p-2 text-left">Status / Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="border p-2">{p.title}</td>
                <td className="border p-2">{p.location}</td>
                <td className="border p-2">{p.agentName || "N/A"}</td>
                <td className="border p-2">{p.agentEmail}</td>
                <td className="border p-2">{p.priceRange}</td>
                <td className="border p-2">
                  {p.status === "verified" ? (
                    <span className="text-green-600 font-semibold">Verified</span>
                  ) : p.status === "rejected" ? (
                    <span className="text-red-600 font-semibold">Rejected</span>
                  ) : (
                    <>
                      <button
                        onClick={() => updateStatus(p._id, "verified")}
                        disabled={updatingId === p._id}
                        className={`mr-2 px-3 py-1 rounded text-white ${
                          updatingId === p._id
                            ? "bg-green-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => updateStatus(p._id, "rejected")}
                        disabled={updatingId === p._id}
                        className={`px-3 py-1 rounded text-white ${
                          updatingId === p._id
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageProperties;
