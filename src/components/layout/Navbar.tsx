
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            Agile Coaching
          </Link>
          
          <nav className="hidden md:flex ml-6 space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            to="/services"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Agile Coaching
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Professional coaching to transform your team's agile capabilities
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <Link to="/services/coaching" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Team Coaching</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Targeted coaching for agile teams
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/services/training" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Agile Training</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Certified scrum and agile training courses
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/services/consulting" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Agile Consulting</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Strategic consulting for enterprise agility
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/services/transformation" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Agile Transformation</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            End-to-end agile transformation services
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/courses" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Courses
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    About
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <>
              <Button variant="ghost" onClick={signOut}>
                Log Out
              </Button>
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-30 bg-background md:hidden">
          <div className="container py-4 flex flex-col space-y-4">
            <Link to="/" className="px-4 py-2 hover:bg-accent rounded-md" onClick={closeMenu}>Home</Link>
            <Link to="/services" className="px-4 py-2 hover:bg-accent rounded-md" onClick={closeMenu}>Services</Link>
            <Link to="/courses" className="px-4 py-2 hover:bg-accent rounded-md" onClick={closeMenu}>Courses</Link>
            <Link to="/about" className="px-4 py-2 hover:bg-accent rounded-md" onClick={closeMenu}>About</Link>
            <Link to="/contact" className="px-4 py-2 hover:bg-accent rounded-md" onClick={closeMenu}>Contact</Link>
            
            <div className="border-t pt-4 mt-4">
              {user ? (
                <>
                  <Button variant="outline" className="w-full mb-2" asChild onClick={closeMenu}>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="default" className="w-full" onClick={() => { signOut(); closeMenu(); }}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full mb-2" asChild onClick={closeMenu}>
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button variant="default" className="w-full" asChild onClick={closeMenu}>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
