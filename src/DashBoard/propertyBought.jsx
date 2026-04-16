import React, { useEffect, useState, useContext } from "react";
import { FaHome, FaDollarSign, FaClock, FaInfoCircle } from "react-icons/fa";
import AuthContext from "../contexts/AuthContext";

const PropertyBought = () => {
  const { user } = useContext(AuthContext);
  const [paidProperties, setPaidProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaidOffers = async () => {
    if (!user?.email) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/offers?email=${encodeURIComponent(user.email)}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${await user.getIdToken()}` },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch paid properties");
      }
      const data = await res.json();
      const paidOffers = data.filter((offer) => offer.status?.toLowerCase() === "paid");
      setPaidProperties(paidOffers);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Could not load paid properties. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidOffers();
  }, [user?.email]);

  if (loading) {
    return (
      <p className="text-center text-lg text-gray-500 animate-pulse mt-10">
        Loading your paid properties...
      </p>
    );
  }
  if (error) {
    return <p className="text-center text-red-600 font-semibold mt-10">{error}</p>;
  }
  if (paidProperties.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-10">
        You have no paid properties yet.
      </p>
    );
  }

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-green-800 border-b-2 border-green-300 pb-3">
        My Paid Properties
      </h2>
      <ul className="space-y-6">
        {paidProperties.map((offer) => (
          <li
            key={offer._id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row md:items-center transition-transform hover:scale-[1.02]"
          >
           
            <div className="space-y-2 md:flex-1">
              <p className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <FaHome className="text-green-600" /> {offer.property?.title || "N/A"}
              </p>
              <p className="text-sm text-gray-600">{offer.property?.location || "N/A"}</p>
              <p className="text-sm">
                Agent: <span className="font-medium">{offer.agentName || "Unknown"}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-700 font-medium">
                <FaDollarSign className="text-yellow-500" /> Offer Price:{" "}
                <span className="text-gray-900">${offer.offerPrice}</span>
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <FaInfoCircle className="text-purple-600" /> Status: Paid
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <FaClock /> Paid on: {new Date(offer.createdAt).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PropertyBought;