// AuthRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }: { children: React.ReactElement }) => {
  // const token = localStorage.getItem("token");
  const encryptedtoken: string = localStorage.getItem("token") ?? "";
  let token: string = atob(encryptedtoken);
  // console.log("decryptedToken", token);

  if (token) {
    // If authenticated, redirect to the videos page or another protected route
    return <Navigate to="/videos" replace />;
  }

  // If not authenticated, render the children
  return children;
};

export default AuthRoute;
