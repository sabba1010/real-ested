import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";

const UserHome = () => {
  const { user } = useContext(AuthContext); // Logged-in user info
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/my-properties?email=${user.email}`
        );

        setListings(response.data);
      } catch (err) {
        setError("Failed to load listings.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="text-center mt-8">
        <p>Loading your listings...</p>
        {/* You can add a spinner here if you want */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-600">
        <p>No listings found for your account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-4">User Home / My Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((property) => (
          <div
            key={property._id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
            <p>Location: {property.location}</p>
            <p>Price: ${property.price.toLocaleString()}</p>
            {/* Add more details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHome;
