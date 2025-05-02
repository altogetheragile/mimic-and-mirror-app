
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface CourseTemplate {
  id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  content?: string;
  prerequisites?: string;
  duration?: number;
  price?: number;
  image_url?: string;
  created_at?: string;
  created_by?: string;
  is_template: boolean;
}

export const getAllCourseTemplates = async (): Promise<CourseTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_template", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []) as CourseTemplate[];
  } catch (error: any) {
    toast({
      title: "Error fetching course templates",
      description: error.message || "Failed to fetch course templates",
      variant: "destructive",
    });
    return [];
  }
};

export const getCourseTemplateById = async (id: string): Promise<CourseTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .eq("is_template", true)
      .single();

    if (error) throw error;

    return data as CourseTemplate;
  } catch (error: any) {
    toast({
      title: "Error fetching course template",
      description: error.message || "Failed to fetch course template",
      variant: "destructive",
    });
    return null;
  }
};

export const createCourseTemplate = async (
  template: Omit<CourseTemplate, 'id' | 'created_at' | 'is_template'>
): Promise<CourseTemplate | null> => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const created_by = authData?.user?.id;

    const { data, error } = await supabase
      .from("courses")
      .insert([{ ...template, created_by, is_template: true }])
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Success",
      description: "Course template created successfully",
    });

    return data as CourseTemplate;
  } catch (error: any) {
    toast({
      title: "Error creating course template",
      description: error.message || "Failed to create course template",
      variant: "destructive",
    });
    return null;
  }
};

export const updateCourseTemplate = async (
  id: string,
  updates: Partial<CourseTemplate>
): Promise<CourseTemplate | null> => {
  try {
    // Prevent invalid keys from being passed to Supabase
    const { id: _, created_at, created_by, is_template, ...safeUpdates } = updates;

    const { data, error } = await supabase
      .from("courses")
      .update(safeUpdates)
      .eq("id", id)
      .eq("is_template", true)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Success",
      description: "Course template updated successfully",
    });

    return data as CourseTemplate;
  } catch (error: any) {
    toast({
      title: "Error updating course template",
      description: error.message || "Failed to update course template",
      variant: "destructive",
    });
    return null;
  }
};

export const deleteCourseTemplate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id)
      .eq("is_template", true);

    if (error) throw error;

    toast({
      title: "Success",
      description: "Course template deleted successfully",
    });

    return true;
  } catch (error: any) {
    toast({
      title: "Error deleting course template",
      description: error.message || "Failed to delete course template",
      variant: "destructive",
    });
    return false;
  }
};

export const createCourseFromTemplate = async (
  templateId: string,
  courseData: {
    start_date: string;
    end_date?: string;
    location?: string;
    capacity?: number;
    is_published?: boolean;
  }
): Promise<any> => {
  try {
    const template = await getCourseTemplateById(templateId);
    if (!template) throw new Error("Template not found");

    const startDate = new Date(courseData.start_date);
    const slug = `${template.title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-")}-${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}`;

    const { data: authData } = await supabase.auth.getUser();
    const created_by = authData?.user?.id;

    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          title: template.title,
          description: template.description,
          content: template.content,
          category: template.category,
          level: template.level,
          prerequisites: template.prerequisites,
          duration: template.duration,
          price: template.price,
          image_url: template.image_url,
          created_by,
          start_date: courseData.start_date,
          end_date: courseData.end_date,
          location: courseData.location,
          capacity: courseData.capacity,
          is_published: courseData.is_published || false,
          is_template: false,
          slug,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Success",
      description: "Course created from template successfully",
    });

    return data;
  } catch (error: any) {
    toast({
      title: "Error creating course from template",
      description: error.message || "Failed to create course from template",
      variant: "destructive",
    });
    return null;
  }
};
