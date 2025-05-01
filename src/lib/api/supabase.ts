import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Generic error handler for API requests
export const handleApiError = (error: any, customMessage?: string) => {
  console.error("API Error:", error);
  toast({
    title: "Error",
    description: customMessage || error.message || "An unexpected error occurred",
    variant: "destructive",
  });
  return { error };
};

// Generic success handler
export const handleApiSuccess = (message: string) => {
  toast({
    title: "Success",
    description: message,
  });
};

// Type for API response
export type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
};

// Blog service
export const blogService = {
  // Get blog posts with optional filters
  async getPosts(filters?: { status?: string; limit?: number; }): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase
        .from("blog_posts")
        .select("*, profiles(first_name, last_name)");
      
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      
      query = query.order("created_at", { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to fetch blog posts");
    }
  },

  // Get a single blog post by slug
  async getPostBySlug(slug: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, profiles(first_name, last_name)")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to fetch blog post");
    }
  },

  // Create a new blog post
  async createPost(post: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(post)
        .select()
        .single();
      
      if (error) throw error;
      handleApiSuccess("Blog post created successfully");
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to create blog post");
    }
  },

  // Update an existing blog post
  async updatePost(id: string, post: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .update(post)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      handleApiSuccess("Blog post updated successfully");
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to update blog post");
    }
  },

  // Delete a blog post
  async deletePost(id: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      handleApiSuccess("Blog post deleted successfully");
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to delete blog post");
    }
  },

  // Publish a blog post
  async publishPost(id: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      handleApiSuccess("Blog post published successfully");
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to publish blog post");
    }
  },

  // Unpublish a blog post
  async unpublishPost(id: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .update({
          status: "draft",
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      handleApiSuccess("Blog post unpublished successfully");
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to unpublish blog post");
    }
  }
};

// Media service
export const mediaService = {
  // Get all media assets
  async getMedia(filters?: { folder?: string; type?: string; limit?: number }): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase
        .from("media_assets")
        .select("*")
        .eq("is_deleted", false);
      
      if (filters?.folder) {
        query = query.eq("folder", filters.folder);
      }
      
      if (filters?.type) {
        query = query.eq("file_type", filters.type);
      }
      
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      
      query = query.order("created_at", { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to fetch media");
    }
  },

  // Get a single media asset
  async getMediaById(id: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to fetch media item");
    }
  },

  // Upload media to storage
  async uploadMedia(file: File, folder: string = "general"): Promise<ApiResponse<any>> {
    try {
      // Generate a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      
      // Upload to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("media")
        .upload(filePath, file);
      
      if (storageError) throw storageError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);
      
      // Create media asset record
      const { data, error } = await supabase
        .from("media_assets")
        .insert({
          file_name: fileName,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
          folder: folder,
          alt_text: fileName,
          title: fileName
        })
        .select()
        .single();
      
      if (error) throw error;
      
      handleApiSuccess("Media uploaded successfully");
      
      return { 
        data: { 
          ...data,
          url: publicUrlData.publicUrl
        }, 
        error: null 
      };
    } catch (error) {
      return handleApiError(error, "Failed to upload media");
    }
  },

  // Update media metadata
  async updateMedia(id: string, metadata: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("media_assets")
        .update(metadata)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      
      handleApiSuccess("Media updated successfully");
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to update media");
    }
  },

  // Soft delete media
  async deleteMedia(id: string): Promise<ApiResponse<any>> {
    try {
      // Soft delete by setting is_deleted to true
      const { data, error } = await supabase
        .from("media_assets")
        .update({ is_deleted: true })
        .eq("id", id);
      
      if (error) throw error;
      
      handleApiSuccess("Media deleted successfully");
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to delete media");
    }
  },
  
  // Get public URL for a file path
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from("media")
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
};

// Settings service
export const settingsService = {
  // Get all settings
  async getAllSettings(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to fetch settings");
    }
  },

  // Get a setting by key
  async getSettingByKey(key: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", key)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to fetch setting");
    }
  },

  // Update or create a setting
  async upsertSetting(key: string, value: any, description?: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .upsert(
          {
            key,
            value,
            description: description || null,
            updated_at: new Date().toISOString()
          },
          { onConflict: "key" }
        )
        .select()
        .single();
      
      if (error) throw error;
      
      handleApiSuccess("Setting updated successfully");
      return { data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to update setting");
    }
  }
};

// User service (extending existing implementation)
export const userService = {
  async updateUserRole(userId: string, role: 'admin' | 'instructor' | 'student'): Promise<ApiResponse<any>> {
    try {
      // First check if the user already has a role
      const { data: existingRole, error: fetchError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      
      let result;
      
      if (fetchError) throw fetchError;
      
      if (existingRole) {
        // Update existing role
        result = await supabase
          .from("user_roles")
          .update({ role })
          .eq("user_id", userId)
          .select()
          .single();
      } else {
        // Insert new role
        result = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role })
          .select()
          .single();
      }
      
      if (result.error) throw result.error;
      
      handleApiSuccess(`User role updated to ${role}`);
      return { data: result.data, error: null };
    } catch (error) {
      return handleApiError(error, "Failed to update user role");
    }
  },
  
  // Other user methods can be added here
};
