import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import PandalsPage from "./pages/PandalsPage";
import LoginPage from "./pages/LoginPage";
import DetailsPage from "./pages/DetailsPage";
import ForgotPasswordEmailRequest from "./pages/ForgotPasswordEmailRequest";
import UpdatePassword from "./pages/UpdatePassword";
import RestaurantPage from "./pages/RestaurantPage";
import LocationPage from "./pages/LocationPage";
import MetroPage from "./pages/MetroPage";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Layout component that wraps the header, main content, and footer
const Layout = () => {
  return (
    <div className="bg-[#FDF5E6] min-h-screen flex flex-col">
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "pandals",
        element: <PandalsPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "details",
        element: <DetailsPage />,
      },
      {
        path: "otp_request",
        element: <ForgotPasswordEmailRequest />,
      },
      {
        path: "update_password",
        element: <UpdatePassword />,
      },
      {
        path: "restaurants",
        element: <RestaurantPage />,
      },
      {
        path: "map",
        element: <LocationPage />,
      },
      {
        path: "metro",
        element: <MetroPage />,
      },
      {
        path: "authority",
        element: <AuthorityDashboard />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
