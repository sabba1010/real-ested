// src/Router/RoleRoutes.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // তোমার authentication context hook
import useRole from "../hooks/useRole"; // role check করার custom hook

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useRole();

  if (loading || isLoading) return <p>Loading...</p>;

  if (user && role === "admin") {
    return children;
  }
  return <Navigate to="/" />;
};

export const AgentRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useRole();

  if (loading || isLoading) return <p>Loading...</p>;

  if (user && role === "agent") {
    return children;
  }
  return <Navigate to="/" />;
};

export const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isLoading } = useRole();

  if (loading || isLoading) return <p>Loading...</p>;

  if (user && role === "user") {
    return children;
  }
  return <Navigate to="/" />;
};
