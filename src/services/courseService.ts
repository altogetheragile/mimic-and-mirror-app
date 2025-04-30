
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  level: "beginner" | "intermediate" | "advanced" | null;
  category: string | null;
  price: number | null;
  duration: number | null;
  image_url: string | null;
  location: string | null;
  prerequisites: string | null;
  is_featured: boolean;
  start_date: string | null;
  end_date: string | null;
  capacity: number | null;
};

export type CourseFilter = {
  category?: string;
  level?: string;
  format?: string;
  searchTerm?: string;
};

export async function getCourses(filters?: CourseFilter) {
  let query = supabase
    .from("courses")
    .select("*")
    .eq("is_published", true);

  if (filters) {
    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }
    
    if (filters.level && filters.level !== "all") {
      query = query.eq("level", filters.level);
    }
    
    // Format filter would be based on location (in-person, virtual, hybrid)
    if (filters.format && filters.format !== "all") {
      if (filters.format === "virtual") {
        query = query.eq("location", "Virtual");
      } else if (filters.format === "in-person") {
        query = query.not("location", "eq", "Virtual").not("location", "eq", "Hybrid");
      } else if (filters.format === "hybrid") {
        query = query.eq("location", "Hybrid");
      }
    }
    
    // Search term filter for title or description
    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
    }
  }

  const { data, error } = await query.order("start_date", { ascending: true });

  if (error) {
    toast({
      title: "Error loading courses",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }

  return data as Course[];
}

export async function getCourseBySlug(slug: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    toast({
      title: "Error loading course",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  return data as Course;
}

export async function registerForCourse(courseId: string, userId: string) {
  const { data, error } = await supabase
    .from("course_registrations")
    .insert([
      { course_id: courseId, user_id: userId, status: "pending", payment_status: "unpaid" }
    ])
    .select()
    .single();

  if (error) {
    if (error.code === "23505") { // Unique violation error code
      toast({
        title: "Already registered",
        description: "You have already registered for this course",
        variant: "default",
      });
      return { success: false, message: "Already registered" };
    }
    
    toast({
      title: "Registration failed",
      description: error.message,
      variant: "destructive",
    });
    return { success: false, message: error.message };
  }

  toast({
    title: "Registration successful",
    description: "You have successfully registered for this course",
    variant: "default",
  });
  return { success: true, registration: data };
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("courses")
    .select("category")
    .eq("is_published", true)
    .not("category", "is", null);

  if (error) {
    toast({
      title: "Error loading categories",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }

  // Extract unique categories
  const uniqueCategories = [...new Set(data.map(item => item.category))];
  return uniqueCategories;
}

// Admin functions
export async function getAllCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    toast({
      title: "Error loading courses",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }

  return data as Course[];
}

export async function createCourse(course: Omit<Course, "id">) {
  const { data, error } = await supabase
    .from("courses")
    .insert([course])
    .select()
    .single();

  if (error) {
    toast({
      title: "Error creating course",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  toast({
    title: "Course created",
    description: "The course has been created successfully",
  });
  return data as Course;
}

export async function updateCourse(id: string, course: Partial<Course>) {
  const { data, error } = await supabase
    .from("courses")
    .update(course)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    toast({
      title: "Error updating course",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  toast({
    title: "Course updated",
    description: "The course has been updated successfully",
  });
  return data as Course;
}

export async function deleteCourse(id: string) {
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) {
    toast({
      title: "Error deleting course",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }

  toast({
    title: "Course deleted",
    description: "The course has been deleted successfully",
  });
  return true;
}
