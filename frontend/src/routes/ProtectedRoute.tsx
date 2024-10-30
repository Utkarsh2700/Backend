// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  // const token = localStorage.getItem("token");
  const encryptedtoken: string = localStorage.getItem("token") ?? "";
  let token: string = atob(encryptedtoken);
  // console.log("decryptedToken", token);

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children
  return children;
};

export default ProtectedRoute;
