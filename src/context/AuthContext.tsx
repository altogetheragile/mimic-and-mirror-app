
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: any;
  loading: boolean;
  isAdmin?: boolean; // Add isAdmin property
  signOut?: () => Promise<void>; // Add signOut method
  updateSession?: (session: Session | null) => void; // Add updateSession method
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Function to update session
  const updateSession = (session: Session | null) => {
    setUser(session?.user ?? null);
    
    // Check if user has admin role in their metadata
    if (session?.user?.user_metadata?.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  useEffect(() => {
    // Get the current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      updateSession(session);
      setLoading(false);
    };
    
    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateSession(session);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signOut, updateSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
