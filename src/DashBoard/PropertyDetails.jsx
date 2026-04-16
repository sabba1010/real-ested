import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthContext from "../contexts/AuthContext";
import useAxiosSecure from "../hooks/useAxiosSecure";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;
  const axiosSecure = useAxiosSecure();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [addingWishlist, setAddingWishlist] = useState(false);

  // Fetch property details
  useEffect(() => {
    setLoadingProperty(true);
    axiosSecure
      .get(`/properties/${id}`)
      .then((res) => {
        if (res.status === 404) {
          Swal.fire({ icon: "error", title: "Property not found" });
          navigate("/properties");
          return;
        }
        setProperty(res.data);
      })
      .catch((err) => {
        Swal.fire({ icon: "error", title: err.response?.data?.error || "Failed to load property" });
      })
      .finally(() => setLoadingProperty(false));
  }, [id, navigate, axiosSecure]);

  // Fetch reviews
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await axiosSecure.get(`/properties/${id}/reviews`);
      setReviews(res.data);
    } catch (err) {
      Swal.fire({ icon: "error", title: err.response?.data?.error || "Failed to load reviews" });
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id, axiosSecure]);

  // Add to Wishlist handler
  const handleAddToWishlist = () => {
    if (!userEmail) {
      Swal.fire({ icon: "warning", title: "Please login to add to wishlist" });
      navigate("/login");
      return;
    }

    setAddingWishlist(true);
    axiosSecure
      .post("/wishlist", { userEmail, propertyId: id })
      .then((res) => {
        if (res.status === 201) {
          Swal.fire({ icon: "success", title: "Added to wishlist!" });
        } else if (res.status === 409) {
          Swal.fire({ icon: "info", title: "Already in wishlist" });
        }
      })
      .catch((err) => {
        Swal.fire({ icon: "error", title: err.response?.data?.error || "Failed to add to wishlist" });
      })
      .finally(() => setAddingWishlist(false));
  };

  // Add review handler
  const handleAddReview = () => {
    if (!userEmail) {
      Swal.fire({ icon: "warning", title: "Please login to add a review" });
      navigate("/login");
      return;
    }
    if (!newReviewText.trim()) {
      Swal.fire({ icon: "warning", title: "Review cannot be empty" });
      return;
    }

    axiosSecure
      .post(`/properties/${id}/reviews`, { userEmail, comment: newReviewText })
      .then(() => {
        Swal.fire({ icon: "success", title: "Review added!" });
        setShowReviewModal(false);
        setNewReviewText("");
        fetchReviews();
      })
      .catch((err) => {
        Swal.fire({ icon: "error", title: err.response?.data?.error || "Failed to add review" });
      });
  };

  // Delete review handler
  const handleDeleteReview = (reviewId) => {
    if (!userEmail) {
      Swal.fire({ icon: "warning", title: "Please login to delete a review" });
      navigate("/login");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const previousReviews = reviews;
        setReviews(reviews.filter((review) => review._id !== reviewId)); // Optimistic update
        axiosSecure
          .delete(`/reviews/${reviewId}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              Swal.fire("Deleted!", "Your review has been deleted.", "success");
            } else {
              setReviews(previousReviews); // Revert on failure
              Swal.fire("Error!", "Review not found or already deleted.", "error");
            }
          })
          .catch((err) => {
            setReviews(previousReviews); // Revert on error
            Swal.fire({ icon: "error", title: err.response?.data?.error || "Failed to delete review" });
          });
      }
    });
  };

  if (loadingProperty)
    return (
      <div className="text-center py-12 text-gray-600 font-semibold">
        Loading property details...
      </div>
    );

  if (!property)
    return (
      <div className="text-center py-12 text-red-600 font-semibold">
        Property not found.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">{property.title}</h1>

      {property.image && (
        <img
          src={property.image}
          alt={`${property.title} image`}
          className="rounded mb-6 w-full max-h-96 object-cover"
        />
      )}

      <p className="mb-6 text-gray-700">
        {property.description || "No description provided."}
      </p>

      <div className="flex flex-wrap gap-6 mb-8">
        <p className="text-lg font-semibold text-gray-700">
          Price Range: <span className="font-normal">{property.priceRange}</span>
        </p>
        <p className="text-lg font-semibold text-gray-700">
          Agent: <span className="font-normal">{property.agentName || "Unknown"}</span>
        </p>
        <p className="text-lg font-semibold text-gray-700">
          Status: <span className="font-normal capitalize">{property.status || "Pending"}</span>
        </p>
      </div>

      <button
        onClick={handleAddToWishlist}
        disabled={addingWishlist}
        className={`mb-12 py-3 px-6 rounded font-semibold text-white transition ${
          addingWishlist ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
        aria-label="Add to wishlist"
      >
        {addingWishlist ? "Adding..." : "Add to Wishlist"}
      </button>

      <section>
        <h2 className="text-3xl font-semibold mb-6">Reviews</h2>

        {loadingReviews ? (
          <p className="text-gray-600">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600 italic">No reviews yet. Be the first to review!</p>
        ) : (
          <ul className="space-y-6 mb-8">
            {reviews.map((review) => (
              <li
                key={review._id}
                className="border rounded p-4 bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{review.name || review.userEmail}</p>
                    <p className="text-sm text-gray-500">
                      Property: {review.propertyTitle || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Agent: {review.agentName || "Unknown"}
                    </p>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {review.userEmail === userEmail && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                      aria-label={`Delete review for ${review.propertyTitle || "property"}`}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => setShowReviewModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
          aria-label="Add a review"
        >
          Add a Review
        </button>
      </section>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Add Your Review</h3>
            <textarea
              rows={4}
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="Write your review here"
              className="w-full border border-gray-300 p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Review text"
            ></textarea>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2 rounded border border-gray-400 hover:bg-gray-100 transition"
                aria-label="Cancel review"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReview}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-semibold"
                aria-label="Submit review"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;