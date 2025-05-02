
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/lib/api/supabase';
import { toast } from '@/components/ui/use-toast';

// Types for site settings
type SiteSetting = {
  key: string;
  value: any;
  description?: string;
};

interface SiteSettingsContextType {
  settings: Record<string, any>;
  isLoading: boolean;
  error: Error | null;
  updateSetting: (key: string, value: any, description?: string) => Promise<void>;
  getSetting: <T>(key: string, defaultValue?: T) => T | undefined;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: {},
  isLoading: false,
  error: null,
  updateSetting: async () => {},
  getSetting: () => undefined,
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider: React.FC<SiteSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();

  // Fetch all settings from the database
  const { data, isLoading, error } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const response = await settingsService.getAllSettings();
      if (response.error) throw response.error;
      return response.data || [];
    },
  });

  // Mutation for updating settings
  const mutation = useMutation({
    mutationFn: async ({ key, value, description }: { key: string; value: any; description?: string }) => {
      const response = await settingsService.upsertSetting(key, value, description);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating setting',
        description: error.message || 'Failed to update setting',
        variant: 'destructive',
      });
    }
  });

  // Format settings as a key-value object for easier consumption
  useEffect(() => {
    if (data) {
      const settingsObj = data.reduce((acc, setting: SiteSetting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>);
      
      setSettings(settingsObj);
    }
  }, [data]);

  // Update a setting
  const updateSetting = async (key: string, value: any, description?: string) => {
    try {
      await mutation.mutateAsync({ key, value, description });
      toast({
        title: 'Setting updated',
        description: `${key} has been updated successfully`,
      });
    } catch (error: any) {
      console.error("Error updating setting:", error);
      // Error is already handled in mutation onError
    }
  };

  // Get a setting with optional default value
  const getSetting = <T,>(key: string, defaultValue?: T): T | undefined => {
    if (settings[key] !== undefined) {
      return settings[key] as T;
    }
    return defaultValue;
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        error: error as Error | null,
        updateSetting,
        getSetting,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};
