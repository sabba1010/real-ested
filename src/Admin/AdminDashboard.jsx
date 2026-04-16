import React, { useState, useContext } from "react";
import AdminProfile from "./AdminProfile";
import ManageProperties from "./ManageProperties";
import ManageUsers from "./ManageUsers";
import ManageReviews from "./ManageReviews";
import AdvertiseProperty from "./AdvertiseProperty"; // Import korlam
import AuthContext from "../contexts/AuthContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Admin Dashboard - {user?.displayName || user?.email}
        </h1>
      </header>

      <div className="flex gap-6">
        <nav className="flex flex-col w-48 bg-white p-4 rounded shadow">
          {[
            { id: "profile", label: "Admin Profile" },
            { id: "properties", label: "Manage Properties" },
            { id: "users", label: "Manage Users" },
            { id: "reviews", label: "Manage Reviews" },
            { id: "advertise", label: "Advertise Property" }, // New tab add
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`mb-2 px-4 py-2 rounded text-left font-medium ${
                activeTab === id ? "bg-blue-600 text-white" : "hover:bg-blue-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <main className="flex-1 bg-white p-6 rounded shadow min-h-[600px]">
          {activeTab === "profile" && <AdminProfile />}
          {activeTab === "properties" && <ManageProperties />}
          {activeTab === "users" && <ManageUsers />}
          {activeTab === "reviews" && <ManageReviews />}
          {activeTab === "advertise" && <AdvertiseProperty />} {/* New tab content */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
