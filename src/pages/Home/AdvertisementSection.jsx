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
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 rounded-[2rem] shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-green-600 font-semibold mb-2">
              Explore top listings
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl leading-relaxed">
              Browse the newest high-quality properties and discover verified homes with transparent pricing.
            </p>
          </div>
          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            View All Properties
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center py-12">Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="text-gray-600 text-center py-12">No properties found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl h-full"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.imageUrl || '/default-property.jpg'}
                    alt={property.title || 'Property'}
                    className="w-full h-52 object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    {property.priceRange || 'Price N/A'}
                  </span>
                </div>
                <div className="flex flex-col justify-between flex-1 p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 truncate">
                      {property.title || 'Unnamed Property'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-3">📍 {property.location || 'Unknown location'}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                        {property.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : 'Pending'}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                        {property.category || 'Residential'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDetailsClick(property._id)}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdvertisementSection;
