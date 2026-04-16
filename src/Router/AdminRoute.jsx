// src/Router/AdminRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Spinner from "../components/Spinner";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [role, isRoleLoading] = useRole();
  const location = useLocation();

  if (loading || isRoleLoading) return <Spinner />;
  if (user && role === "admin") return children;

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;
