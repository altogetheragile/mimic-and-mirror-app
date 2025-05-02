
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Plus, Trash2 } from "lucide-react";

const participantSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().optional(),
});

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  contact_person: z.string().min(1, "Contact person name is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().optional(),
  special_requests: z.string().optional(),
  participants: z.array(participantSchema).min(1, "At least one participant is required"),
  course_id: z.string().min(1, "Course ID is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface GroupRegistrationFormProps {
  courseId: string;
  courseName: string;
  onSuccess?: () => void;
}

const GroupRegistrationForm: React.FC<GroupRegistrationFormProps> = ({ 
  courseId, 
  courseName,
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      special_requests: "",
      participants: [{ first_name: "", last_name: "", email: "", role: "" }],
      course_id: courseId,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const registerGroupMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      setIsSubmitting(true);
      
      try {
        // For each participant, create a registration
        const registrations = [];
        
        for (const participant of data.participants) {
          const { data: registration, error } = await supabase
            .from("course_registrations")
            .insert({
              course_id: courseId,
              status: "pending",
              payment_status: "unpaid",
              user_id: "00000000-0000-0000-0000-000000000000", // Placeholder for group registrations
              metadata: {
                first_name: participant.first_name,
                last_name: participant.last_name,
                email: participant.email,
                role: participant.role,
                company: data.company_name,
                contact_person: data.contact_person,
                contact_email: data.contact_email,
                contact_phone: data.contact_phone,
                special_requests: data.special_requests,
                is_group_registration: true
              }
            })
            .select();
            
          if (error) throw error;
          registrations.push(registration);
        }
        
        return registrations;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Group Registration Successful",
        description: `Your group has been registered for ${courseName}. We will contact you soon with further details.`,
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "There was a problem registering your group. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    registerGroupMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Company Information</h3>
            
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name of contact person" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Contact Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="special_requests"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Special Requests (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any specific requirements or requests"
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Participants</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ first_name: "", last_name: "", email: "", role: "" })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Participant
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-md p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Participant {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`participants.${index}.first_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`participants.${index}.last_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name={`participants.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`participants.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Register Group'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GroupRegistrationForm;
