import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaHome, FaHeart, FaUser, FaUsers } from "react-icons/fa";
import { MdDashboard, MdAddHome, MdRealEstateAgent } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { FaHandshake } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import AuthContext from "../../contexts/AuthContext";  // Correct import

const DashboardLayout = () => {
  const { user, role } = useContext(AuthContext); // get logged in user & role
  const userRole = role || "user"; // fallback role if null

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-green-100 p-5 shadow-lg hidden lg:block">
        <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
          <MdDashboard /> Dashboard
        </h2>
        <ul className="space-y-3 font-medium">
          {/* Role-based navigation */}
        {userRole === "user" && (
  <>
  
    <li>
      <NavLink
        to="/dashboard/my-profile"
        className="flex items-center gap-2 hover:text-green-700"
      >
        <FaUser /> My Profile
      </NavLink>
    </li>
    <li>
      <NavLink
        to="/dashboard/wishlist"
        className="flex items-center gap-2 hover:text-green-700"
      >
        <FaHeart /> My Wishlist
      </NavLink>
    </li>
    <li>
  <NavLink
    to="/dashboard/Offer"
    className="flex items-center gap-2 hover:text-green-700"
  >
    <FaHandshake /> My Offer
  </NavLink>
</li>
    <li>
      <NavLink
        to="/dashboard/property-bought"
        className="flex items-center gap-2 hover:text-green-700"
      >
        <RiSecurePaymentFill /> Property Bought
      </NavLink>
    </li>
<li>
  <NavLink
    to="/dashboard/my-reviews"
    className="flex items-center gap-2 hover:text-green-700"
  >
    <FaStar /> My Reviews
  </NavLink>
</li>
  </>
)}


          {userRole === "agent" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/agent-home"
                  className="flex items-center gap-2 hover:text-green-700"
                >
                  <MdRealEstateAgent /> Agent Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/add-property"
                  className="flex items-center gap-2 hover:text-green-700"
                >
                  <MdAddHome /> Add Property
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/my-properties"
                  className="flex items-center gap-2 hover:text-green-700"
                >
                  <FaHome /> My Properties
                </NavLink>
              </li>
            </>
          )}

          {userRole === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/admin-home"
                  className="flex items-center gap-2 hover:text-green-700"
                >
                  <FaUser /> Admin Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/manage-properties"
                  className="flex items-center gap-2 hover:text-green-700"
                >
                  <MdAddHome /> Manage Properties
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/manage-users"
                  className="flex items-center gap-2 hover:text-green-700"
                >
                  <FaUsers /> Manage Users
                </NavLink>
              </li>
            </>
          )}

          <hr className="my-4" />

          {/* Common Link */}
          <li>
            <NavLink
              to="/"
              className="flex items-center gap-2 hover:text-green-700"
            >
              <FaHome /> Back to Home
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
