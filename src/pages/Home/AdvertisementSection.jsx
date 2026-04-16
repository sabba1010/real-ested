import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const AdvertisementSection = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/properties");
      const latestProperties = [...res.data].reverse().slice(0, 4);
      setProperties(latestProperties);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      toast.error(err.response?.data?.error || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [axiosSecure]);

  const handleDetailsClick = (id) => {
    navigate(`/property-details/${id}`);
  };

  return (
    <section className="px-4 py-12 max-w-7xl mx-auto bg-slate-50 rounded-[2rem] shadow-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-green-600 font-semibold mb-2">
            Explore top listings
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Properties
          </h2>
        </div>
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center justify-center rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          View All Properties
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600 text-center">Loading properties...</p>
      ) : properties.length === 0 ? (
        <p className="text-gray-600 text-center">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 h-full"
            >
              <img
                src={property.imageUrl || "/default-property.jpg"}
                alt={property.title || "Property"}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="flex flex-col justify-between flex-grow p-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {property.title || "Unnamed Property"}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    📍 {property.location || "Unknown"}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    💰 {property.priceRange || "N/A"}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Status:{" "}
                    <span
                      className={`${
                        property.status === "verified"
                          ? "text-green-600"
                          : property.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      } font-medium`}
                    >
                      {property.status
                        ? property.status.charAt(0).toUpperCase() +
                          property.status.slice(1)
                        : "Pending"}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => handleDetailsClick(property._id)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdvertisementSection;
