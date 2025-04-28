
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Mock data for admin dashboard
const upcomingCourses = [
  {
    id: "evt-001",
    title: "Certified ScrumMaster",
    date: "June 15-16, 2025",
    location: "San Francisco, CA",
    registrations: 12,
    capacity: 20,
    instructor: "John Smith"
  },
  {
    id: "evt-002",
    title: "Product Owner Fundamentals",
    date: "July 5-7, 2025",
    location: "New York, NY",
    registrations: 8,
    capacity: 15,
    instructor: "Sarah Johnson"
  },
  {
    id: "evt-003",
    title: "Agile Leadership",
    date: "August 10-11, 2025",
    location: "Chicago, IL",
    registrations: 5,
    capacity: 20,
    instructor: "Michael Davis"
  }
];

const recentRegistrations = [
  {
    id: "reg-001",
    name: "David Wilson",
    email: "david@example.com",
    course: "Certified ScrumMaster",
    date: "June 15-16, 2025",
    registrationDate: "April 22, 2025",
    status: "confirmed"
  },
  {
    id: "reg-002",
    name: "Jennifer Lee",
    email: "jennifer@example.com",
    course: "Product Owner Fundamentals",
    date: "July 5-7, 2025",
    registrationDate: "April 21, 2025",
    status: "pending"
  },
  {
    id: "reg-003",
    name: "Robert Thompson",
    email: "robert@example.com",
    course: "Agile Leadership",
    date: "August 10-11, 2025",
    registrationDate: "April 20, 2025",
    status: "confirmed"
  }
];

const stats = {
  totalCourses: 12,
  activeStudents: 156,
  upcomingSessions: 8,
  completedSessions: 24
};

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage courses, users, and site content
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link to="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Admin Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Courses
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSessions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="courses" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="courses">Upcoming Courses</TabsTrigger>
              <TabsTrigger value="registrations">Recent Registrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses" className="pt-6">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Course</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Location</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Registrations</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Instructor</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {upcomingCourses.map((course) => (
                        <tr key={course.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle font-medium">{course.title}</td>
                          <td className="p-4 align-middle">{course.date}</td>
                          <td className="p-4 align-middle">{course.location}</td>
                          <td className="p-4 align-middle">
                            {course.registrations}/{course.capacity}
                          </td>
                          <td className="p-4 align-middle">{course.instructor}</td>
                          <td className="p-4 align-middle">
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/admin/courses/${course.id}`}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button asChild>
                  <Link to="/admin/courses">Manage All Courses</Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="registrations" className="pt-6">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Course</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Registration Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {recentRegistrations.map((reg) => (
                        <tr key={reg.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">
                            <div className="font-medium">{reg.name}</div>
                            <div className="text-xs text-muted-foreground">{reg.email}</div>
                          </td>
                          <td className="p-4 align-middle">{reg.course}</td>
                          <td className="p-4 align-middle">{reg.date}</td>
                          <td className="p-4 align-middle">{reg.registrationDate}</td>
                          <td className="p-4 align-middle">
                            <Badge variant={reg.status === "confirmed" ? "default" : "outline"}>
                              {reg.status}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/admin/registrations/${reg.id}`}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button asChild>
                  <Link to="/admin/registrations">View All Registrations</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/courses/new">
                  <Calendar className="mr-2 h-4 w-4" />
                  Create New Course
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/courses/templates">
                  <Edit className="mr-2 h-4 w-4" />
                  Manage Course Templates
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/blog/new">
                  <Edit className="mr-2 h-4 w-4" />
                  Create Blog Post
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/users">
                  <User className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Admin Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link to="/admin/dashboard" className="text-primary hover:underline">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin/courses" className="text-primary hover:underline">
                    Course Management
                  </Link>
                </li>
                <li>
                  <Link to="/admin/registrations" className="text-primary hover:underline">
                    Registration Management
                  </Link>
                </li>
                <li>
                  <Link to="/admin/users" className="text-primary hover:underline">
                    User Management
                  </Link>
                </li>
                <li>
                  <Link to="/admin/blog" className="text-primary hover:underline">
                    Blog Management
                  </Link>
                </li>
                <li>
                  <Link to="/admin/media" className="text-primary hover:underline">
                    Media Library
                  </Link>
                </li>
                <li>
                  <Link to="/admin/settings" className="text-primary hover:underline">
                    Site Settings
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>System events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm">
                  <p className="font-medium">Course Created</p>
                  <p className="text-muted-foreground">Advanced Scrum Facilitation</p>
                  <p className="text-xs text-muted-foreground mt-1">April 22, 2025, 10:34 AM</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">User Registration</p>
                  <p className="text-muted-foreground">jennifer@example.com</p>
                  <p className="text-xs text-muted-foreground mt-1">April 21, 2025, 3:15 PM</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Blog Post Published</p>
                  <p className="text-muted-foreground">Top 5 Agile Measurement Techniques</p>
                  <p className="text-xs text-muted-foreground mt-1">April 20, 2025, 11:22 AM</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/admin/activity">View All Activity</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
