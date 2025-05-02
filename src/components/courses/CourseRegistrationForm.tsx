
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { courseRegistrationService, CourseRegistration, GroupRegistration } from "@/lib/api/courseRegistration";

// Schema for individual registration
const individualSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  special_requests: z.string().optional(),
});

// Schema for group registration
const groupSchema = z.object({
  contact_name: z.string().min(1, { message: "Contact name is required" }),
  contact_email: z.string().email({ message: "Valid email is required" }),
  contact_phone: z.string().optional(),
  company: z.string().min(1, { message: "Company name is required" }),
  special_requests: z.string().optional(),
  participants: z.array(
    z.object({
      first_name: z.string().min(1, { message: "First name is required" }),
      last_name: z.string().min(1, { message: "Last name is required" }),
      email: z.string().email({ message: "Valid email is required" }),
      phone: z.string().optional(),
    })
  ).min(2, { message: "At least 2 participants are required for group registration" }),
});

type IndividualFormValues = z.infer<typeof individualSchema>;
type GroupFormValues = z.infer<typeof groupSchema>;

interface CourseRegistrationFormProps {
  courseId: string;
  onSuccess?: () => void;
}

export function CourseRegistrationForm({ courseId, onSuccess }: CourseRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationType, setRegistrationType] = useState<"individual" | "group">("individual");

  // Individual registration form
  const individualForm = useForm<IndividualFormValues>({
    resolver: zodResolver(individualSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      special_requests: "",
    },
  });

  // Group registration form
  const groupForm = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      company: "",
      special_requests: "",
      participants: [
        { first_name: "", last_name: "", email: "", phone: "" },
        { first_name: "", last_name: "", email: "", phone: "" },
      ],
    },
  });

  // Set up field array for participants
  const { fields, append, remove } = useFieldArray({
    control: groupForm.control,
    name: "participants",
  });

  // Handle individual registration submission
  const onSubmitIndividual = async (data: IndividualFormValues) => {
  try {
    setIsSubmitting(true);

    const payload: CourseRegistration = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone ?? "", // Fallback if optional
      company: data.company ?? "",
      special_requests: data.special_requests ?? "",
    };

    await courseRegistrationService.registerForCourse(courseId, payload);
    individualForm.reset();
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Error submitting individual registration:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  // Handle group registration submission
  const onSubmitGroup = async (data: GroupFormValues) => {
  try {
    setIsSubmitting(true);

    const payload: GroupRegistration = {
      contact_name: data.contact_name,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone ?? "",
      company: data.company,
      special_requests: data.special_requests ?? "",
      participants: data.participants.map((p) => ({
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email,
        phone: p.phone ?? "",
      })),
    };

    await courseRegistrationService.registerGroupForCourse(courseId, payload);
    groupForm.reset();
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Error submitting group registration:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  // Add a new participant field
  const addParticipant = () => {
    append({ first_name: "", last_name: "", email: "", phone: "" });
  };

  return (
    <Tabs value={registrationType} onValueChange={(v) => setRegistrationType(v as any)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="individual">Individual Registration</TabsTrigger>
        <TabsTrigger value="group">Group Registration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="individual" className="mt-6">
        <Form {...individualForm}>
          <form onSubmit={individualForm.handleSubmit(onSubmitIndividual)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={individualForm.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={individualForm.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={individualForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={individualForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={individualForm.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company/Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={individualForm.control}
              name="special_requests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any dietary restrictions, accessibility needs, etc." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Register for Course"}
            </Button>
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="group" className="mt-6">
        <Form {...groupForm}>
          <form onSubmit={groupForm.handleSubmit(onSubmitGroup)} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md border mb-6">
              <h3 className="text-lg font-medium mb-4">Group Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <FormField
                  control={groupForm.control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={groupForm.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane.smith@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={groupForm.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={groupForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company/Organization*</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={groupForm.control}
              name="special_requests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any dietary restrictions, accessibility needs, etc." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Participants</h3>
              
              {fields.map((field, index) => (
                <div key={field.id} className="mb-8 pb-6 border-b last:border-0">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium">Participant {index + 1}</h4>
                    {index >= 2 && (
                      <Button 
                        type="button" 
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                    <FormField
                      control={groupForm.control}
                      name={`participants.${index}.first_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={groupForm.control}
                      name={`participants.${index}.last_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={groupForm.control}
                      name={`participants.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address*</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={groupForm.control}
                      name={`participants.${index}.phone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addParticipant}
                className="w-full mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Participant
              </Button>
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Register Group for Course"}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
