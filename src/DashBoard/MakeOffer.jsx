import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthContext from "../contexts/AuthContext";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const MakeOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerAmount, setOfferAmount] = useState("");
  const [buyingDate, setBuyingDate] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    console.log("MakeOffer: Property ID from useParams:", id);
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Invalid Property ID",
        text: "No property ID provided.",
      });
      navigate("/dashboard/wishlist");
      return;
    }

    if (!user?.email) {
      Swal.fire({ icon: "warning", title: "Please login to make an offer" });
      navigate("/login");
      return;
    }

    axiosSecure
      .get(`/properties/${id}`)
      .then((res) => {
        console.log("Property data:", res.data);
        setProperty(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Get property error:", err);
        Swal.fire({ icon: "error", title: err.response?.data?.error || "Failed to load property" });
        setLoading(false);
        navigate("/dashboard/wishlist");
      });
  }, [id, user, navigate, axiosSecure]);

  useEffect(() => {
    if (offerAmount) {
      axiosSecure
        .post("/create-payment-intent", { amount: parseFloat(offerAmount) })
        .then((res) => {
          console.log("Payment intent created:", res.data);
          setClientSecret(res.data.clientSecret);
        })
        .catch((err) => {
          console.error("Payment intent error:", err);
          Swal.fire({ icon: "error", title: err.response?.data?.error || "Failed to initialize payment" });
        });
    }
  }, [offerAmount, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      Swal.fire({ icon: "error", title: "Payment system not ready" });
      return;
    }

    try {
      const userRes = await axiosSecure.get(`/users/${user.email}`);
      console.log("User role:", userRes.data.role);
      if (userRes.data.role === "agent" || userRes.data.role === "admin") {
        Swal.fire({ icon: "error", title: "Agents and admins cannot submit offers" });
        return;
      }
    } catch (err) {
      console.error("User verification error:", err);
      Swal.fire({ icon: "error", title: err.response?.data?.error || "Failed to verify user" });
      return;
    }

    // Handle invalid priceRange (e.g., "4343")
    let minPrice, maxPrice;
    if (property.priceRange.includes("-")) {
      [minPrice, maxPrice] = property.priceRange.replace(/[^0-9-]/g, "").split("-").map(Number);
    } else {
      const price = Number(property.priceRange);
      minPrice = price * 0.9; // Allow 10% below
      maxPrice = price * 1.1; // Allow 10% above
    }

    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount < minPrice || amount > maxPrice) {
      Swal.fire({
        icon: "error",
        title: `Offer amount must be between $${minPrice.toFixed(2)} and $${maxPrice.toFixed(2)}`,
      });
      return;
    }

    if (!buyingDate) {
      Swal.fire({ icon: "error", title: "Please select a buying date" });
      return;
    }

    setPaymentLoading(true);

    const card = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: { email: user.email, name: user.name },
      },
    });

    if (error) {
      console.error("Stripe payment error:", error);
      Swal.fire({ icon: "error", title: error.message });
      setPaymentLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      try {
        await axiosSecure.post("/offers", {
          propertyId: id,
          userEmail: user.email,
          userName: user.name || "Anonymous",
          offerAmount: amount,
          buyingDate,
        });
        Swal.fire({ icon: "success", title: "Offer submitted successfully!" });
        navigate("/dashboard/property-bought");
      } catch (err) {
        console.error("Submit offer error:", err);
        Swal.fire({ icon: "error", title: err.response?.data?.error || "Failed to submit offer" });
      }
    } else {
      Swal.fire({ icon: "error", title: "Payment failed" });
    }

    setPaymentLoading(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600 font-semibold">Loading...</div>;
  }

  if (!property) {
    return (
      <div className="text-center py-12 text-red-600 font-semibold">Property not found.</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6">Make an Offer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Property Title</label>
          <input
            type="text"
            value={property.title}
            readOnly
            className="mt-1 block w-full border-gray-300 rounded-md p-2 bg-gray-100"
            aria-label="Property title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Property Location</label>
          <input
            type="text"
            value={property.location}
            readOnly
            className="mt-1 block w-full border-gray-300 rounded-md p-2 bg-gray-100"
            aria-label="Property location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Agent Name</label>
          <input
            type="text"
            value={property.agentName}
            readOnly
            className="mt-1 block w-full border-gray-300 rounded-md p-2 bg-gray-100"
            aria-label="Agent name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Offer Amount ($)</label>
          <input
            type="number"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            placeholder={`Enter amount between ${property.priceRange}`}
            className="mt-1 block w-full border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Offer amount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Buyer Email</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="mt-1 block w-full border-gray-300 rounded-md p-2 bg-gray-100"
            aria-label="Buyer email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Buyer Name</label>
          <input
            type="text"
            value={user.name || "Anonymous"}
            readOnly
            className="mt-1 block w-full border-gray-300 rounded-md p-2 bg-gray-100"
            aria-label="Buyer name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Buying Date</label>
          <input
            type="date"
            value={buyingDate}
            onChange={(e) => setBuyingDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Buying date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Details</label>
          <CardElement
            className="mt-1 block w-full border-gray-300 rounded-md p-2 bg-white"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!stripe || paymentLoading}
          className={`w-full py-3 rounded font-semibold text-white ${
            paymentLoading || !stripe
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          aria-label="Submit offer"
        >
          {paymentLoading ? "Processing..." : "Submit Offer"}
        </button>
      </form>
    </div>
  );
};

export default MakeOffer;