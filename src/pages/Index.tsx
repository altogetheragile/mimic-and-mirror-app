
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ServicesSection from "@/components/home/ServicesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Transform Your Organization With Agile Expertise
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              We help businesses improve performance through agile coaching, training, and
              organizational transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/services">Our Services</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">
                  Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />
      
      {/* Approach Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
              <p className="mb-4 text-muted-foreground">
                We believe that successful agile adoption requires more than just processes and tools.
                Our approach focuses on the people, culture, and mindset shifts needed for true agility.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Custom solutions tailored to your organization's needs</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Experienced coaches with real-world implementation expertise</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/10 p-1 rounded-full">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Focus on sustainable change and long-term success</span>
                </li>
              </ul>
              <Button asChild variant="outline">
                <Link to="/services">Learn More About Our Approach</Link>
              </Button>
            </div>
            <div className="bg-muted aspect-video rounded-xl"></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Agile Journey?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Get in touch with our team to discuss how we can help your organization achieve better outcomes
            through agile practices and principles.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
