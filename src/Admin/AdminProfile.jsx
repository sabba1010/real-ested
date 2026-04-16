import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import axios from "axios";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const [counts, setCounts] = useState({
    admin: 0,
    agent: 0,
    fraud: 0,
    user: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
        const roleCounts = data.reduce(
          (acc, curr) => {
            const role = curr.role || "user";
            acc[role] = (acc[role] || 0) + 1;
            return acc;
          },
          { admin: 0, agent: 0, fraud: 0, user: 0 }
        );
        setCounts(roleCounts);
      } catch (error) {
        console.error("Failed to fetch user counts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserCounts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900 border-b pb-4">
        Admin Profile
      </h2>

      <div className="flex items-center gap-6 mb-8">
        <img
          src={user?.photoURL || "https://via.placeholder.com/100"}
          alt="User"
          className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
        />
        <div>
          <p className="text-2xl font-semibold text-gray-800">
            {user?.displayName || "No Name"}
          </p>
          <p className="text-gray-600 mb-2">{user?.email}</p>
          {user?.role && user.role !== "user" && (
            <span className="inline-block px-4 py-1 text-sm font-semibold bg-green-200 text-green-800 rounded-full shadow-sm">
              Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900">User Statistics</h3>
        {loading ? (
          <p className="text-gray-500 italic">Loading stats...</p>
        ) : (
          <ul className="grid grid-cols-2 gap-6 text-gray-800">
            <li className="bg-indigo-100 rounded-lg p-4 shadow-sm text-center">
              <p className="text-4xl font-bold text-indigo-700">{counts.admin}</p>
              <p className="mt-1 font-medium">Admins</p>
            </li>
            <li className="bg-yellow-100 rounded-lg p-4 shadow-sm text-center">
              <p className="text-4xl font-bold text-yellow-700">{counts.agent}</p>
              <p className="mt-1 font-medium">Agents</p>
            </li>
            <li className="bg-red-100 rounded-lg p-4 shadow-sm text-center">
              <p className="text-4xl font-bold text-red-700">{counts.fraud}</p>
              <p className="mt-1 font-medium">Fraud</p>
            </li>
            <li className="bg-gray-200 rounded-lg p-4 shadow-sm text-center">
              <p className="text-4xl font-bold text-gray-700">{counts.user}</p>
              <p className="mt-1 font-medium">Users</p>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
