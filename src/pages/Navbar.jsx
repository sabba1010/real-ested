import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user"); // default user role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setLoading(true);
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/${encodeURIComponent(currentUser.email)}`
          );
          console.log("Role from backend:", res.data.role);
          // Ensure role is lowercase for matching
          const userRole = res.data.role ? res.data.role.toLowerCase() : "user";
          setRole(userRole);
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setRole("user");
        }
      } else {
        setRole("user"); // default to user if not logged in
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md sticky top-0 z-50 p-4 text-center">
        Loading...
      </div>
    );
  }

  const navLinksByRole = {
    user: [
      { name: "Home", path: "/" },
      { name: "All Properties", path: "/properties" },
      { name: "Dashboard", path: "/dashboard" },
    ],
    agent: [
      { name: "Home", path: "/" },
      { name: "My Listings", path: "/agent-listings" },
      { name: "Agent Dashboard", path: "/agent-dashboard" },
    ],
    admin: [
      { name: "Home", path: "/" },
      // { name: "Manage Users", path: "/admin/users" },
      // { name: "Manage Properties", path: "/admin/properties" },
      { name: "Admin Dashboard", path: "/admin-dashboard" },
    ],
  };

  const linksToShow = navLinksByRole[role] || navLinksByRole["user"];

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <div className="navbar max-w-7xl mx-auto px-4">
        {/* Logo */}
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <FaHome className="text-green-600" />
            <span className="text-green-700">RealEstate</span>
          </Link>
        </div>

        {/* Nav Links desktop */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-4">
            {linksToShow.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? "font-semibold text-green-600" : "font-semibold"
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* User info & Auth buttons */}
        <div className="navbar-end flex items-center gap-3">
          {user ? (
            <>
              <img
                src={user.photoURL || "https://i.ibb.co/tKH0RmS/avatar.png"}
                alt="User Avatar"
                title={user.displayName || "User"}
                className="w-9 h-9 rounded-full border border-gray-300"
              />
              <span className="font-medium text-green-700 hidden md:inline-block">
                {user.displayName || "User"}
              </span>

              <button
                onClick={handleLogout}
                className="btn btn-error btn-sm flex items-center gap-1"
              >
                <IoIosLogOut />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="btn btn-outline btn-sm flex items-center gap-1">
                <IoIosLogIn />
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger & Dropdown */}
        <div className="dropdown lg:hidden dropdown-end">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-52"
          >
            {linksToShow.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? "font-semibold text-green-600" : "font-semibold"
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}

            {user ? (
              <li className="mt-2">
                <button
                  onClick={handleLogout}
                  className="btn btn-error btn-sm w-full"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="mt-2">
                <Link
                  to="/login"
                  className="btn btn-outline btn-sm w-full text-center"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
