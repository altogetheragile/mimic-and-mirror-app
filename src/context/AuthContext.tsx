
import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  updatePassword: (password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Replace with your Supabase URL and anon key after Supabase integration
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
  
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialize Supabase client
    if (supabaseUrl && supabaseAnonKey) {
      const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      setSupabase(supabaseClient);
      
      // Check current session
      const checkUser = async () => {
        try {
          setLoading(true);
          const { data } = await supabaseClient.auth.getSession();
          
          if (data && data.session) {
            setUser(data.session.user);
            
            // Check if user is admin
            const { data: roleData } = await supabaseClient
              .from("user_roles")
              .select("role")
              .eq("user_id", data.session.user.id)
              .single();
            
            setIsAdmin(roleData?.role === "admin");
          }
        } catch (error) {
          console.error("Error loading user:", error);
        } finally {
          setLoading(false);
        }
      };
      
      checkUser();
      
      // Listen for auth changes
      const { data: authListener } = supabaseClient.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            
            // Check if user is admin
            const { data: roleData } = await supabaseClient
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id)
              .single();
            
            setIsAdmin(roleData?.role === "admin");
          } else {
            setUser(null);
            setIsAdmin(false);
          }
          setLoading(false);
        }
      );
      
      return () => {
        authListener?.subscription?.unsubscribe();
      };
    } else {
      // For development without Supabase connection
      console.warn("Supabase credentials not found, auth functionality will be mocked");
      setLoading(false);
      
      // You may want to remove this in production
      if (process.env.NODE_ENV !== 'production') {
        console.log("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment");
      }
    }
  }, [supabaseUrl, supabaseAnonKey]);

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { error: new Error("Supabase client not initialized"), data: null };
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
      
      return { error, data: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { error: new Error("Supabase client not initialized"), data: null };
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Signed in successfully",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      
      return { error, data: null };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      console.error("Supabase client not initialized");
      return;
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { error: new Error("Supabase client not initialized"), data: null };
    }
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for the reset link",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error resetting password",
        description: error.message,
        variant: "destructive",
      });
      
      return { error, data: null };
    }
  };

  const updatePassword = async (password: string) => {
    if (!supabase) {
      console.error("Supabase client not initialized");
      return { error: new Error("Supabase client not initialized"), data: null };
    }
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated successfully",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
      
      return { error, data: null };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
