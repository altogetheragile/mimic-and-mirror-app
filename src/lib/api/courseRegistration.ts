
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { ApiResponse } from "./supabase";

// Type for single registration
export interface CourseRegistration {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  special_requests?: string;
}

// Type for group registration
export interface GroupRegistration {
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  company: string;
  special_requests?: string;
  participants: CourseRegistration[];
}

// Service for course registrations
export const courseRegistrationService = {
  // Individual course registration
  async registerForCourse(courseId: string, registration: CourseRegistration): Promise<ApiResponse<any>> {
    try {
      // Get the current user if logged in
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      
      // Create registration record
      const { data, error } = await supabase
        .from("course_registrations")
        .insert({
          course_id: courseId,
          user_id: userId,
          status: "pending",
          payment_status: "unpaid",
          metadata: {
            first_name: registration.first_name,
            last_name: registration.last_name,
            email: registration.email,
            phone: registration.phone,
            company: registration.company,
            special_requests: registration.special_requests,
          }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Send notification email via edge function
      await supabase.functions.invoke("course-registration-notification", {
        body: {
          registration: {
            ...registration,
            course_id: courseId,
            registration_id: data.id
          }
        }
      });
      
      toast({
        title: "Registration submitted!",
        description: "We've received your course registration.",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error("Failed to register for course:", error);
      toast({
        title: "Registration failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
      return { data: null, error: error as Error };
    }
  },

  // Group course registration
  async registerGroupForCourse(courseId: string, groupRegistration: GroupRegistration): Promise<ApiResponse<any>> {
    try {
      // Get the current user if logged in
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      
      // Start a transaction
      const registrations = [];
      
      // Create registration record for each participant
      for (const participant of groupRegistration.participants) {
        const { data, error } = await supabase
          .from("course_registrations")
          .insert({
            course_id: courseId,
            user_id: userId,
            status: "pending",
            payment_status: "unpaid",
            is_group: true,
            group_reference: groupRegistration.company,
            metadata: {
              first_name: participant.first_name,
              last_name: participant.last_name,
              email: participant.email,
              phone: participant.phone,
              company: groupRegistration.company,
              special_requests: groupRegistration.special_requests,
              group_contact: {
                name: groupRegistration.contact_name,
                email: groupRegistration.contact_email,
                phone: groupRegistration.contact_phone
              }
            }
          })
          .select()
          .single();
        
        if (error) throw error;
        registrations.push(data);
      }
      
      // Send notification email via edge function
      await supabase.functions.invoke("group-registration-notification", {
        body: {
          groupRegistration: {
            ...groupRegistration,
            course_id: courseId,
            registration_ids: registrations.map(reg => reg.id)
          }
        }
      });
      
      toast({
        title: "Group registration submitted!",
        description: `We've received your registration for ${groupRegistration.participants.length} participants.`,
      });
      
      return { data: registrations, error: null };
    } catch (error) {
      console.error("Failed to register group for course:", error);
      toast({
        title: "Group registration failed",
        description: "There was an error submitting your group registration. Please try again.",
        variant: "destructive",
      });
      return { data: null, error: error as Error };
    }
  },

  // Get all registrations for a course (admin only)
  async getRegistrationsForCourse(courseId: string): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("course_registrations")
        .select("*, courses(title)")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return { data: data ?? [], error: null };
    } catch (error) {
      console.error("Failed to get course registrations:", error);
      return { data: [], error: error as Error };
    }
  },

  // Update registration status (admin only)
  async updateRegistrationStatus(
    registrationId: string, 
    status: string,
    paymentStatus?: string
  ): Promise<ApiResponse<any>> {
    try {
      const updateData: any = { status };
      if (paymentStatus) updateData.payment_status = paymentStatus;
      
      const { data, error } = await supabase
        .from("course_registrations")
        .update(updateData)
        .eq("id", registrationId)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Registration status has been updated to ${status}.`,
      });
      
      return { data, error: null };
    } catch (error) {
      console.error("Failed to update registration status:", error);
      toast({
        title: "Update failed",
        description: "Failed to update registration status.",
        variant: "destructive",
      });
      return { data: null, error: error as Error };
    }
  }
};
