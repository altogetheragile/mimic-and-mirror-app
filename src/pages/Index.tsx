
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Calendar, Users, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  return (
    <>
      {/* Hero Section - Updated with light blue gradient background */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-agile-skyblue/20 to-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transform Your Team with Agile Coaching
            </h1>
            <p className="text-lg mb-8 text-muted-foreground">
              Professional agile coaching and training to help your organization
              deliver value faster and more effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <img
              src="/placeholder.svg"
              alt="Agile Coaching"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* Services Section - Updated with service icons */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive agile coaching and training solutions tailored to
              your organization's specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="service-icon mb-4 inline-flex">
                  <Users size={24} />
                </div>
                <CardTitle>Team Coaching</CardTitle>
                <CardDescription>
                  Hands-on coaching for agile teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Work with experienced agile coaches to improve your team's
                  performance, collaboration and delivery capabilities.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full group">
                  <Link to="/services/coaching" className="flex justify-between items-center">
                    <span>Learn More</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="service-icon mb-4 inline-flex">
                  <Calendar size={24} />
                </div>
                <CardTitle>Agile Training</CardTitle>
                <CardDescription>
                  Certified scrum and agile courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Industry-recognized training and certification programs for
                  scrum masters, product owners and agile leaders.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full group">
                  <Link to="/services/training" className="flex justify-between items-center">
                    <span>Learn More</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="service-icon mb-4 inline-flex">
                  <Users size={24} />
                </div>
                <CardTitle>Agile Consulting</CardTitle>
                <CardDescription>
                  Strategic consulting services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Expert advice on agile implementation, scaling, and
                  optimization to achieve your business goals.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full group">
                  <Link to="/services/consulting" className="flex justify-between items-center">
                    <span>Learn More</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="service-icon mb-4 inline-flex">
                  <Users size={24} />
                </div>
                <CardTitle>Transformation</CardTitle>
                <CardDescription>
                  Enterprise agile transformation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Comprehensive programs to guide your organization through a
                  successful agile transformation journey.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full group">
                  <Link to="/services/transformation" className="flex justify-between items-center">
                    <span>Learn More</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses - Updated with improved card styling */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Featured Courses</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our most popular training programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Certified ScrumMaster</CardTitle>
                <CardDescription>
                  2-day intensive workshop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Learn the essential scrum master skills and prepare for
                  the official certification.
                </p>
                <p className="font-semibold">Next dates: June 15-16, 2025</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/courses/certified-scrummaster">View Details</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Product Owner Fundamentals</CardTitle>
                <CardDescription>
                  3-day comprehensive course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Master the skills needed to effectively lead product
                  development in an agile environment.
                </p>
                <p className="font-semibold">Next dates: July 5-7, 2025</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/courses/product-owner-fundamentals">View Details</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Agile Leadership</CardTitle>
                <CardDescription>
                  2-day executive workshop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Designed for executives and senior managers leading agile
                  transformations.
                </p>
                <p className="font-semibold">Next dates: August 10-11, 2025</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/courses/agile-leadership">View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials - Updated with light green backgrounds */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Client Testimonials</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our clients have to say about our coaching and training services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="testimonial-card">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      JD
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Jane Doe</h4>
                    <p className="text-sm text-muted-foreground">CTO, Tech Innovators</p>
                  </div>
                </div>
                <p className="italic">
                  "The agile coaching services provided were transformative for our development teams. 
                  We've seen a 40% improvement in delivery predictability and team satisfaction."
                </p>
              </CardContent>
            </Card>

            <Card className="testimonial-card">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      MS
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Michael Smith</h4>
                    <p className="text-sm text-muted-foreground">Director of Engineering, Global Solutions</p>
                  </div>
                </div>
                <p className="italic">
                  "The Certified ScrumMaster course was excellently delivered. Our team immediately applied 
                  the concepts and has already improved their sprint execution significantly."
                </p>
              </CardContent>
            </Card>

            <Card className="testimonial-card">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      AJ
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Amanda Johnson</h4>
                    <p className="text-sm text-muted-foreground">VP of Product, Startup Inc.</p>
                  </div>
                </div>
                <p className="italic">
                  "The agile transformation program has been a game-changer for our organization. 
                  We've reduced time-to-market by 30% while improving quality metrics across the board."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Organization?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Contact us today to discuss how our agile coaching and training solutions can help your teams deliver better results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground" asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
