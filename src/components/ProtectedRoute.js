import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "./Layout";

const ProtectedRoute = ({ onLogout }) => {
  const isAuthenticated = localStorage.getItem("islogin");
  const accessToken = localStorage.getItem("accessToken");

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout onLogout={onLogout}>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
