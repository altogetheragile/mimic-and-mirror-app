import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader, Save } from "lucide-react";

// Define schema for general settings
const generalSettingsSchema = z.object({
  site_name: z.string().min(1, { message: "Site name is required" }),
  site_description: z.string().optional(),
  contact_email: z.string().email({ message: "Invalid email address" }),
  company_name: z.string().optional(),
});

// Define schema for mail settings
const mailSettingsSchema = z.object({
  admin_email: z.string().email({ message: "Invalid email address" }),
  smtp_host: z.string().min(1, { message: "SMTP host is required" }),
  smtp_port: z.string().refine((val) => !isNaN(Number(val)), {
    message: "SMTP port must be a number",
  }),
  smtp_username: z.string().min(1, { message: "SMTP username is required" }),
  smtp_password: z.string().min(1, { message: "SMTP password is required" }),
});

// Define schema for social settings
const socialSettingsSchema = z.object({
  linkedin_url: z.string().url().optional().or(z.literal("")),
  twitter_url: z.string().url().optional().or(z.literal("")),
  facebook_url: z.string().url().optional().or(z.literal("")),
  instagram_url: z.string().url().optional().or(z.literal("")),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type MailSettingsValues = z.infer<typeof mailSettingsSchema>;
type SocialSettingsValues = z.infer<typeof socialSettingsSchema>;

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { settings, isLoading, updateSetting } = useSiteSettings();
  const [submitting, setSubmitting] = useState(false);

  // Initialize general settings form
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      site_name: settings["site_name"] || "Altogether Agile",
      site_description: settings["site_description"] || "",
      contact_email: settings["contact_email"] || "",
      company_name: settings["company_name"] || "Altogether Agile Ltd",
    },
  });

  // Initialize mail settings form
  const mailForm = useForm<MailSettingsValues>({
    resolver: zodResolver(mailSettingsSchema),
    defaultValues: {
      admin_email: settings["admin_email"] || "",
      smtp_host: settings["smtp_host"] || "",
      smtp_port: settings["smtp_port"] || "587",
      smtp_username: settings["smtp_username"] || "",
      smtp_password: settings["smtp_password"] || "",
    },
  });

  // Initialize social settings form
  const socialForm = useForm<SocialSettingsValues>({
    resolver: zodResolver(socialSettingsSchema),
    defaultValues: {
      linkedin_url: settings["linkedin_url"] || "",
      twitter_url: settings["twitter_url"] || "",
      facebook_url: settings["facebook_url"] || "",
      instagram_url: settings["instagram_url"] || "",
    },
  });

  // Update form values when settings are loaded
  React.useEffect(() => {
    if (!isLoading && settings) {
      generalForm.reset({
        site_name: settings["site_name"] || "Altogether Agile",
        site_description: settings["site_description"] || "",
        contact_email: settings["contact_email"] || "",
        company_name: settings["company_name"] || "Altogether Agile Ltd",
      });

      mailForm.reset({
        admin_email: settings["admin_email"] || "",
        smtp_host: settings["smtp_host"] || "",
        smtp_port: settings["smtp_port"] || "587",
        smtp_username: settings["smtp_username"] || "",
        smtp_password: settings["smtp_password"] || "",
      });

      socialForm.reset({
        linkedin_url: settings["linkedin_url"] || "",
        twitter_url: settings["twitter_url"] || "",
        facebook_url: settings["facebook_url"] || "",
        instagram_url: settings["instagram_url"] || "",
      });
    }
  }, [isLoading, settings]);

  const onSubmitGeneral = async (data: GeneralSettingsValues) => {
    setSubmitting(true);
    try {
      // Update each setting individually
      await Promise.all(
        Object.entries(data).map(([key, value]) => 
          updateSetting(key, value)
        )
      );
      toast({
        title: "Settings saved",
        description: "General settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to update general settings",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitMail = async (data: MailSettingsValues) => {
    setSubmitting(true);
    try {
      // Update each setting individually
      await Promise.all(
        Object.entries(data).map(([key, value]) => 
          updateSetting(key, value)
        )
      );
      
      // Store these as environment variables for Edge Functions instead
      // (In production you would use Supabase secrets management)
      toast({
        title: "Settings saved",
        description: "Mail settings have been updated successfully. For these settings to affect edge functions, you'll need to update your Supabase secrets manually.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to update mail settings",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitSocial = async (data: SocialSettingsValues) => {
    setSubmitting(true);
    try {
      // Update each setting individually
      await Promise.all(
        Object.entries(data).map(([key, value]) => 
          updateSetting(key, value)
        )
      );
      toast({
        title: "Settings saved",
        description: "Social settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to update social settings",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">
            Manage your website configuration
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="mail">Mail</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic information about your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form
                  onSubmit={generalForm.handleSubmit(onSubmitGeneral)}
                  className="space-y-4"
                >
                  <FormField
                    control={generalForm.control}
                    name="site_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="site_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="mt-4" disabled={submitting}>
                    {submitting && (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mail Settings */}
        <TabsContent value="mail">
          <Card>
            <CardHeader>
              <CardTitle>Mail Settings</CardTitle>
              <CardDescription>
                Configure SMTP settings for sending emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...mailForm}>
                <form
                  onSubmit={mailForm.handleSubmit(onSubmitMail)}
                  className="space-y-4"
                >
                  <FormField
                    control={mailForm.control}
                    name="admin_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={mailForm.control}
                    name="smtp_host"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Host</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={mailForm.control}
                    name="smtp_port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Port</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={mailForm.control}
                    name="smtp_username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={mailForm.control}
                    name="smtp_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMTP Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="mt-4" disabled={submitting}>
                    {submitting && (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Link your social media accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...socialForm}>
                <form
                  onSubmit={socialForm.handleSubmit(onSubmitSocial)}
                  className="space-y-4"
                >
                  <FormField
                    control={socialForm.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialForm.control}
                    name="twitter_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialForm.control}
                    name="facebook_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialForm.control}
                    name="instagram_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="mt-4" disabled={submitting}>
                    {submitting && (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-6 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-medium mb-2">Help & Information</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          The settings on this page affect how your website appears and functions. Changes are applied immediately.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>
            <strong>General Settings</strong>: Change your site name, description, and contact information.
          </li>
          <li>
            <strong>Mail Settings</strong>: Configure the SMTP server used for sending emails from the contact form.
          </li>
          <li>
            <strong>Social Media</strong>: Add links to your social media profiles that will appear in the footer.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSettings;
