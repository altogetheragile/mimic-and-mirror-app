
import { createClient } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://rhjucbgwipmmiisskmcz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoanVjYmd3aXBtbWlpc3NrbWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MTMyMzcsImV4cCI6MjA2MTQ4OTIzN30.NjLXJLrParqrcUSTnAVUKRN6RTswsLrKXyXP9Badn9M"
);

export interface ApiResponse<T = any> {
  data: T | null;
  error: Error | null;
}

// Site Settings Service
export const settingsService = {
  getAllSettings: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      return { data: null, error };
    }
  },
  
  getSettingByKey: async (key: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error fetching setting by key ${key}:`, error);
      return { data: null, error };
    }
  },
  
  upsertSetting: async (key: string, value: any, description?: string): Promise<ApiResponse> => {
    try {
      // Check if setting exists
      const { data: existingData } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .single();
      
      let result;
      
      if (existingData) {
        // Update existing setting
        result = await supabase
          .from('site_settings')
          .update({ value, description: description || existingData.description, updated_at: new Date() })
          .eq('key', key);
      } else {
        // Insert new setting
        result = await supabase
          .from('site_settings')
          .insert([{ key, value, description }]);
      }
      
      if (result.error) throw result.error;
      
      return { data: result.data, error: null };
    } catch (error: any) {
      console.error(`Error upserting setting ${key}:`, error);
      return { data: null, error };
    }
  }
};

// Media Service
export const mediaService = {
  getMedia: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false })
        .eq('is_deleted', false);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching media:', error);
      return { data: null, error };
    }
  },
  
  getMediaById: async (id: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error fetching media by id ${id}:`, error);
      return { data: null, error };
    }
  },
  
  uploadMedia: async (file: File, metadata: { title?: string, alt_text?: string, folder?: string }): Promise<ApiResponse> => {
    try {
      // Generate a unique file path
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const filePath = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      // Upload file to storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .upload(filePath, file);
      
      if (storageError) throw storageError;
      
      // Create database record
      const { data, error } = await supabase
        .from('media_assets')
        .insert([{
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          title: metadata.title || file.name,
          alt_text: metadata.alt_text || '',
          folder: metadata.folder || '',
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error uploading media:', error);
      return { data: null, error };
    }
  },
  
  updateMedia: async (id: string, metadata: { title?: string, alt_text?: string, folder?: string }): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .update({
          title: metadata.title,
          alt_text: metadata.alt_text,
          folder: metadata.folder,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error updating media ${id}:`, error);
      return { data: null, error };
    }
  },
  
  deleteMedia: async (id: string): Promise<ApiResponse> => {
    try {
      // Get the file path
      const { data: mediaData, error: fetchError } = await supabase
        .from('media_assets')
        .select('file_path')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Soft delete in database
      const { data, error } = await supabase
        .from('media_assets')
        .update({ is_deleted: true })
        .eq('id', id);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error deleting media ${id}:`, error);
      return { data: null, error };
    }
  },
  
  getPublicUrl: (filePath: string): string => {
    return supabase.storage.from('media').getPublicUrl(filePath).data.publicUrl;
  }
};

// Blog Service
export const blogService = {
  getPosts: async (): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      return { data: null, error };
    }
  },
  
  getPostById: async (id: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error fetching blog post by id ${id}:`, error);
      return { data: null, error };
    }
  },
  
  createPost: async (post: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      return { data: null, error };
    }
  },
  
  updatePost: async (id: string, post: any): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error updating blog post ${id}:`, error);
      return { data: null, error };
    }
  },
  
  deletePost: async (id: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error(`Error deleting blog post ${id}:`, error);
      return { data: null, error };
    }
  }
};
