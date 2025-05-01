
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import AdminNavLink from "./AdminNavLink";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold">
                <span className="text-primary">Altogether</span>
                <span>Agile</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/courses"
                className={({ isActive }) => 
                  `flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? "border-primary text-foreground" 
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                  }`
                }
              >
                Courses
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => 
                  `flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? "border-primary text-foreground" 
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => 
                  `flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? "border-primary text-foreground" 
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                  }`
                }
              >
                Contact
              </NavLink>
              {/* Admin link will only show for admin users */}
              <AdminNavLink />
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={handleSignOut}>
                  Log Out
                </Button>
                <Button asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/courses"
              className={({ isActive }) => 
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive 
                    ? "border-primary text-primary bg-primary/5" 
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                }`
              }
              onClick={closeMenu}
            >
              Courses
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => 
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive 
                    ? "border-primary text-primary bg-primary/5" 
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                }`
              }
              onClick={closeMenu}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => 
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive 
                    ? "border-primary text-primary bg-primary/5" 
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                }`
              }
              onClick={closeMenu}
            >
              Contact
            </NavLink>
            {/* Admin link will only show for admin users (mobile) */}
            {user && (
              <AdminNavLink />
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    handleSignOut();
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
