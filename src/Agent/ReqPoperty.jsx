import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";
import Swal from "sweetalert2";

const ReqProperty = () => {
  const { user, loading } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch offers by agent email
  const fetchOffers = async (agentEmail) => {
    setFetching(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/requested-properties`, {
        params: { agentEmail },
      });
      setOffers(res.data);
    } catch (err) {
      setError("Failed to load offers. Please try again.");
      setOffers([]);
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  // Handle Accept/Reject
  const handleStatusChange = async (offerId, propertyId, newStatus) => {
    const actionText = newStatus === "accepted" ? "Accept" : "Reject";

    const confirmResult = await Swal.fire({
      title: `${actionText} this offer?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} this offer?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (confirmResult.isConfirmed) {
      setUpdating(true);
      try {
        const res = await axios.patch(`${import.meta.env.VITE_API_URL}/requested-properties/${offerId}`, {
          status: newStatus,
          propertyId,
        });

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: `Offer ${newStatus}!`,
            timer: 1500,
            showConfirmButton: false,
          });
          // Update offers locally to avoid refetch
          setOffers((prev) =>
            prev.map((offer) =>
              offer._id === offerId ? { ...offer, status: newStatus } : offer
            )
          );
        } else {
          Swal.fire("Error", "Failed to update offer status.", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Error updating offer status.", "error");
      } finally {
        setUpdating(false);
      }
    }
  };

  useEffect(() => {
    if (!loading && user?.email) {
      fetchOffers(user.email);
    } else {
      setOffers([]);
    }
  }, [user, loading]);

  if (loading || fetching)
    return (
      <p className="text-center text-lg text-gray-500 animate-pulse mt-10">
        Loading offers...
      </p>
    );

  if (!user || !user.email)
    return (
      <p className="text-center text-gray-600 mt-10">
        Please log in to see your offers.
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 font-semibold mt-10">{error}</p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-green-800 border-b-2 border-green-300 pb-3">
        Requested / Offered Properties
      </h2>
      {offers.length === 0 ? (
        <p className="text-center text-gray-600">No offers found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-100 text-left">
              <th className="border border-gray-300 px-4 py-2">Property Title</th>
              <th className="border border-gray-300 px-4 py-2">Location</th>
              <th className="border border-gray-300 px-4 py-2">Buyer Name</th>
              <th className="border border-gray-300 px-4 py-2">Buyer Email</th>
              <th className="border border-gray-300 px-4 py-2">Offered Price</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => {
              const status = (offer.status || "pending").toLowerCase();
              return (
                <tr key={offer._id}>
                  <td className="border border-gray-300 px-4 py-2">{offer.property?.title || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{offer.property?.location || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{offer.buyerName || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{offer.userEmail || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">${offer.offerPrice}</td>
                  <td className="border border-gray-300 px-4 py-2 capitalize font-semibold"
                      style={{color: status === "accepted" ? "green" : status === "rejected" ? "red" : "orange"}}
                  >
                    {status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(offer._id, offer.property?._id, "accepted")}
                          disabled={updating}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(offer._id, offer.property?._id, "rejected")}
                          disabled={updating}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="capitalize font-semibold">
                        {status}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReqProperty;
