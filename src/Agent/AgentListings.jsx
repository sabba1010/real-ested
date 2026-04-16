import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";

const AgentListings = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  // Fetch listings after user is confirmed
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const email = user?.email;
        if (!email) return;

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/properties?agentEmail=${email}`
        );
        setListings(res.data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchListings();
  }, [user]);

  // Handle Delete Property
  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/properties/${id}`);
        if (res.status === 200 || res.status === 204) {
          Swal.fire("Deleted!", "Your property has been deleted.", "success");
          setListings((prev) => prev.filter((property) => property._id !== id));
        } else {
          Swal.fire("Failed!", "Failed to delete property.", "error");
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  // Loading state
  if (loading) {
    return <div className="text-center py-8">Loading listings...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-green-700 mb-4">My Property Listings</h2>

      {listings.length === 0 ? (
        <p className="text-gray-600">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4 flex flex-col"
            >
              <img
                src={property.imageUrl || "https://via.placeholder.com/300x200"}
                onError={(e) => (e.target.src = "https://via.placeholder.com/300x200")}
                alt={property.title}
                className="h-40 w-full object-cover rounded mb-3"
              />

              <h3 className="text-xl font-semibold">{property.title}</h3>
              <p className="text-gray-600 mb-1">Location: {property.location}</p>
              <p className="text-gray-600 mb-1">Price Range: {property.priceRange}</p>

              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Agent Name:</span> {property.agentName || "N/A"}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Agent Email:</span> {property.agentEmail || "N/A"}
              </p>

              <p className="text-sm text-gray-500 mb-4">
                Status:{" "}
                <span
                  className={
                    property.status === "verified"
                      ? "text-green-600 font-semibold"
                      : property.status === "rejected"
                      ? "text-red-600 font-semibold"
                      : "text-yellow-600 font-semibold"
                  }
                >
                  {property.status || "pending"}
                </span>
              </p>

              <button
                onClick={() => handleDelete(property._id)}
                className="mt-auto py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentListings;
