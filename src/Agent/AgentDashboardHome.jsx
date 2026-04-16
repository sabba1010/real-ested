import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

const AgentDashboardHome = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [totalListings, setTotalListings] = useState(0);
  const [soldListings, setSoldListings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder values
  const newOffers = 3;
  const profileCompletion = 80;
  const wishlistSaves = 17;

  useEffect(() => {
    if (!user?.email) return;

    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/properties?agentEmail=${encodeURIComponent(user.email)}`
        );

        const properties = response.data || [];

        const active = properties.filter(p => p.status === "available").length;
        const sold = properties.filter(p => p.status === "sold").length;

        setTotalListings(active);
        setSoldListings(sold);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Agent Dashboard</h1>
      <p className="text-gray-700 mb-8">
        Welcome {user?.displayName || "Agent"}! Here’s your activity summary.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading your data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Active Listings */}
          <Card title="Active Listings" value={totalListings} color="green" />

          {/* Sold Properties */}
          <Card title="Sold Properties" value={soldListings} color="purple" />

          {/* New Offers */}
          <Card title="New Offers" value={newOffers} color="blue" />

          {/* Wishlist Saves */}
          <Card title="Wishlist Saves" value={wishlistSaves} color="pink" />

          {/* Profile Completion */}
          <section className="bg-white p-6 rounded-lg shadow border border-green-200 col-span-1 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-3 text-green-700">Profile Status</h2>
            <p className="text-gray-600 text-sm mb-2">
              Your profile is <strong>{profileCompletion}%</strong> complete.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

// Reusable card component
const Card = ({ title, value, color }) => {
  const colorMap = {
    green: "text-green-700 border-green-200",
    blue: "text-blue-700 border-blue-200",
    pink: "text-pink-700 border-pink-200",
    purple: "text-purple-700 border-purple-200",
  };

  return (
    <section className={`bg-white p-6 rounded-lg shadow border ${colorMap[color] || ""}`}>
      <h2 className={`text-xl font-semibold mb-3 ${colorMap[color]?.split(" ")[0]}`}>
        {title}
      </h2>
      <p className="text-gray-600 text-sm">
        <strong className="text-2xl">{value}</strong>
      </p>
    </section>
  );
};

export default AgentDashboardHome;
