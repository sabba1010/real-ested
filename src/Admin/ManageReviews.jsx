import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import AuthContext from "../contexts/AuthContext";
import useAxiosSecure from "../hooks/useAxiosSecure";

const ManageReviews = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const { data } = await axiosSecure.get(`/reviews?email=${user.email}`);
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axiosSecure.delete(`/reviews/${id}`);
        if (data.deletedCount) {
          setReviews((prevReviews) => prevReviews.filter((review) => review._id !== id));
          Swal.fire("Deleted!", "Your review has been deleted.", "success");
        } else {
          Swal.fire("Oops!", "Review could not be deleted.", "error");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error!", "Failed to delete review.", "error");
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          You haven't submitted any reviews yet. Share your feedback to help others!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-green-300 to-green-400 text-green-900 font-semibold uppercase tracking-wide">
                <th className="py-3 px-6 border-r border-green-400 text-left">User Email</th>
                <th className="py-3 px-6 border-r border-green-400 text-left">Property</th>
                <th className="py-3 px-6 border-r border-green-400 text-left">Agent</th>
                <th className="py-3 px-6 border-r border-green-400 text-left">Comment</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, idx) => (
                <tr
                  key={review._id}
                  className={`${idx % 2 === 0 ? "bg-green-50" : "bg-white"} hover:bg-green-100 transition-colors duration-200`}
                >
                  <td className="py-4 px-6 border-r border-green-300">{review.userEmail || "-"}</td>
                  <td className="py-4 px-6 border-r border-green-300">{review.propertyTitle}</td>
                  <td className="py-4 px-6 border-r border-green-300">{review.agentName || "-"}</td>
                  <td className="py-4 px-6 border-r border-green-300 max-w-xs truncate" title={review.comment}>
                    {review.comment}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded shadow-md transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
