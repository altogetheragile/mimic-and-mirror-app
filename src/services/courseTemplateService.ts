
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface CourseTemplate {
  id: string;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  level?: string;
  duration?: number;
  price?: number;
  prerequisites?: string;
  image_url?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  is_template: boolean;
}

// Get all course templates
export const getAllCourseTemplates = async (): Promise<CourseTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_template", true)
      .order("title", { ascending: true });

    if (error) throw error;

    // Transform data into CourseTemplate type
    const templates: CourseTemplate[] = data.map((item: any) => ({
      ...item,
      is_template: true
    }));

    return templates;
  } catch (error: any) {
    toast({
      title: "Failed to load templates",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

// Get a template by ID
export const getTemplateById = async (id: string): Promise<CourseTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .eq("is_template", true)
      .single();

    if (error) throw error;

    // Transform data into CourseTemplate type
    const template: CourseTemplate = {
      ...data,
      is_template: true
    };

    return template;
  } catch (error: any) {
    toast({
      title: "Failed to load template",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Create a new template
export const createTemplate = async (templateData: Partial<CourseTemplate>): Promise<CourseTemplate | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          ...templateData,
          created_by: userData.user.id,
          slug: `template-${Date.now()}`, // Generate a unique slug
          is_template: true
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Transform data into CourseTemplate type
    const template: CourseTemplate = {
      ...data,
      is_template: true
    };

    toast({
      title: "Template created",
      description: "The course template has been created successfully",
    });

    return template;
  } catch (error: any) {
    toast({
      title: "Failed to create template",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Update a template
export const updateTemplate = async (id: string, templateData: Partial<CourseTemplate>): Promise<CourseTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .update({
        ...templateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Transform data into CourseTemplate type
    const template: CourseTemplate = {
      ...data,
      is_template: true
    };

    toast({
      title: "Template updated",
      description: "The course template has been updated successfully",
    });

    return template;
  } catch (error: any) {
    toast({
      title: "Failed to update template",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Delete a template
export const deleteCourseTemplate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id)
      .eq("is_template", true);

    if (error) throw error;

    toast({
      title: "Template deleted",
      description: "The course template has been deleted successfully",
    });

    return true;
  } catch (error: any) {
    toast({
      title: "Failed to delete template",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Create a new course from a template
export const createCourseFromTemplate = async (templateId: string, courseData: any): Promise<any> => {
  try {
    // Get the template
    const template = await getTemplateById(templateId);
    if (!template) throw new Error("Template not found");

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    // Create a new course from the template
    const { content, description, title, category, level, duration, price, prerequisites, image_url } = template;
    
    const { data, error } = await supabase
      .from("courses")
      .insert([{
        title,
        content,
        description,
        category,
        level,
        duration,
        price,
        prerequisites,
        image_url,
        created_by: userData.user.id,
        slug: `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`.substring(0, 100),
        is_template: false,
        is_published: courseData?.is_published || false,
        start_date: courseData?.start_date,
        end_date: courseData?.end_date,
        location: courseData?.location,
        capacity: courseData?.capacity
      }])
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Course created",
      description: "A new course has been created from the template",
    });

    return data;
  } catch (error: any) {
    toast({
      title: "Failed to create course",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export default {
  getTemplates: getAllCourseTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate: deleteCourseTemplate,
  createCourseFromTemplate
};
