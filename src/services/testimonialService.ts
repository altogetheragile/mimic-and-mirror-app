
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  image_url: string | null;
  is_featured: boolean | null;
  course_id: string | null;
  published: boolean | null;
};

export async function getTestimonials(featured: boolean = false, limit: number = 10) {
  let query = supabase
    .from("testimonials")
    .select("*")
    .eq("published", true);
  
  if (featured) {
    query = query.eq("is_featured", true);
  }
  
  const { data, error } = await query.limit(limit);

  if (error) {
    toast({
      title: "Error loading testimonials",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }

  return data as Testimonial[];
}

export async function getCourseTestimonials(courseId: string) {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .eq("course_id", courseId);

  if (error) {
    toast({
      title: "Error loading testimonials",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }

  return data as Testimonial[];
}

// Admin functions
export async function getAllTestimonials() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    toast({
      title: "Error loading testimonials",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }

  return data as Testimonial[];
}

export async function createTestimonial(testimonial: Omit<Testimonial, "id">) {
  const { data, error } = await supabase
    .from("testimonials")
    .insert([testimonial])
    .select()
    .single();

  if (error) {
    toast({
      title: "Error creating testimonial",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  toast({
    title: "Testimonial created",
    description: "The testimonial has been created successfully",
  });
  return data as Testimonial;
}

export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>) {
  const { data, error } = await supabase
    .from("testimonials")
    .update(testimonial)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    toast({
      title: "Error updating testimonial",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  toast({
    title: "Testimonial updated",
    description: "The testimonial has been updated successfully",
  });
  return data as Testimonial;
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) {
    toast({
      title: "Error deleting testimonial",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }

  toast({
    title: "Testimonial deleted",
    description: "The testimonial has been deleted successfully",
  });
  return true;
}
