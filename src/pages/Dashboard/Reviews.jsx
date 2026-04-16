import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Reviews = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [myReviews, setMyReviews] = useState([]);

  // Fetch all reviews by logged-in user
  const fetchReviews = async () => {
    if (!user?.email) return;
    try {
      const res = await axiosSecure.get(`/reviews/user/${user.email}`);
      setMyReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      Swal.fire("Error!", err.response?.data?.error || "Failed to load reviews.", "error");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user?.email]);

  // Handle delete review
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const previous = [...myReviews];
      setMyReviews(myReviews.filter((review) => review._id !== id));
      try {
        const res = await axiosSecure.delete(`/reviews/${id}`);
        if (res.data?.success) {
          Swal.fire("Deleted!", "Your review has been deleted.", "success");
        } else {
          setMyReviews(previous);
          Swal.fire("Error!", "Review not found or already deleted.", "error");
        }
      } catch (err) {
        console.error(err);
        setMyReviews(previous);
        Swal.fire("Error!", err.response?.data?.error || "Failed to delete review.", "error");
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">My Reviews</h2>
      {myReviews.length === 0 ? (
        <p className="text-gray-600">You haven’t added any reviews yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {myReviews.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded shadow space-y-2 border">
              <h3 className="text-xl font-semibold">{review.propertyTitle || "Property"}</h3>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Reviewed:</span>{" "}
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleString()
                  : "Unknown date"}
              </p>
              <p className="text-gray-700">{review.comment || "No comment"}</p>
              <button
                onClick={() => handleDelete(review._id)}
                className="mt-2 px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
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

export default Reviews;
