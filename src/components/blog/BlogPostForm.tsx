
import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { MediaSelector } from "@/components/media/MediaSelector";

// Slug generation helper
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
};

// Form validation schema
const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().optional(),
  featured_image_url: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  initialData?: any;
  onSubmit: (data: BlogPostFormValues & { author_id: string }) => void;
}

export function BlogPostForm({ initialData, onSubmit }: BlogPostFormProps) {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("content");
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      featured_image_url: initialData?.featured_image_url || "",
      meta_description: initialData?.meta_description || "",
      meta_keywords: initialData?.meta_keywords || "",
    },
  });

  // Auto-generate slug from title if not in edit mode
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!initialData) {
      const title = event.target.value;
      form.setValue("slug", generateSlug(title));
    }
  };

  const handleFormSubmit = (data: BlogPostFormValues) => {
  onSubmit({
    ...data,
    author_id: user?.id,
  });
};

  const handleSelectMedia = (url: string) => {
    form.setValue("featured_image_url", url);
    setShowMediaSelector(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Post title" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleTitleChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="post-url-slug" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used for the URL of your post
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="excerpt">Excerpt & Featured Image</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="pt-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your content here..." 
                        className="min-h-[400px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="excerpt" className="pt-4">
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A short summary of your post..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This will be shown on blog index pages and in social media previews
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="featured_image_url"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Featured Image</FormLabel>
                    <div className="grid gap-4">
                      {field.value && (
                        <div className="border rounded-md p-1">
                          <img 
                            src={field.value} 
                            alt="Featured" 
                            className="rounded max-h-48 object-contain"
                          />
                        </div>
                      )}
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowMediaSelector(true)}
                      >
                        {field.value ? "Change Image" : "Select Image"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="seo" className="pt-4">
              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description for search engines..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="meta_keywords"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Meta Keywords</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="keyword1, keyword2, keyword3" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2">
            <Button type="submit">
              {initialData ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </Form>

      {showMediaSelector && (
        <MediaSelector 
          onSelect={handleSelectMedia}
          onClose={() => setShowMediaSelector(false)}
        />
      )}
    </>
  );
}
