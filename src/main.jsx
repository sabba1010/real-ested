import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from "react-router-dom";
import { router } from './Router/router.jsx';
import AuthProvider from './contexts/AuthProvider.jsx';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || "pk_test_51RnerACH5opdlGP04q42Ea8KNRZ3wf4gf2RKt508bPU281PNkvWoE3befv2o8B9pFVhy1Mz0l7fFkMDqvtLsr4zm00r3WWo5Bj");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <RouterProvider router={router} />
        <ToastContainer />
      </Elements>
    </AuthProvider>
  </StrictMode>
);