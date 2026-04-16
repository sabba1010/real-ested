import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`;

const MyProperties = ({ currentUser }) => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  // Agent's email to filter properties
  const agentEmail = currentUser?.email;

  useEffect(() => {
    if (!agentEmail) return;

    // Fetch properties added by this agent
    fetch(`${API_URL}/properties?agentEmail=${agentEmail}`)
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error(err));
  }, [agentEmail]);

  // Delete property with confirmation
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This property will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_URL}/properties/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Property has been deleted.", "success");
              setProperties(properties.filter((p) => p._id !== id));
            } else {
              Swal.fire("Failed!", "Could not delete property.", "error");
            }
          })
          .catch(() => {
            Swal.fire("Error!", "Something went wrong.", "error");
          });
      }
    });
  };

  // Navigate to update form with property id
  const handleUpdate = (id) => {
    navigate(`/update-property/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Added Properties</h1>
      {properties.length === 0 && (
        <p className="text-gray-600">No properties found.</p>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => {
          // Calculate min and max price from priceRange string, e.g. "$100k - $150k"
          let minPrice = "-";
          let maxPrice = "-";
          if (property.priceRange) {
            const prices = property.priceRange
              .replace(/\$/g, "")
              .replace(/k/gi, "000")
              .split("-")
              .map((p) => p.trim());
            if (prices.length === 2) {
              minPrice = prices[0];
              maxPrice = prices[1];
            }
          }

          return (
            <div
              key={property._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              <img
                src={property.imageUrl || "https://via.placeholder.com/400x250"}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-1">{property.title}</h2>
                <p className="text-gray-600 mb-1">{property.location}</p>
                <div className="flex items-center mb-2 space-x-3">
                  <img
                    src={property.agentImage || "https://via.placeholder.com/40"}
                    alt={property.agentName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="text-gray-800 font-medium">{property.agentName}</p>
                </div>
                <p className="mb-1">
                  <span className="font-semibold">Verification Status:</span>{" "}
                  <span
                    className={
                      property.status === "verified"
                        ? "text-green-600 font-bold"
                        : property.status === "rejected"
                        ? "text-red-600 font-bold"
                        : "text-yellow-600 font-bold"
                    }
                  >
                    {property.status || "pending"}
                  </span>
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Price Range:</span>{" "}
                  {property.priceRange}
                </p>
                <p className="mb-3">
                  <span className="font-semibold">Min Price:</span> ${minPrice}{" "}
                  <span className="ml-4 font-semibold">Max Price:</span> ${maxPrice}
                </p>

                <div className="flex space-x-3">
                  {/* Update Button only if not rejected */}
                  {property.status !== "rejected" && (
                    <button
                      onClick={() => handleUpdate(property._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Update
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(property._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyProperties;
