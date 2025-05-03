
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
