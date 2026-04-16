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
    <section className="py-16 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-2xl border border-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8 border-b border-slate-200 pb-8 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-600 font-semibold mb-2">
                Explore top listings
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-950">
                Featured Properties
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Browse the newest high-quality properties and discover verified homes with transparent pricing.
              </p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700"
            >
              View All Properties
            </button>
          </div>

          {loading ? (
            <p className="text-slate-600 text-center py-12">Loading properties...</p>
          ) : properties.length === 0 ? (
            <p className="text-slate-600 text-center py-12">No properties found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl h-full"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={property.imageUrl || '/default-property.jpg'}
                      alt={property.title || 'Property'}
                      className="w-full h-60 object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 top-0 flex justify-between p-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-800 shadow-sm">
                        {property.priceRange || 'Price N/A'}
                      </span>
                      <span className="rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
                        {property.status ? property.status.slice(0, 10) : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between flex-1 p-6">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 truncate">
                        {property.title || 'Unnamed Property'}
                      </h3>
                      <p className="text-sm text-slate-500 mt-3">📍 {property.location || 'Unknown location'}</p>
                      <p className="text-sm text-slate-500 mt-2">
                        {property.category ? property.category : 'Residential'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDetailsClick(property._id)}
                      className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdvertisementSection;
