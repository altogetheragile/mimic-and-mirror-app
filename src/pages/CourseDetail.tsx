
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  Loader
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { getCourseBySlug, registerForCourse } from "@/services/courseService";
import { getCourseTestimonials } from "@/services/testimonialService";
import { useAuth } from "@/context/AuthContext";

const CourseDetail = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseSlug],
    queryFn: () => getCourseBySlug(courseSlug || ""),
    enabled: !!courseSlug,
  });

  // Fetch testimonials for this course
  const { data: testimonials = [] } = useQuery({
    queryKey: ["courseTestimonials", course?.id],
    queryFn: () => getCourseTestimonials(course?.id || ""),
    enabled: !!course?.id,
  });

  // Course dates formatted for display
  const courseDates = course?.start_date ? [
    { 
      date: format(new Date(course.start_date), "MMMM d, yyyy"),
      location: course.location || "TBD",
      seats: course.capacity || 0
    }
  ] : [];

  if (courseLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
        <p className="mb-8 text-muted-foreground">The course you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/courses">View All Courses</Link>
        </Button>
      </div>
    );
  }

  const handleRegister = async () => {
    if (!user) {
      // Redirect to login page if not logged in
      toast({
        title: "Authentication required",
        description: "Please log in to register for this course",
      });
      navigate("/login", { state: { from: `/courses/${courseSlug}` } });
      return;
    }
    
    if (course) {
      await registerForCourse(course.id, user.id);
    }
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {course.category && <Badge variant="outline">{course.category}</Badge>}
              {course.location && <Badge variant="outline">{course.location}</Badge>}
              {course.level && <Badge>{course.level}</Badge>}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap gap-6 mb-6 text-sm text-muted-foreground">
              {course.duration && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{course.duration} {course.duration === 1 ? 'day' : 'days'}</span>
                </div>
              )}
              
              {course.start_date && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Next: {format(new Date(course.start_date), "MMMM d, yyyy")}</span>
                </div>
              )}
              
              {course.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{course.location}</span>
                </div>
              )}
            </div>
            
            <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden mb-8">
              <img 
                src={course.image_url || "/placeholder.svg"} 
                alt={course.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <p className="text-lg mb-6">{course.description}</p>
          </div>
          
          <Tabs defaultValue="content" className="mb-12">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="pt-6">
              <div className="prose max-w-none">
                {course.content ? (
                  <div dangerouslySetInnerHTML={{ __html: course.content }} />
                ) : (
                  <p>No detailed content information available for this course yet.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="prerequisites" className="pt-6">
              <h3 className="text-xl font-bold mb-4">Prerequisites</h3>
              <p>{course.prerequisites || "No specific prerequisites are required for this course."}</p>
            </TabsContent>
            
            <TabsContent value="testimonials" className="pt-6">
              <h3 className="text-xl font-bold mb-4">What Participants Say</h3>
              {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="bg-primary/5">
                      <CardContent className="pt-6">
                        <p className="italic mb-4">{testimonial.content}</p>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          {testimonial.company && (
                            <p className="text-sm text-muted-foreground">
                              {testimonial.role ? `${testimonial.role}, ` : ''}{testimonial.company}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No testimonials available for this course yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>Course Registration</CardTitle>
                <CardDescription>
                  {courseDates.length > 0 
                    ? "Select your preferred date" 
                    : "Registration details"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {courseDates.length > 0 ? (
                  <div className="space-y-4">
                    {courseDates.map((session, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`date-${index}`}
                          name="course-date"
                          className="mr-3"
                          checked={selectedDateIndex === index}
                          onChange={() => setSelectedDateIndex(index)}
                        />
                        <label htmlFor={`date-${index}`} className="flex-grow cursor-pointer">
                          <div className="font-medium">{session.date}</div>
                          <div className="text-sm text-muted-foreground flex justify-between">
                            <span>{session.location}</span>
                            <span>{session.seats} seats left</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No upcoming sessions scheduled. Please contact us for more information.</p>
                )}
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Registration Fee</span>
                    <span className="font-bold">{course.price ? `$${course.price}` : "Contact for pricing"}</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Early bird discount of 10% if registered 30+ days in advance. Group discounts available for 3+ attendees.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleRegister}
                >
                  Register Now
                </Button>
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link to="/contact">Group Registration</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-6 space-y-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contact">Request Course Syllabus</Link>
              </Button>
              <Link to="/contact" className="text-primary hover:underline block text-center">
                Have questions? Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
