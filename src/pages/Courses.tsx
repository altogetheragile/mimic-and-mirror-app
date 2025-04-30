
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import { getCourses, getCategories, type Course, type CourseFilter } from "@/services/courseService";
import { format } from "date-fns";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [filters, setFilters] = useState<CourseFilter>({});
  
  // Fetch categories for the filter
  const { data: categories = [] } = useQuery({
    queryKey: ["courseCategories"],
    queryFn: getCategories,
  });

  // Apply filters when they change
  useEffect(() => {
    const newFilters: CourseFilter = {};
    
    if (searchTerm) {
      newFilters.searchTerm = searchTerm;
    }
    
    if (selectedCategory !== "all") {
      newFilters.category = selectedCategory;
    }
    
    if (selectedFormat !== "all") {
      newFilters.format = selectedFormat;
    }
    
    if (selectedLevel !== "all") {
      newFilters.level = selectedLevel;
    }
    
    setFilters(newFilters);
  }, [searchTerm, selectedCategory, selectedFormat, selectedLevel]);
  
  // Fetch courses with the applied filters
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", filters],
    queryFn: () => getCourses(filters),
  });

  const renderCourseCard = (course: Course) => (
    <Card key={course.id} className="h-full flex flex-col">
      <CardHeader>
        <div className="aspect-video bg-muted mb-4 rounded-lg overflow-hidden">
          <img 
            src={course.image_url || "/placeholder.svg"} 
            alt={course.title} 
            className="w-full h-full object-cover" 
          />
        </div>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{course.duration ? `${course.duration} ${course.duration === 1 ? 'day' : 'days'}` : "TBD"}</span>
          <span className="font-semibold">{course.price ? `$${course.price}` : "Contact for pricing"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Next Date:</span>
            <span>{course.start_date ? format(new Date(course.start_date), 'MMM d, yyyy') : "TBD"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Location:</span>
            <span>{course.location || "TBD"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Level:</span>
            <span className="capitalize">{course.level || "All Levels"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/courses/${course.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Training Courses</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our selection of professional agile training and certification courses.
        </p>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input 
              type="search" 
              placeholder="Search courses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select 
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select 
              value={selectedFormat}
              onValueChange={setSelectedFormat}
            >
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setSelectedLevel}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All Levels</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <TabsContent value={selectedLevel}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(renderCourseCard)}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {!isLoading && courses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      <div className="bg-muted p-8 rounded-lg mt-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Looking for Customized Training?
          </h2>
          <p className="text-muted-foreground mb-6">
            We offer tailored training programs designed specifically for your organization's needs.
            Our expert trainers can deliver courses at your location or virtually.
          </p>
          <Button asChild>
            <Link to="/contact">Contact Us for Custom Training</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Courses;
