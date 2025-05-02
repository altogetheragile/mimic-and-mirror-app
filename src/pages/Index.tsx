
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ServicesSection from "@/components/home/ServicesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Transform Your Organization with Agile Coaching
            </h1>
            <p className="text-xl mb-10 text-gray-600">
              Expert coaching and training to help your teams deliver value faster, 
              respond to change effectively, and create a culture of continuous improvement.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link to="/services">Explore Services</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <img 
              src="/placeholder.svg" 
              alt="Agile Coaching" 
              className="rounded-lg shadow-lg max-w-full mx-auto"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Agile Journey?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Let us help you transform your organization with expert agile coaching and training.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
