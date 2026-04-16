import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-green-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Oops! Page not found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow-md transition"
        >
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
