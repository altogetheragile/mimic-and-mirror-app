
import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ContactForm from "@/components/ContactForm";
import { settingsService } from "@/lib/api/supabase";

const Contact = () => {
  // Fetch contact settings
  const { data: settingsData } = useQuery({
    queryKey: ["contactSettings"],
    queryFn: async () => {
      const response = await settingsService.getSettingByKey("contact_info");
      return response.data?.value || {
        email: "contact@example.com",
        phone: "+1 (123) 456-7890",
        address: "123 Main Street, City, Country",
      };
    },
  });

  const contactInfo = settingsData || {
    email: "contact@example.com",
    phone: "+1 (123) 456-7890",
    address: "123 Main Street, City, Country",
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions or want to learn more about our services? We'd love to hear from you!
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
          <ContactForm />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
          <div className="space-y-8 mt-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full mr-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Email</h3>
                <p className="text-gray-600 mt-1">
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-primary">
                    {contactInfo.email}
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  We'll respond within 24-48 hours
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full mr-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Phone</h3>
                <p className="text-gray-600 mt-1">
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-primary">
                    {contactInfo.phone}
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Mon-Fri, 9am-5pm (EST)
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full mr-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Office</h3>
                <p className="text-gray-600 mt-1">
                  {contactInfo.address}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Please schedule an appointment before visiting
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
