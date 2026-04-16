import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const AdvertiseProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const fetchVerifiedProperties = async () => {
    setLoading(true);
    try {
      // Assuming backend supports query param ?status=verified
      const res = await axiosSecure.get("/properties?status=verified");
      setProperties(res.data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error(error.response?.data?.error || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedProperties();
  }, [axiosSecure]);

  const handleAdvertiseClick = (propertyId) => {
    // Here you can add logic for what happens when clicking Advertise button
    // For example, open a modal, or call an API to set advertise flag, etc.
    toast.success(`Advertise clicked for property ID: ${propertyId}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Advertise Properties</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading properties...</p>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray-600">No verified properties found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b">Image</th>
                <th className="py-3 px-4 border-b">Title</th>
                <th className="py-3 px-4 border-b">Price Range</th>
                <th className="py-3 px-4 border-b">Agent Name</th>
                <th className="py-3 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <img
                      src={property.imageUrl || "/default-property.jpg"}
                      alt={property.title || "Property"}
                      className="w-20 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{property.title || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{property.priceRange || "N/A"}</td>
                  <td className="py-2 px-4 border-b">
                    {property.agent?.name || property.agentName || "Unknown"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleAdvertiseClick(property._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm"
                    >
                      Advertise
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdvertiseProperty;
