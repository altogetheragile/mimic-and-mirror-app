
import { supabase } from "@/integrations/supabase/client";

export interface CourseTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  category: string;
  content: string;
  price: number;
  prerequisites: string;
  created_at: string;
  created_by: string;
}

export const getAllCourseTemplates = async () => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_template", true);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getCourseTemplateById = async (id: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("is_template", true)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createCourseTemplate = async (template: Partial<CourseTemplate>) => {
  const { data, error } = await supabase
    .from("courses")
    .insert([{ ...template, is_template: true }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateCourseTemplate = async (id: string, template: Partial<CourseTemplate>) => {
  const { data, error } = await supabase
    .from("courses")
    .update(template)
    .eq("id", id)
    .eq("is_template", true)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteCourseTemplate = async (id: string) => {
  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id)
    .eq("is_template", true);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export const createCourseFromTemplate = async (templateId: string, courseData: any) => {
  // First, get the template
  const template = await getCourseTemplateById(templateId);
  
  if (!template) {
    throw new Error("Template not found");
  }
  
  // Create a new course based on the template
  const { id, created_at, updated_at, ...templateData } = template;
  
  const newCourse = {
    ...templateData,
    ...courseData,
    is_template: false,
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from("courses")
    .insert([newCourse])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
