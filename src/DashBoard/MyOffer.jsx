import React, { useEffect, useState, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import AuthContext from "../contexts/AuthContext";
import { FaTrashAlt, FaDollarSign, FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const MyOffer = () => {
  const { user } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Fetch Offers
  const fetchOffers = async () => {
    if (!user?.email) {
      setError("User not logged in");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/offers?email=${encodeURIComponent(user.email)}`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch offers");
      }
      const data = await res.json();
      setOffers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Appointments
  const fetchAppointments = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/appointments?email=${encodeURIComponent(user.email)}`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch appointments");
      }
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Confirm Payment from query params (optional)
  const confirmPayment = async (sessionId, offerId, amount) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({ offerId, sessionId, amount, userEmail: user.email }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to confirm payment");
      toast.success("Payment recorded successfully!");
      await Promise.all([fetchOffers(), fetchAppointments()]);
    } catch (err) {
      toast.error(err.message || "Failed to record payment");
      await fetchOffers();
    }
  };

  // Delete Offer with SweetAlert confirmation
  const handleDelete = async (offerId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/offers/${offerId}`, {
          method: "DELETE",
          credentials: "include",
          headers: { Authorization: `Bearer ${await user.getIdToken()}` },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to delete offer");
        }
        toast.success("Offer deleted successfully");
        setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  // Make Payment: update status instantly, then redirect to Stripe
const handleMakePayment = async (offerId, amount) => {
  try {
    if (!offerId || isNaN(amount) || amount <= 0) return; // silently ignore invalid input

    // Update status immediately
    const statusRes = await fetch(`${import.meta.env.VITE_API_URL}/offers/${offerId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      credentials: "include",
      body: JSON.stringify({ status: "paid" }),
    });
    if (!statusRes.ok) return; // silently ignore failure

    // Update frontend state instantly
    setOffers((prev) =>
      prev.map((offer) => (offer._id === offerId ? { ...offer, status: "paid" } : offer))
    );

    // Create Stripe checkout session
    const stripe = await stripePromise;
    if (!stripe) return; // silently ignore failure

    const res = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: JSON.stringify({ offerId, amount }),
      credentials: "include",
    });

    if (!res.ok) return; // silently ignore failure

    const data = await res.json();

    window.location.href = data.url;
  } catch {
    // silently ignore all errors
  }
};


  useEffect(() => {
    if (user?.email) {
      fetchOffers();
      fetchAppointments();
    }

    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session_id");
    const offerId = query.get("offer_id");
    const amount = parseFloat(query.get("amount"));

    if (sessionId && offerId && !isNaN(amount)) {
      confirmPayment(sessionId, offerId, amount);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [user, location]);

  if (loading) return <p className="text-center p-4">Loading offers...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

  // ... baki code same thakbe

return (
  <section className="max-w-5xl mx-auto p-6">
    <h2 className="text-2xl font-bold mb-6">My Offers</h2>
    {offers.filter(offer => (offer.status || "pending").toLowerCase() !== "paid").length === 0 ? (
      <p className="text-center">No offers found.</p>
    ) : (
      <ul className="space-y-6">
        {offers
          .filter(offer => (offer.status || "pending").toLowerCase() !== "paid")
          .map((offer) => {
            const appointment = appointments.find((appt) => appt.offerId === offer._id);
            const status = (offer.status || "pending").toLowerCase();

            return (
              <li
                key={offer._id}
                className="border rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                {/* rest of the render remains unchanged */}
                <div className="flex flex-col space-y-1 md:flex-row md:space-x-4 md:items-center md:space-y-0 md:flex-1">
            
                  <div>
                    <h3 className="text-lg font-semibold">
                      {offer.property?.title || "Unknown Property"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {offer.property?.location || "Unknown Location"}
                    </p>
                    <p className="text-sm">
                      Agent: <span className="font-medium">{offer.agentName || "Unknown"}</span>
                    </p>
                    <p className="text-sm">
                      Offer Amount:{" "}
                      <span className="font-semibold text-green-700">${offer.offerPrice}</span>
                    </p>
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          status === "accepted"
                            ? "text-green-600"
                            : status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {offer.status || "Pending"}
                      </span>
                    </p>
                    {appointment && (
                      <p className="text-sm mt-2">
                        <FaCalendarAlt className="inline mr-1" />
                        Appointment Scheduled:{" "}
                        {new Date(appointment.appointmentDate).toLocaleString()} with{" "}
                        {appointment.agentName || "Unknown Agent"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-4">
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    aria-label="Delete offer"
                    title="Delete offer"
                  >
                    <FaTrashAlt /> <span>Delete</span>
                  </button>
                  {status === "accepted" && (
                    <button
                      onClick={() => handleMakePayment(offer._id, offer.offerPrice)}
                      className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      aria-label="Make payment"
                      title="Make payment"
                      disabled={!offer.offerPrice || isNaN(offer.offerPrice) || offer.offerPrice <= 0}
                    >
                      <FaDollarSign /> <span>Make Payment</span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
      </ul>
    )}
  </section>
);

};

export default MyOffer;
