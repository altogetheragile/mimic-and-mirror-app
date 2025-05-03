
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Loader, Calendar, BookOpen, Clock } from "lucide-react";
import DashboardExplanation from "@/components/Dashboard/DashboardExplanation";
import { supabase } from "@/integrations/supabase/client";

interface CourseRegistration {
  id: string;
  status: string;
  payment_status: string;
  created_at: string;
  course: {
    id: string;
    title: string;
    start_date: string;
    location: string;
    slug: string;
  };
}

const Dashboard = () => {
  const { user } = useAuth();

  const { data: registrations, isLoading } = useQuery({
    queryKey: ["userCourseRegistrations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("course_registrations")
        .select(`
          id,
          status,
          payment_status,
          created_at,
          courses:course_id (
            id,
            title,
            start_date,
            location,
            slug
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CourseRegistration[];
    },
    enabled: !!user,
  });

  // Separate upcoming and past courses
  const currentDate = new Date();
  const upcomingCourses = registrations?.filter((reg) => 
    reg.course && new Date(reg.course.start_date) > currentDate
  ) || [];
  
  const pastCourses = registrations?.filter((reg) => 
    reg.course && new Date(reg.course.start_date) <= currentDate
  ) || [];

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back, {user?.user_metadata?.first_name || 'there'}</p>

      <DashboardExplanation />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content - Course Information */}
        <div className="md:col-span-2 space-y-6">
          {/* Upcoming Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Upcoming Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingCourses && upcomingCourses.length > 0 ? (
                <div className="space-y-4">
                  {upcomingCourses.map((registration) => (
                    <div key={registration.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{registration.course.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(registration.course.start_date).toLocaleDateString('en-US', {
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm">{registration.course.location}</p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              registration.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {registration.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/courses/${registration.course.slug}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No upcoming courses</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're not registered for any upcoming courses.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Courses */}
          {pastCourses && pastCourses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Past Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastCourses.map((registration) => (
                    <div key={registration.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{registration.course.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(registration.course.start_date).toLocaleDateString('en-US', {
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm">{registration.course.location}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/courses/${registration.course.slug}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/profile">
                  My Profile
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/courses">
                  Browse Courses
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/contact">
                  Contact Support
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Need Help */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you have any questions about your courses or need assistance, our support team is here to help.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
