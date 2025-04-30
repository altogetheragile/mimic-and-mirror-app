
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email?: string;
  role?: string;
};

export type UserRole = {
  id: string;
  user_id: string;
  role: 'admin' | 'instructor' | 'student';
};

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    toast({
      title: "Error fetching profile",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  return data as UserProfile;
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    toast({
      title: "Error updating profile",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  toast({
    title: "Profile updated",
    description: "Your profile has been updated successfully",
  });

  return data as UserProfile;
}

export async function getUserRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .order("role", { ascending: false }) // Admin first, then instructor, then student
    .limit(1)
    .single();

  if (error) {
    if (error.code !== "PGRST116") { // PGRST116 is "no rows returned" error
      toast({
        title: "Error fetching user role",
        description: error.message,
        variant: "destructive",
      });
    }
    return null;
  }

  return data.role;
}

// Admin functions
export async function getAllUsers() {
  // Get all profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*");

  if (profilesError) {
    toast({
      title: "Error loading users",
      description: profilesError.message,
      variant: "destructive",
    });
    return [];
  }

  // Get all user roles
  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("*");

  if (rolesError) {
    toast({
      title: "Error loading user roles",
      description: rolesError.message,
      variant: "destructive",
    });
    return [];
  }

  // Get all users from auth (this requires admin privileges)
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    toast({
      title: "Error loading user emails",
      description: usersError.message,
      variant: "destructive",
    });
    // Continue without emails
  }

  // Combine the data
  const combinedUsers = profiles.map(profile => {
    const userRoles = roles.filter(r => r.user_id === profile.id);
    const highestRole = userRoles.length > 0 ? 
      userRoles.sort((a, b) => {
        const roleRank = { admin: 3, instructor: 2, student: 1 };
        return roleRank[b.role as keyof typeof roleRank] - roleRank[a.role as keyof typeof roleRank];
      })[0].role : 'student';
    
    const user = users?.users.find(u => u.id === profile.id);
    
    return {
      ...profile,
      email: user?.email || "",
      role: highestRole
    };
  });

  return combinedUsers;
}

export async function updateUserRole(userId: string, role: 'admin' | 'instructor' | 'student') {
  // First, delete any existing roles for this user
  const { error: deleteError } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    toast({
      title: "Error updating role",
      description: deleteError.message,
      variant: "destructive",
    });
    return false;
  }

  // Then insert the new role
  const { error: insertError } = await supabase
    .from("user_roles")
    .insert([{ user_id: userId, role }]);

  if (insertError) {
    toast({
      title: "Error setting new role",
      description: insertError.message,
      variant: "destructive",
    });
    return false;
  }

  toast({
    title: "Role updated",
    description: `User role has been updated to ${role}`,
  });

  return true;
}

export async function getUserCourseRegistrations(userId: string) {
  const { data, error } = await supabase
    .from("course_registrations")
    .select(`
      *,
      courses:course_id (*)
    `)
    .eq("user_id", userId);

  if (error) {
    toast({
      title: "Error fetching registrations",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }

  return data;
}

export async function getAllCourseRegistrations() {
  const { data, error } = await supabase
    .from("course_registrations")
    .select(`
      *,
      courses:course_id (*),
      profiles:user_id (*)
    `);

  if (error) {
    toast({
      title: "Error fetching registrations",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }

  return data;
}

export async function updateRegistrationStatus(registrationId: string, status: string, paymentStatus: string) {
  const { data, error } = await supabase
    .from("course_registrations")
    .update({
      status,
      payment_status: paymentStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", registrationId)
    .select()
    .single();

  if (error) {
    toast({
      title: "Error updating registration",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  toast({
    title: "Registration updated",
    description: "The registration status has been updated successfully",
  });
  return data;
}
