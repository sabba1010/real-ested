import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthContext from "../contexts/AuthContext";

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const userEmail = user?.email;

  useEffect(() => {
    if (!userEmail) return;

    const fetchWishlist = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist?userEmail=${userEmail}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch wishlist");
        
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setWishlist(data);
        } else {
          throw new Error("Received non-JSON response from server");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to load wishlist", "error");
      }
    };

    fetchWishlist();
  }, [userEmail, user]);

  const handleRemove = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this item from wishlist!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
    });

    if (confirm.isConfirmed) {
      setWishlist((prev) => prev.filter((item) => item._id !== id));

      try {
        const token = await user.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/wishlist/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.message === "Removed from wishlist") {
          await Swal.fire("Removed!", "Item removed from wishlist", "success");
          navigate("/dashboard/offer"); // navigate after success alert
        } else {
          Swal.fire("Error", "Failed to delete from server", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Server error", "error");
      }
    }
  };

  const handleOffer = (propertyId) => {
    navigate(`/dashboard/make-offer/${propertyId}`);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-600 text-center">No items in wishlist.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const property = item.property;
            return (
              <div
                key={item._id}
                className="border rounded-2xl shadow-md bg-white hover:shadow-xl transition-shadow p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{property?.title}</h3>
                  <p className="text-gray-600 mb-1">{property?.location}</p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={item.agentImage || "https://via.placeholder.com/40"}
                        alt={item.agentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      Agent: <span className="text-blue-600">{item.agentName}</span>
                    </p>
                  </div>

                  <p className="mt-4 text-lg font-semibold text-gray-800">
                    Price: {property?.priceRange}
                  </p>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => handleOffer(property._id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-medium"
                  >
                    Make an Offer
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

