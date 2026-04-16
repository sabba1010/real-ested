import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout.jsx";
import Home from "../pages/Home/Home.jsx";
import AllProperties from "../DashBoard/AllProperties.jsx";
import PropertyDetails from "../DashBoard/PropertyDetails.jsx";
import Login from "../Auth/Login.jsx";
import Register from "../Auth/Register.jsx";
import NotFound from "../NotFound.jsx";
import DashboardLayout from "../pages/Dashboard/DashboardLayout.jsx";
import MyProfile from "../pages/Dashboard/MyProfile.jsx";
import Wishlist from "../DashBoard/Wishlist.jsx";
import Reviews from "../pages/Dashboard/Reviews.jsx";
import MyOffer from "../DashBoard/MyOffer.jsx";
import MakeOffer from "../DashBoard/MakeOffer.jsx";
import PropertyBought from "../DashBoard/propertyBought.jsx";
import AgentDashboardHome from "../Agent/AgentDashboardHome.jsx";
import AddNewProperty from "../Agent/AddNewProperty.jsx";
import MyProperties from "../Agent/MyProperties.jsx";
import AdminDashboard from "../Admin/AdminDashboard.jsx";
import ManageUsers from "../Admin/ManageUsers.jsx";
import ManageProperties from "../Admin/ManageProperties.jsx";
import ManageReviews from "../Admin/ManageReviews.jsx";
import AgentDashboard from "../Agent/AgentDashboard.jsx";
import AgentProfile from "../Agent/AgentProfile.jsx";
import AgentListings from "../Agent/AgentListings.jsx";
import MySoldProperties from "../Agent/MySoldProperties.jsx";
import ReqPoperty from "../Agent/ReqPoperty.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import AgentRoute from "./AgentRoute.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "properties", element: <AllProperties /> },
      { path: "property-details/:id", element: <PropertyDetails /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <MyProfile /> },
          { path: "my-profile", element: <MyProfile /> },
          { path: "wishlist", element: <Wishlist /> },
          { path: "make-offer/:id", element: <MakeOffer /> },
          { path: "offer", element: <MyOffer /> },
          { path: "property-bought", element: <PropertyBought /> },
          { path: "my-reviews", element: <Reviews /> },
          { path: "agent-home", element: <AgentDashboardHome /> },
          { path: "add-property", element: <AddNewProperty /> },
          { path: "my-properties", element: <MyProperties /> },
          { path: "admin-home", element: <AdminDashboard /> },
          { path: "manage-properties", element: <ManageProperties /> },
          { path: "manage-users", element: <ManageUsers /> },
          { path: "manage-reviews", element: <ManageReviews /> },
        ],
      },
      {
        path: "agent-dashboard",
        element: (
          <AgentRoute>
            <AgentDashboard />
          </AgentRoute>
        ),
        children: [
          { index: true, element: <AgentDashboardHome /> },
          { path: "profile", element: <AgentProfile /> },
          { path: "add-property", element: <AddNewProperty /> },
          { path: "my-properties", element: <MyProperties /> },
          { path: "my-sold-properties", element: <MySoldProperties /> },
          { path: "requested-properties", element: <ReqPoperty /> },
        ],
      },
      {
        path: "agent-listings",
        element: (
          <AgentRoute>
            <AgentListings />
          </AgentRoute>
        ),
      },
      {
        path: "admin-dashboard",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
    ],
  },
]);
