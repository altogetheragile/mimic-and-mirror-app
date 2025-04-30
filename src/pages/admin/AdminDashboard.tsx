
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllCourses } from "@/services/courseService";
import { getAllUsers } from "@/services/userService";
import { getAllCourseRegistrations } from "@/services/userService";
import { getAllTestimonials } from "@/services/testimonialService";
import { BookOpen, Users, Calendar, MessageSquare } from "lucide-react";

const AdminDashboard = () => {
  // Get all the data we need for the dashboard
  const { data: courses = [] } = useQuery({
    queryKey: ["adminCourses"],
    queryFn: getAllCourses,
  });
  
  const { data: users = [] } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAllUsers,
  });
  
  const { data: registrations = [] } = useQuery({
    queryKey: ["adminRegistrations"],
    queryFn: getAllCourseRegistrations,
  });
  
  const { data: testimonials = [] } = useQuery({
    queryKey: ["adminTestimonials"],
    queryFn: getAllTestimonials,
  });

  const stats = [
    {
      title: "Total Courses",
      value: courses.length,
      description: `${courses.filter(c => c.is_published).length} published`,
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      link: "/admin/courses",
    },
    {
      title: "Total Users",
      value: users.length,
      description: `${users.filter(u => u.role === 'admin').length} admins`,
      icon: <Users className="h-8 w-8 text-green-500" />,
      link: "/admin/users",
    },
    {
      title: "Registrations",
      value: registrations.length,
      description: `${registrations.filter(r => r.status === 'pending').length} pending`,
      icon: <Calendar className="h-8 w-8 text-amber-500" />,
      link: "/admin/registrations",
    },
    {
      title: "Testimonials",
      value: testimonials.length,
      description: `${testimonials.filter(t => t.published).length} published`,
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
      link: "/admin/testimonials",
    },
  ];

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
              <Button variant="link" className="px-0 mt-2" asChild>
                <Link to={stat.link}>View details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Recent Activity */}
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-8">
            {registrations.slice(0, 5).map((reg: any) => (
              <div key={reg.id} className="flex items-center">
                <div className="mr-4 bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {reg.profiles?.first_name || 'Someone'} registered for {reg.courses?.title || 'a course'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: <span className="capitalize">{reg.status || 'pending'}</span>
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  {new Date(reg.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            
            {registrations.length === 0 && (
              <p className="text-muted-foreground">No recent activity.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
