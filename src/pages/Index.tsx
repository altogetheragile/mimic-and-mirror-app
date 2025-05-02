
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Clock, Target } from "lucide-react";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const Index = () => {
  const services = [
    {
      title: "Agile Transformation",
      description: "We guide organizations through the journey of adopting agile methodologies, helping teams embrace new ways of working.",
      icon: <Users className="h-10 w-10 text-primary" />,
    },
    {
      title: "Scrum & Kanban Coaching",
      description: "Our experienced coaches provide hands-on guidance in implementing and optimizing Scrum and Kanban frameworks.",
      icon: <BookOpen className="h-10 w-10 text-primary" />,
    },
    {
      title: "Team Performance",
      description: "We help teams unlock their full potential through improved collaboration, communication, and cohesion.",
      icon: <Target className="h-10 w-10 text-primary" />,
    },
    {
      title: "Agile Leadership",
      description: "Develop servant leadership skills that empower teams and create an environment where agility thrives.",
      icon: <Clock className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Organization with Expert Agile Coaching
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              We help teams and organizations embrace agility, improve collaboration, 
              and deliver greater value to customers through expert coaching and training.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/courses">Explore Our Courses</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Agile Coaching Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive agile coaching services to help organizations at every stage 
              of their agile journey, from initial adoption to continuous improvement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-5">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Agile Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're just starting out or looking to optimize your existing agile practices,
            we're here to help you succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/courses">Browse Our Courses</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
