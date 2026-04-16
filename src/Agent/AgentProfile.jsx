import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import Swal from "sweetalert2";

const AgentProfile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!displayName) {
      Swal.fire({
        icon: "warning",
        title: "Display name is required",
      });
      return;
    }
    setLoading(true);
    try {
      await updateProfile(user, { displayName, photoURL });
      Swal.fire({
        icon: "success",
        title: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update profile",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">Agent Profile</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter your display name"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Photo URL</label>
        <input
          type="text"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Enter photo URL"
        />
      </div>

      {photoURL && (
        <div className="mb-4 text-center">
          <img
            src={photoURL}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full mx-auto object-cover border border-green-500"
          />
        </div>
      )}

      <button
        onClick={handleUpdateProfile}
        disabled={loading}
        className={`w-full py-3 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default AgentProfile;
