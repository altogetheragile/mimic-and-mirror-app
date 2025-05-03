
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Define types for auth context
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  loading: boolean;
  updateSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  loading: true,
  isAdmin: false,
  isInstructor: false,
  updateSession: () => {},
  signOut: async () => {},
});

// Define the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isInstructor, setIsInstructor] = useState<boolean>(false);

  // Update session handler
  const updateSession = (newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user || null);
  };

  // Sign out handler
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setIsInstructor(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Check user role
  const checkUserRole = async (userId: string) => {
    try {
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (userRoles) {
        const hasAdminRole = userRoles.some(role => role.role === 'admin');
        const hasInstructorRole = userRoles.some(role => role.role === 'instructor');
        
        setIsAdmin(hasAdminRole);
        setIsInstructor(hasInstructorRole || hasAdminRole); // Admins are also considered instructors
      }
    } catch (error) {
      console.error("Error checking user roles:", error);
    }
  };

  useEffect(() => {
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);

        // Check user roles if there is a session
        if (newSession?.user) {
          checkUserRole(newSession.user.id);
        } else {
          setIsAdmin(false);
          setIsInstructor(false);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);

      // Check user roles if there is a session
      if (currentSession?.user) {
        checkUserRole(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    isAdmin,
    isInstructor,
    updateSession,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
