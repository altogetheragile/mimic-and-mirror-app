
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [siteInfo, setSiteInfo] = useState({
    title: "",
    tagline: "",
    description: ""
  });
  
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: ""
  });
  
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    twitter: "",
    facebook: ""
  });

  // Fetch site settings
  const { refetch } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");
        
      if (error) {
        throw error;
      }
      
      // Process the data to update state
      data.forEach((setting) => {
        if (setting.key === "site_info") {
          setSiteInfo(setting.value as any);
        } else if (setting.key === "contact_info") {
          setContactInfo(setting.value as any);
        } else if (setting.key === "social_links") {
          setSocialLinks(setting.value as any);
        }
      });
      
      return data;
    },
  });

  const handleSiteInfoSave = async () => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: siteInfo })
      .eq("key", "site_info");
      
    if (error) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Settings saved",
      description: "Your site information has been updated",
    });
  };
  
  const handleContactInfoSave = async () => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: contactInfo })
      .eq("key", "contact_info");
      
    if (error) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Settings saved",
      description: "Your contact information has been updated",
    });
  };
  
  const handleSocialLinksSave = async () => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: socialLinks })
      .eq("key", "social_links");
      
    if (error) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Settings saved",
      description: "Your social links have been updated",
    });
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Site Settings</h1>
      </div>
      
      <Tabs defaultValue="site-info">
        <TabsList className="mb-8">
          <TabsTrigger value="site-info">Site Information</TabsTrigger>
          <TabsTrigger value="contact-info">Contact Information</TabsTrigger>
          <TabsTrigger value="social-links">Social Media Links</TabsTrigger>
        </TabsList>
        
        <TabsContent value="site-info">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Basic information about your website that appears in various places.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input 
                  id="site-title" 
                  value={siteInfo.title} 
                  onChange={(e) => setSiteInfo({...siteInfo, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-tagline">Tagline</Label>
                <Input 
                  id="site-tagline" 
                  value={siteInfo.tagline} 
                  onChange={(e) => setSiteInfo({...siteInfo, tagline: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Description</Label>
                <Textarea 
                  id="site-description" 
                  rows={4}
                  value={siteInfo.description} 
                  onChange={(e) => setSiteInfo({...siteInfo, description: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSiteInfoSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact-info">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How visitors can get in touch with your organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email Address</Label>
                <Input 
                  id="contact-email" 
                  type="email"
                  value={contactInfo.email} 
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input 
                  id="contact-phone" 
                  value={contactInfo.phone} 
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-address">Address</Label>
                <Textarea 
                  id="contact-address" 
                  rows={3}
                  value={contactInfo.address} 
                  onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContactInfoSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="social-links">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Connect your social media profiles to your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin-url">LinkedIn</Label>
                <Input 
                  id="linkedin-url" 
                  placeholder="https://linkedin.com/company/your-company"
                  value={socialLinks.linkedin} 
                  onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter-url">Twitter</Label>
                <Input 
                  id="twitter-url" 
                  placeholder="https://twitter.com/your-handle"
                  value={socialLinks.twitter} 
                  onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook-url">Facebook</Label>
                <Input 
                  id="facebook-url" 
                  placeholder="https://facebook.com/your-page"
                  value={socialLinks.facebook} 
                  onChange={(e) => setSocialLinks({...socialLinks, facebook: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSocialLinksSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
