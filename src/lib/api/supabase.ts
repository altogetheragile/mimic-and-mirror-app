import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

// Define ApiResponse type
export type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
};

// Blog Service
export const blogService = {
  // Get all blog posts with author information
  getPosts: async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          profiles:author_id(first_name, last_name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      return { data: null, error };
    }
  },
  
  // Get a single blog post by ID
  getPost: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          profiles:author_id(first_name, last_name)
        `)
        .eq("id", id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error fetching blog post ${id}:`, error);
      return { data: null, error };
    }
  },
  
  // Create a new blog post
  createPost: async (postData: any) => {
    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Add author_id to post data
      const newPost = {
        ...postData,
        author_id: user.id,
        status: 'draft',
      };
      
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(newPost)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      return { data: null, error };
    }
  },
  
  // Update an existing blog post
  updatePost: async (id: string, postData: any) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error updating blog post ${id}:`, error);
      return { data: null, error };
    }
  },
  
  // Delete a blog post
  deletePost: async (id: string) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error: any) {
      console.error(`Error deleting blog post ${id}:`, error);
      return { error };
    }
  },
  
  // Publish a blog post
  publishPost: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error publishing blog post ${id}:`, error);
      return { data: null, error };
    }
  },
  
  // Unpublish a blog post
  unpublishPost: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .update({
          status: 'draft',
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error unpublishing blog post ${id}:`, error);
      return { data: null, error };
    }
  },
};

// Media Service
export const mediaService = {
  // Get all media assets
  getMedia: async () => {
    try {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error fetching media:", error);
      return { data: null, error };
    }
  },
  
  // Get a single media asset by ID
  getMediaById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error fetching media ${id}:`, error);
      return { data: null, error };
    }
  },
  
  // Update a media asset
  updateMedia: async (id: string, mediaData: any) => {
    try {
      const { data, error } = await supabase
        .from("media_assets")
        .update(mediaData)
        .eq("id", id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error updating media ${id}:`, error);
      return { data: null, error };
    }
  },
  
  // Delete a media asset (soft delete)
  deleteMedia: async (id: string) => {
    try {
      const { error } = await supabase
        .from("media_assets")
        .update({ is_deleted: true })
        .eq("id", id);
      
      if (error) {
        throw error;
      }
      
      return { error: null };
    } catch (error: any) {
      console.error(`Error deleting media ${id}:`, error);
      return { error };
    }
  },
  
  // Upload a media asset
  uploadMedia: async (file: File, folder: string = 'general') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Create a unique file path
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}_${file.name.replace(`.${fileExt}`, '')}`;
      const filePath = `${folder}/${fileName}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      // Create media asset record in database
      const mediaRecord = {
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        folder,
        uploaded_by: user.id,
        title: file.name,
      };
      
      const { data, error } = await supabase
        .from("media_assets")
        .insert(mediaRecord)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data, publicUrl, error: null };
    } catch (error: any) {
      console.error("Error uploading media:", error);
      return { data: null, publicUrl: null, error };
    }
  },
  
  // Get public URL for a file path
  getPublicUrl: (filePath: string) => {
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);
    
    return publicUrl;
  },
};

// Settings Service
export const settingsService = {
  // Get all settings
  getAllSettings: async (): Promise<ApiResponse<any[]>> => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("key");
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error fetching site settings:", error);
      return { data: null, error };
    }
  },
  
  // Get setting by key
  getSettingByKey: async (key: string): Promise<ApiResponse<any>> => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", key)
        .maybeSingle();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error fetching setting ${key}:`, error);
      return { data: null, error };
    }
  },
  
  // Upsert setting
  upsertSetting: async (key: string, value: any, description?: string): Promise<ApiResponse<any>> => {
    try {
      const settingData = {
        key,
        value,
        description,
        updated_at: new Date().toISOString()
      };
      
      const { data: existingSetting } = await settingsService.getSettingByKey(key);
      
      const { data, error } = await supabase
        .from("site_settings")
        .upsert(
          existingSetting 
            ? { ...existingSetting, ...settingData }
            : settingData,
          { onConflict: 'key' }
        )
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error upserting setting ${key}:`, error);
      return { data: null, error };
    }
  },
  
  // Delete setting
  deleteSetting: async (key: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .delete()
        .eq("key", key);
      
      if (error) throw error;
      
      return { data: null, error: null };
    } catch (error: any) {
      console.error(`Error deleting setting ${key}:`, error);
      return { data: null, error };
    }
  }
};

export default {
  blogService,
  mediaService,
  settingsService
};
