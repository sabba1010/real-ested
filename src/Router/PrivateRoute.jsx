// src/Router/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import Spinner from "../components/Spinner";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export default PrivateRoute;


// // src/Router/PrivateRoute.jsx
// import { Navigate, useLocation } from "react-router-dom";
// import { useContext } from "react";
// import AuthContext from "../contexts/AuthContext";
// import Spinner from "../components/Spinner";

// const PrivateRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext);
//   const location = useLocation();

//   if (loading) {
//     return <Spinner />;
//   }

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default PrivateRoute;
