
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mediaService } from "@/lib/api/supabase";

// Form validation schema
const mediaSchema = z.object({
  title: z.string().optional(),
  alt_text: z.string().optional(),
  folder: z.string().optional(),
});

export type MediaFormValues = z.infer<typeof mediaSchema>;

interface MediaFormProps {
  initialData?: any;
  onSubmit: (data: MediaFormValues) => void;
}

export function MediaForm({ initialData, onSubmit }: MediaFormProps) {
  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      title: initialData?.title || initialData?.file_name || "",
      alt_text: initialData?.alt_text || "",
      folder: initialData?.folder || "",
    },
  });

  const handleSubmit = (data: MediaFormValues) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      {initialData && (
        <div className="bg-gray-50 p-4 rounded-md flex justify-center">
          {initialData.file_type.startsWith("image") ? (
            <img
              src={mediaService.getPublicUrl(initialData.file_path)}
              alt={initialData.alt_text || initialData.title || initialData.file_name}
              className="max-h-48 object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-32 w-full">
              <p className="text-lg font-medium">{initialData.file_type.split('/')[1]?.toUpperCase()}</p>
              <p className="text-sm mt-1">{initialData.file_name}</p>
            </div>
          )}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Media title" {...field} />
                </FormControl>
                <FormDescription>
                  A descriptive title for your media
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alt_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alt Text</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Description for accessibility" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Alternative text for screen readers and accessibility
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="folder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Folder</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. products, blog, general" {...field} />
                </FormControl>
                <FormDescription>
                  Categorize media into folders (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
      
      <div className="pt-4 border-t">
        <h3 className="font-medium mb-2">File Information</h3>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">File Name</dt>
          <dd>{initialData?.file_name}</dd>
          <dt className="text-muted-foreground">File Type</dt>
          <dd>{initialData?.file_type}</dd>
          <dt className="text-muted-foreground">Size</dt>
          <dd>{initialData ? `${(initialData.file_size / 1024).toFixed(2)} KB` : "Unknown"}</dd>
          <dt className="text-muted-foreground">Uploaded</dt>
          <dd>{initialData?.created_at && new Date(initialData.created_at).toLocaleString()}</dd>
        </dl>
      </div>
    </div>
  );
}
