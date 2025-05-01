
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  requireInstructor?: boolean;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requireAdmin = false,
  requireInstructor = false,
  children 
}) => {
  const { user, loading, isAdmin, isInstructor } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Loading...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to dashboard if not an admin
    console.log("User is not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  if (requireInstructor && !isInstructor && !isAdmin) {
    // Redirect to dashboard if not an instructor or admin
    // Note: Admins can access instructor routes
    console.log("User is not instructor or admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // If there are children, render them, otherwise render the Outlet
  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
