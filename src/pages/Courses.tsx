
import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock course data - would be fetched from API in production
const mockCourses = [
  {
    id: "certified-scrummaster",
    title: "Certified ScrumMaster",
    category: "scrum",
    type: "certification",
    format: "in-person",
    duration: "2 days",
    level: "beginner",
    description: "Learn the essential scrum master skills and prepare for the official certification.",
    nextDates: ["June 15-16, 2025", "July 20-21, 2025"],
    price: "$1,295",
    location: "San Francisco, CA",
    instructor: "John Smith",
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: "product-owner-fundamentals",
    title: "Product Owner Fundamentals",
    category: "scrum",
    type: "certification",
    format: "in-person",
    duration: "3 days",
    level: "beginner",
    description: "Master the skills needed to effectively lead product development in an agile environment.",
    nextDates: ["July 5-7, 2025", "August 15-17, 2025"],
    price: "$1,495",
    location: "New York, NY",
    instructor: "Sarah Johnson",
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: "agile-leadership",
    title: "Agile Leadership",
    category: "leadership",
    type: "workshop",
    format: "in-person",
    duration: "2 days",
    level: "advanced",
    description: "Designed for executives and senior managers leading agile transformations.",
    nextDates: ["August 10-11, 2025", "September 12-13, 2025"],
    price: "$1,795",
    location: "Chicago, IL",
    instructor: "Michael Davis",
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: "scaled-agile-framework",
    title: "Scaled Agile Framework (SAFe)",
    category: "scaling",
    type: "certification",
    format: "virtual",
    duration: "4 days",
    level: "advanced",
    description: "Learn how to implement the Scaled Agile Framework across your organization.",
    nextDates: ["June 20-23, 2025", "July 25-28, 2025"],
    price: "$2,495",
    location: "Virtual",
    instructor: "Lisa Brown",
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: "agile-testing",
    title: "Agile Testing Fundamentals",
    category: "testing",
    type: "workshop",
    format: "hybrid",
    duration: "2 days",
    level: "intermediate",
    description: "Learn modern testing approaches that fit with agile development methodologies.",
    nextDates: ["July 1-2, 2025", "August 5-6, 2025"],
    price: "$995",
    location: "Boston, MA / Virtual",
    instructor: "David Wilson",
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: "agile-facilitation",
    title: "Advanced Facilitation Techniques",
    category: "facilitation",
    type: "workshop",
    format: "in-person",
    duration: "1 day",
    level: "intermediate",
    description: "Enhance your facilitation skills to run more effective agile ceremonies.",
    nextDates: ["August 20, 2025", "September 18, 2025"],
    price: "$795",
    location: "Austin, TX",
    instructor: "Jennifer Lee",
    featured: false,
    image: "/placeholder.svg"
  },
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Filter courses based on search term and filters
  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesFormat = selectedFormat === "all" || course.format === selectedFormat;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesFormat && matchesLevel;
  });

  const renderCourseCard = (course: typeof mockCourses[0]) => (
    <Card key={course.id} className="h-full flex flex-col">
      <CardHeader>
        <div className="aspect-video bg-muted mb-4 rounded-lg overflow-hidden">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover" 
          />
        </div>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{course.duration}</span>
          <span className="font-semibold">{course.price}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Next Date:</span>
            <span>{course.nextDates[0]}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Location:</span>
            <span>{course.location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Instructor:</span>
            <span>{course.instructor}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/courses/${course.id}`}>View Details</Link>
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
                <SelectItem value="scrum">Scrum</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="scaling">Scaling</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="facilitation">Facilitation</SelectItem>
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

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All Levels</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(renderCourseCard)}
          </div>
        </TabsContent>
        <TabsContent value="beginner">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter((course) => course.level === "beginner")
              .map(renderCourseCard)}
          </div>
        </TabsContent>
        <TabsContent value="intermediate">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter((course) => course.level === "intermediate")
              .map(renderCourseCard)}
          </div>
        </TabsContent>
        <TabsContent value="advanced">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter((course) => course.level === "advanced")
              .map(renderCourseCard)}
          </div>
        </TabsContent>
      </Tabs>

      {filteredCourses.length === 0 && (
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
