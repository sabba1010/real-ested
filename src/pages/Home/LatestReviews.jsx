import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const LatestReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reviews/latest`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reviews");
        return res.json();
      })
      .then((data) => {
        setReviews(data);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Failed to load latest reviews",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-600 font-semibold">
        Loading latest reviews...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 text-gray-600 italic">
        No reviews available.
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto p-6 bg-white rounded-3xl shadow-xl mt-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-green-600 font-semibold mb-2">
            Customer Feedback
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            What our buyers are saying
          </h2>
        </div>
        <p className="max-w-xl text-gray-600">
          Real stories from happy customers help you trust every listing and every agent.
        </p>
      </div>

      <div className="grid gap-6 mt-8 sm:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review) => {
          const { _id, comment, createdAt, user, property } = review;

          return (
            <article
              key={_id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user?.photoURL || "/default-avatar.png"}
                  alt={user?.name || "Reviewer"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                />
                <div>
                  <p className="font-semibold text-gray-900">{user?.name || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-5">"{comment}"</p>
              <p className="text-sm text-gray-500">
                Property: <span className="font-medium text-gray-900">{property?.title || "Not specified"}</span>
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default LatestReviews;
