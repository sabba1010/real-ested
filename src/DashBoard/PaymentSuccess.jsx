import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosSecure from "../hooks/useAxiosSecure"; // path thik ache to?

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const offerId = searchParams.get("offerId");
  const axiosSecure = useAxiosSecure(); // ✅ fixed

  useEffect(() => {
    if (sessionId && offerId) {
      axiosSecure
        .patch(`/offers/${offerId}`, { status: "paid" })
        .then((res) => {
          if (res.data.modifiedCount > 0) {
            toast.success("Payment completed & status updated!");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Payment success, but status update failed.");
        });
    }
  }, [sessionId, offerId, axiosSecure]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Payment Successful</h2>
      <p>Your payment has been processed. Thank you for your purchase!</p>
      <a href="/dashboard/Offer" className="text-blue-600 hover:underline">
        Back to My Offers
      </a>
    </div>
  );
};

export default PaymentSuccess;
