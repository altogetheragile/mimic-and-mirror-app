
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  created_at: string;
  roles: string[];
}

// Fetch all users with their profiles and roles
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    // Get users from auth.users via admin API
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    // Get profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*");
    
    if (profilesError) throw profilesError;
    
    // Get user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("*");
    
    if (rolesError) throw rolesError;
    
    // Combine the data
    const users = authUsers.users.map(user => {
      const profile = profiles.find(p => p.id === user.id) || { 
        first_name: '', 
        last_name: '', 
        avatar_url: null
      };
      
      const roles = userRoles
        .filter(r => r.user_id === user.id)
        .map(r => r.role);
      
      return {
        id: user.id,
        email: user.email || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        avatar_url: profile.avatar_url || undefined,
        created_at: user.created_at,
        roles: roles
      };
    });
    
    return users;
  } catch (error: any) {
    toast({
      title: "Error fetching users",
      description: error.message || "Failed to fetch users",
      variant: "destructive",
    });
    return [];
  }
};

// Create a new user
export const createUser = async (
  email: string, 
  password: string,
  firstName: string,
  lastName: string,
  roles: string[] = []
): Promise<UserProfile | null> => {
  try {
    // Create the user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError) throw authError;
    
    const userId = authData.user.id;
    
    // Create or update the profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName
      });
    
    if (profileError) throw profileError;
    
    // Assign roles
    if (roles.length > 0) {
      const roleEntries = roles.map(role => ({
        user_id: userId,
        role
      }));
      
      const { error: rolesError } = await supabase
        .from("user_roles")
        .insert(roleEntries);
      
      if (rolesError) throw rolesError;
    }
    
    toast({
      title: "Success",
      description: "User created successfully",
    });
    
    return {
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      created_at: new Date().toISOString(),
      roles: roles
    };
  } catch (error: any) {
    toast({
      title: "Error creating user",
      description: error.message || "Failed to create user",
      variant: "destructive",
    });
    return null;
  }
};

// Update a user's profile and roles
export const updateUser = async (
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    roles?: string[];
  }
): Promise<boolean> => {
  try {
    // Update profile if needed
    if (updates.firstName !== undefined || updates.lastName !== undefined) {
      const profileUpdates: any = {};
      
      if (updates.firstName !== undefined) {
        profileUpdates.first_name = updates.firstName;
      }
      
      if (updates.lastName !== undefined) {
        profileUpdates.last_name = updates.lastName;
      }
      
      const { error: profileError } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", userId);
      
      if (profileError) throw profileError;
    }
    
    // Update roles if provided
    if (updates.roles !== undefined) {
      // First delete existing roles
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);
      
      if (deleteError) throw deleteError;
      
      // Then insert new roles if any
      if (updates.roles.length > 0) {
        const roleEntries = updates.roles.map(role => ({
          user_id: userId,
          role
        }));
        
        const { error: insertError } = await supabase
          .from("user_roles")
          .insert(roleEntries);
        
        if (insertError) throw insertError;
      }
    }
    
    toast({
      title: "Success",
      description: "User updated successfully",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error updating user",
      description: error.message || "Failed to update user",
      variant: "destructive",
    });
    return false;
  }
};

// Delete a user
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // Delete the user from auth which should cascade delete profiles and roles
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) throw error;
    
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error deleting user",
      description: error.message || "Failed to delete user",
      variant: "destructive",
    });
    return false;
  }
};
