
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import { Calendar, Clock, MapPin, User } from "lucide-react";

// Mock course data - would be fetched from API in production
const mockCourseDetails = {
  "certified-scrummaster": {
    id: "certified-scrummaster",
    title: "Certified ScrumMaster",
    category: "scrum",
    type: "certification",
    format: "in-person",
    duration: "2 days",
    level: "beginner",
    description: "This two-day course provides the foundation to begin your journey as a Certified ScrumMaster. Through interactive sessions, exercise, and real-world examples, you'll learn how to facilitate, coach, and lead your Scrum team to success.",
    longDescription: "The Certified ScrumMaster (CSM) course is designed to give you a strong foundation in Scrum practice. You will learn the responsibilities of being a ScrumMaster and how to help your team work together to deliver valuable, high-quality products. This course is taught by experienced Certified Scrum Trainers who have worked with teams and organizations across various industries. The course covers Scrum principles, practices, and applications, preparing you to take the CSM exam and start your journey as an effective Scrum Master.",
    agenda: [
      {
        title: "Day 1: Scrum Foundations",
        items: [
          "Introduction to Agile and Scrum",
          "Scrum Framework Overview",
          "Scrum Roles: Product Owner, Scrum Master, Development Team",
          "Sprint Planning and Execution",
          "Interactive Exercise: Building a Product Backlog",
        ]
      },
      {
        title: "Day 2: Scrum Master in Action",
        items: [
          "Facilitating Scrum Events",
          "Servant Leadership in Practice",
          "Removing Impediments",
          "Coaching the Team",
          "Certification Process and Exam Preparation",
          "Interactive Exercise: Facilitating a Sprint Review"
        ]
      }
    ],
    learningOutcomes: [
      "Understand the Scrum framework and its underlying principles",
      "Learn the role and responsibilities of the Scrum Master",
      "Develop skills to facilitate Scrum events and coach team members",
      "Identify and remove impediments to team productivity",
      "Prepare for and pass the Certified ScrumMaster exam",
      "Gain practical knowledge to implement Scrum in your organization"
    ],
    nextDates: [
      { date: "June 15-16, 2025", location: "San Francisco, CA", seats: 12 },
      { date: "July 20-21, 2025", location: "San Francisco, CA", seats: 20 },
      { date: "August 25-26, 2025", location: "New York, NY", seats: 18 }
    ],
    price: "$1,295",
    discounts: "Early bird discount of $100 if registered 30+ days in advance. Group discounts available for 3+ attendees.",
    prerequisites: "No prior experience with Scrum is required, but familiarity with software development practices is helpful.",
    includesExam: true,
    examDetails: "CSM exam included in course registration. You'll receive access to the exam portal after course completion.",
    instructor: {
      name: "John Smith",
      bio: "John is a Certified Scrum Trainer with over 15 years of experience implementing Scrum across various industries. He has trained more than 5,000 professionals and helped dozens of organizations with their agile transformations.",
      image: "/placeholder.svg"
    },
    testimonials: [
      {
        name: "Sarah J.",
        company: "Tech Innovators Inc.",
        quote: "This course completely changed how I approach my role as a Scrum Master. The hands-on exercises and real-world examples were incredibly valuable."
      },
      {
        name: "Michael T.",
        company: "Financial Services Group",
        quote: "John is an exceptional trainer who brings Scrum concepts to life with his engaging teaching style and deep knowledge."
      }
    ],
    image: "/placeholder.svg"
  },
  "product-owner-fundamentals": {
    id: "product-owner-fundamentals",
    title: "Product Owner Fundamentals",
    category: "scrum",
    type: "certification",
    format: "in-person",
    duration: "3 days",
    level: "beginner",
    description: "Master the skills needed to effectively lead product development in an agile environment and become a certified Product Owner.",
    longDescription: "The Product Owner Fundamentals course provides comprehensive training for those looking to excel in the Product Owner role. Over three intensive days, you'll learn how to create and manage product backlogs, write effective user stories, prioritize features, and collaborate with stakeholders and development teams. This course prepares you for certification and gives you practical tools to drive product success.",
    agenda: [
      {
        title: "Day 1: Product Owner Foundations",
        items: [
          "Understanding the Product Owner Role",
          "Agile Product Management Principles",
          "Creating the Product Vision",
          "Stakeholder Management",
          "Workshop: Building a Product Vision Canvas"
        ]
      },
      {
        title: "Day 2: Backlog Creation and Refinement",
        items: [
          "Creating and Managing the Product Backlog",
          "Writing Effective User Stories",
          "Acceptance Criteria and Definition of Done",
          "Backlog Prioritization Techniques",
          "Workshop: Backlog Creation and Refinement"
        ]
      },
      {
        title: "Day 3: Advanced Product Owner Skills",
        items: [
          "Release Planning and Roadmapping",
          "Working with the Development Team",
          "Product Owner in Scaled Environments",
          "Metrics and Evidence-Based Management",
          "Certification Process and Preparation",
          "Workshop: Release Planning"
        ]
      }
    ],
    learningOutcomes: [
      "Master the responsibilities of the Product Owner role",
      "Create compelling product visions that guide development",
      "Build and manage effective product backlogs",
      "Learn multiple prioritization techniques for maximizing value",
      "Develop skills in stakeholder management and negotiation",
      "Create realistic release plans and product roadmaps"
    ],
    nextDates: [
      { date: "July 5-7, 2025", location: "New York, NY", seats: 15 },
      { date: "August 15-17, 2025", location: "Chicago, IL", seats: 20 }
    ],
    price: "$1,495",
    discounts: "Early bird discount of $150 if registered 30+ days in advance. Group discounts available for 3+ attendees.",
    prerequisites: "Basic understanding of agile principles. No specific technical background required.",
    includesExam: true,
    examDetails: "CSPO certification included in course registration. Certification is awarded upon course completion.",
    instructor: {
      name: "Sarah Johnson",
      bio: "Sarah is a Certified Scrum Trainer specializing in product management. With experience as a Product Owner at multiple Fortune 500 companies, she brings real-world insights to her training approach.",
      image: "/placeholder.svg"
    },
    testimonials: [
      {
        name: "David R.",
        company: "Healthcare Solutions",
        quote: "This is exactly what I needed to become effective in my Product Owner role. The course provided practical tools I started using immediately."
      },
      {
        name: "Jennifer L.",
        company: "Retail Innovations Corp",
        quote: "Sarah's extensive product management experience made this course exceptionally valuable. I learned strategies that I've since used to improve our product development process."
      }
    ],
    image: "/placeholder.svg"
  },
  // More course details would be here
};

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // In production, this would fetch course data from an API
  const course = courseId ? mockCourseDetails[courseId as keyof typeof mockCourseDetails] : null;

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

  return (
    <div className="container py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant="outline">{course.format}</Badge>
              <Badge>{course.level}</Badge>
              {course.includesExam && (
                <Badge variant="secondary">Includes Certification</Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap gap-6 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Next: {course.nextDates[0].date}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{course.nextDates[0].location}</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>Instructor: {course.instructor.name}</span>
              </div>
            </div>
            
            <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden mb-8">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <p className="text-lg mb-6">{course.longDescription}</p>
          </div>
          
          <Tabs defaultValue="agenda" className="mb-12">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="outcomes">Learning Outcomes</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="agenda" className="pt-6">
              <h3 className="text-xl font-bold mb-4">Course Agenda</h3>
              <Accordion type="single" collapsible className="w-full">
                {course.agenda.map((day, index) => (
                  <AccordionItem key={index} value={`day-${index}`}>
                    <AccordionTrigger>{day.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        {day.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            
            <TabsContent value="outcomes" className="pt-6">
              <h3 className="text-xl font-bold mb-4">Learning Outcomes</h3>
              <ul className="space-y-2">
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-primary">•</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="instructor" className="pt-6">
              <h3 className="text-xl font-bold mb-4">About the Instructor</h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="sm:w-1/4">
                  <div className="w-full aspect-square rounded-full overflow-hidden">
                    <img 
                      src={course.instructor.image} 
                      alt={course.instructor.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                <div className="sm:w-3/4">
                  <h4 className="text-lg font-semibold mb-2">{course.instructor.name}</h4>
                  <p>{course.instructor.bio}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="testimonials" className="pt-6">
              <h3 className="text-xl font-bold mb-4">What Participants Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-primary/5">
                    <CardContent className="pt-6">
                      <p className="italic mb-4">{testimonial.quote}</p>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>Course Registration</CardTitle>
                <CardDescription>Select your preferred date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.nextDates.map((session, index) => (
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
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Registration Fee</span>
                    <span className="font-bold">{course.price}</span>
                  </div>
                  {course.includesExam && (
                    <div className="flex justify-between text-sm">
                      <span>Certification Exam</span>
                      <span>Included</span>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    <p>{course.discounts}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button className="w-full" size="lg">
                  Register Now
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Group Registration
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{course.prerequisites}</p>
              </CardContent>
            </Card>
            
            {course.includesExam && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Certification Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{course.examDetails}</p>
                </CardContent>
              </Card>
            )}
            
            <div className="mt-6 space-y-4">
              <Button variant="outline" className="w-full">
                Download Course Syllabus
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
