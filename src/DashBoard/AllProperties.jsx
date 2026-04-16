import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(""); 

  const navigate = useNavigate();


  const fetchProperties = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/properties`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          const reversed = [...data].reverse();
          setProperties(reversed);
          setFilteredProperties(reversed);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProperties();
  }, [navigate]);

  // Extract numeric value from priceRange (e.g., "$1000 - $2000")
  const getPriceValue = (priceRange) => {
    if (!priceRange) return 0;
    const match = priceRange.match(/\d+/g);
    return match ? parseInt(match[0]) : 0;
  };

  // Filter & Sort
  useEffect(() => {
    let tempProperties = [...properties];

    // Filter by location
    if (searchTerm.trim() !== "") {
      tempProperties = tempProperties.filter((prop) =>
        prop.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by price
    if (sortOrder === "asc") {
      tempProperties.sort(
        (a, b) => getPriceValue(a.priceRange) - getPriceValue(b.priceRange)
      );
    } else if (sortOrder === "desc") {
      tempProperties.sort(
        (a, b) => getPriceValue(b.priceRange) - getPriceValue(a.priceRange)
      );
    }

    setFilteredProperties(tempProperties);
  }, [searchTerm, sortOrder, properties]);

  if (loading) return <div className="text-center py-8">Loading properties...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        All Verified Properties
      </h2>

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by location..."
          className="border border-gray-300 rounded px-4 py-2 flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border border-gray-300 rounded px-4 py-2"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProperties.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No properties found.</p>
        ) : (
          filteredProperties.map((prop) => (
            <div
              key={prop._id}
              className="border rounded-lg shadow-md p-4 flex flex-col bg-white"
            >
              <img
                src={prop.imageUrl || "/default-property.jpg"}
                alt={prop.title || "Property image"}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-3">{prop.title}</h3>
              <p className="text-gray-700 text-sm mt-1">
                <strong>Location:</strong> {prop.location}
              </p>
              <p className="text-gray-700 text-sm mt-1">
                <strong>Price Range:</strong> {prop.priceRange}
              </p>
              <p className="mt-1 text-sm">
                <strong>Status:</strong>{" "}
                {prop.status === "verified" ? (
                  <span className="text-green-600 font-semibold">Verified</span>
                ) : prop.status === "rejected" ? (
                  <span className="text-red-600 font-semibold">Rejected</span>
                ) : (
                  <span className="text-yellow-600 font-semibold">Pending</span>
                )}
              </p>
              <button
                onClick={() => navigate(`/property-details/${prop._id}`)}
                className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllProperties;
