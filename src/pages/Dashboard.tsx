
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
import { Calendar, Clock, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Mock data - would come from API in production
const upcomingCourses = [
  {
    id: "evt-001",
    courseId: "certified-scrummaster",
    title: "Certified ScrumMaster",
    date: "June 15-16, 2025",
    location: "San Francisco, CA",
    registrationStatus: "confirmed",
    image: "/placeholder.svg"
  }
];

const completedCourses = [
  {
    id: "evt-002",
    courseId: "agile-fundamentals",
    title: "Agile Fundamentals",
    date: "January 10-11, 2025",
    location: "Online",
    certificate: true,
    image: "/placeholder.svg"
  }
];

const recommendedCourses = [
  {
    id: "product-owner-fundamentals",
    title: "Product Owner Fundamentals",
    date: "July 5-7, 2025",
    location: "New York, NY",
    price: "$1,495",
    image: "/placeholder.svg"
  },
  {
    id: "agile-leadership",
    title: "Agile Leadership",
    date: "August 10-11, 2025",
    location: "Chicago, IL",
    price: "$1,795",
    image: "/placeholder.svg"
  }
];

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email?.split('@')[0] || 'User'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/account-settings">Account Settings</Link>
          </Button>
          <Button variant="secondary" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="upcoming" className="mb-8">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="upcoming">Upcoming Courses</TabsTrigger>
              <TabsTrigger value="completed">Completed Courses</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="pt-6">
              {upcomingCourses.length > 0 ? (
                <div className="space-y-6">
                  {upcomingCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 lg:w-1/4">
                            <div className="aspect-[4/3] bg-muted">
                              <img 
                                src={course.image} 
                                alt={course.title} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </div>
                          <div className="p-6 md:w-2/3 lg:w-3/4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold">{course.title}</h3>
                              <Badge>{course.registrationStatus}</Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{course.date}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{course.location}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-6">
                              <Button size="sm" asChild>
                                <Link to={`/courses/${course.courseId}`}>Course Details</Link>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/my-courses/${course.id}`}>View Registration</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No Upcoming Courses</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't registered for any upcoming courses yet.
                  </p>
                  <Button asChild>
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="pt-6">
              {completedCourses.length > 0 ? (
                <div className="space-y-6">
                  {completedCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 lg:w-1/4">
                            <div className="aspect-[4/3] bg-muted">
                              <img 
                                src={course.image} 
                                alt={course.title} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </div>
                          <div className="p-6 md:w-2/3 lg:w-3/4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold">{course.title}</h3>
                              <Badge variant="outline">Completed</Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{course.date}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{course.location}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-6">
                              {course.certificate && (
                                <Button size="sm">Download Certificate</Button>
                              )}
                              <Button size="sm" variant="outline" asChild>
                                <Link to="/feedback">Provide Feedback</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No Completed Courses</h3>
                  <p className="text-muted-foreground">
                    You haven't completed any courses yet.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recommended" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedCourses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <div className="aspect-video bg-muted mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{course.date}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{course.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to={`/courses/${course.id}`}>View Course</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p>January 2025</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/profile">Edit Profile</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link to="/courses" className="text-primary hover:underline">
                    Browse All Courses
                  </Link>
                </li>
                <li>
                  <Link to="/calendar" className="text-primary hover:underline">
                    Training Calendar
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="text-primary hover:underline">
                    Learning Resources
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-primary hover:underline">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Free webinars and meetups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Agile Coaching Community Meetup</h4>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>June 5, 2025</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>6:00 PM PST</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Webinar: Scaling Agile in Enterprises</h4>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>June 12, 2025</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>10:00 AM PST</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/events">View All Events</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
