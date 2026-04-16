import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";
import { FaHome, FaDollarSign, FaInfoCircle } from "react-icons/fa";

const MySoldProperties = () => {
  const { user, loading } = useContext(AuthContext);
  const [paidProperties, setPaidProperties] = useState([]);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(false);

  // Fetch paid offers by agent email
  const fetchPaidOffers = async (agentEmail) => {
    setFetching(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/requested-properties`, {
        params: { agentEmail },
      });
      const paidOffers = res.data.filter(
        (offer) => offer.status?.toLowerCase() === "paid"
      );
      setPaidProperties(paidOffers);
    } catch (err) {
      setError("Failed to load paid properties. Please try again.");
      setPaidProperties([]);
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  // Load paid offers when user or loading changes
  useEffect(() => {
    if (!loading && user?.email) {
      fetchPaidOffers(user.email);
    } else {
      setPaidProperties([]);
    }
  }, [user, loading]);

  if (loading || fetching)
    return (
      <p className="text-center text-lg text-gray-500 animate-pulse mt-10">
        Loading paid properties...
      </p>
    );

  if (!user || !user.email)
    return (
      <p className="text-center text-gray-600 mt-10">
        Please log in to see your paid properties.
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 font-semibold mt-10">{error}</p>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-green-800 border-b-2 border-green-300 pb-3">
        My Paid Properties
      </h2>
      {paidProperties.length === 0 ? (
        <p className="text-center text-gray-600">No paid properties found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-100">
              <th className="border border-gray-300 px-4 py-2">Property Title</th>
              <th className="border border-gray-300 px-4 py-2">Location</th>
              <th className="border border-gray-300 px-4 py-2">Buyer Email</th>
              <th className="border border-gray-300 px-4 py-2">Buyer Name</th>
              <th className="border border-gray-300 px-4 py-2">Offered Price</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {paidProperties.map((offer) => (
              <tr key={offer._id}>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <FaHome className="text-green-600" />
                    {offer.property?.title || "N/A"}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{offer.property?.location || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{offer.userEmail || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{offer.buyerName || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <FaDollarSign className="text-yellow-500" />
                    ${offer.offerPrice}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 capitalize">
                  <span className="font-semibold text-purple-600 flex items-center gap-2">
                    <FaInfoCircle />
                    Paid
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySoldProperties;