
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import slugify from "slugify";
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
import { Switch } from "@/components/ui/switch";
import { MediaSelector } from "@/components/media/MediaSelector";

// Schema for blog post form validation
const blogPostSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  excerpt: z.string().optional(),
  featured_image_url: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  slug: z.string().optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export function BlogPostForm({ onSubmit, initialData }: BlogPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string | undefined>(
    initialData?.featured_image_url
  );
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug);

  // Form definition with default values
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      featured_image_url: initialData?.featured_image_url || "",
      meta_description: initialData?.meta_description || "",
      meta_keywords: initialData?.meta_keywords || "",
      slug: initialData?.slug || "",
    },
  });

  // Handle title change for auto-slug generation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (autoSlug) {
      const newSlug = slugify(e.target.value, { lower: true, strict: true });
      form.setValue("slug", newSlug);
    }
  };

  // Handle media selection for featured image
  const handleMediaSelect = (media: any) => {
    if (media && media.url) {
      form.setValue("featured_image_url", media.url);
      setFeaturedImage(media.url);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (values: BlogPostFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Send only form data, the author_id will be added in the API layer
      await onSubmit(values);
      
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error submitting blog post:", error);
    }
  };
  
  const handleCloseMedia = () => {
  // You can customize this if you need to close a modal or take any action
  console.log("MediaSelector closed");
  };
  
  return (
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

        <div className="flex items-center gap-2">
          <Switch
            checked={autoSlug}
            onCheckedChange={setAutoSlug}
            id="auto-slug"
          />
          <label htmlFor="auto-slug" className="text-sm">
            Auto-generate slug from title
          </label>
        </div>

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} readOnly={autoSlug} />
              </FormControl>
              <FormDescription>
                This will be used in the URL of your blog post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormDescription>
                A short summary of the blog post for previews
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input {...field} className="hidden" />
                  <MediaSelector onSelect={handleMediaSelect} onClose={handleCloseMedia} />
                  {featuredImage && (
                    <div className="mt-2">
                      <img
                        src={featuredImage}
                        alt="Featured"
                        className="max-h-48 rounded border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          form.setValue("featured_image_url", "");
                          setFeaturedImage(undefined);
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Select an image to be displayed with the blog post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="meta_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormDescription>For SEO purposes</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meta_keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Keywords</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Comma-separated keywords for SEO
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Blog Post"
              : "Create Blog Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
