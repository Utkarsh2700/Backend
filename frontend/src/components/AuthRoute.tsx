import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const { isAuthenticated } = useAuth();

  // If the user is authenticated, redirect to the videos page
  if (isAuthenticated) {
    return <Navigate to="/videos" replace />;
  }
  return <>{children}</>;
};

export default AuthRoute;
