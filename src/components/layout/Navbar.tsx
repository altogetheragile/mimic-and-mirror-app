
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, User, LogOut, Settings, Loader, BookOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { user, isAdmin, isInstructor, signOut, loading } = useAuth();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Contact", path: "/contact" },
  ];

  const authenticatedLinks = user
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "My Courses", path: "/my-courses" },
      ]
    : [];

  const adminLinks = isAdmin
    ? [{ name: "Admin", path: "/admin" }]
    : isInstructor
    ? [{ name: "Instructor", path: "/instructor" }]
    : [];

  const allLinks = [...navLinks, ...authenticatedLinks, ...adminLinks];

  // Mobile Navigation Menu
  const MobileMenu = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4 border-b">
            <Link to="/" className="font-bold text-2xl" onClick={() => setIsOpen(false)}>
              Agile Coach
            </Link>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </div>

          <nav className="flex flex-col py-4 flex-1">
            {allLinks.map((link) => (
              <SheetClose asChild key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `py-3 px-4 rounded-md ${
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-accent"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </SheetClose>
            ))}
          </nav>

          <div className="py-4 border-t">
            {loading ? (
              <Button disabled className="w-full justify-center">
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </Button>
            ) : user ? (
              <>
                <p className="px-4 py-2 text-sm text-muted-foreground">
                  Signed in as {user.email}
                </p>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4"
                    asChild
                  >
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                </SheetClose>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-4">
                <SheetClose asChild>
                  <Button className="w-full" asChild>
                    <Link to="/login">Sign in</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </SheetClose>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-2xl">
            Agile Coach
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {user && authenticatedLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <MobileMenu />

        {/* Desktop Auth Menu */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <Button disabled size="sm">
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </Button>
          ) : user ? (
            <>
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              {isInstructor && !isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/instructor">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Instructor
                  </Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
