
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard } from "lucide-react";

const AdminNavLink = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null;
  }

  return (
    <Link 
      to="/admin"
      className="flex items-center px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
    >
      <LayoutDashboard className="h-4 w-4 mr-2" />
      Admin
    </Link>
  );
};

export default AdminNavLink;
