import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Player } from "@lottiefiles/react-lottie-player";
import profileAnimation from "../assets/profile.json";

const MyProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <Player
          autoplay
          loop
          src={profileAnimation}
          style={{ height: 200, width: 200 }}
        />
        <p className="text-gray-600 mt-4 text-lg">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">My Profile</h2>

      <div className="flex flex-col items-center gap-4">
        <img
          src={user.photoURL || "https://i.ibb.co/7W5Kf1v/default-avatar.png"}
          alt={user.displayName || "User Avatar"}
          className="w-32 h-32 rounded-full border-4 border-green-600 object-cover"
        />
        <h3 className="text-2xl font-semibold">{user.displayName || "No Name"}</h3>
        <p className="text-gray-600">{user.email}</p>

        {/* Role display - only if user.role exists and is not "user" */}
        {user.role && user.role !== "user" && (
          <p className="px-4 py-1 text-sm bg-green-200 text-green-800 rounded-full font-medium">
            Role: {user.role}
          </p>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
