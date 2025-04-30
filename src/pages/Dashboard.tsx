
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { getUserCourseRegistrations } from "@/services/userService";
import TestimonialsCarousel from "@/components/testimonials/TestimonialsCarousel";
import { Loader } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["userRegistrations", user?.id],
    queryFn: () => getUserCourseRegistrations(user?.id || ""),
    enabled: !!user?.id,
  });

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">My Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Welcome back! Here's an overview of your courses and activity.
        </p>
      </div>

      <Tabs defaultValue="my-courses" className="mb-12">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="my-courses" className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : registrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map((registration: any) => (
                <Card key={registration.id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge>{registration.courses?.level || "All Levels"}</Badge>
                      <Badge variant={registration.status === 'confirmed' ? 'default' : 'outline'}>
                        {registration.status || 'Pending'}
                      </Badge>
                    </div>
                    <CardTitle>{registration.courses?.title}</CardTitle>
                    <CardDescription>
                      {registration.courses?.start_date ? 
                        format(new Date(registration.courses.start_date), "MMMM d, yyyy") : 
                        "Date TBD"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4">
                      {registration.courses?.description || "No description provided."}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Duration:</span>
                        <span>
                          {registration.courses?.duration ? 
                            `${registration.courses.duration} ${registration.courses.duration === 1 ? 'day' : 'days'}` : 
                            "TBD"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Location:</span>
                        <span>{registration.courses?.location || "TBD"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Payment:</span>
                        <span className="capitalize">{registration.payment_status || "Pending"}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/courses/${registration.courses?.slug}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <h3 className="text-xl font-medium mb-2">You haven't registered for any courses yet</h3>
              <p className="text-muted-foreground mb-6">
                Browse our available courses to enhance your skills
              </p>
              <Button asChild>
                <Link to="/courses">Explore Courses</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="pt-6">
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="text-xl font-medium mb-2">No completed courses yet</h3>
            <p className="text-muted-foreground mb-6">
              Once you complete a course, it will appear here
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Testimonials */}
      <div className="mt-16">
        <TestimonialsCarousel featured={true} limit={3} />
      </div>
    </div>
  );
};

export default Dashboard;
