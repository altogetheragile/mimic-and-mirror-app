
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Users, BookOpen, Presentation } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, link }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-md mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button asChild variant="outline" className="w-full mt-4">
          <Link to={link}>Learn More</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const ServicesSection: React.FC = () => {
  const services = [
    {
      title: "Agile Transformation",
      description: "We help organizations adopt agile methodologies and transform their way of working to become more responsive, efficient, and customer-focused.",
      icon: <Users className="h-6 w-6" />,
      link: "/services/agile-transformation",
    },
    {
      title: "Scrum Training",
      description: "Comprehensive training programs for Scrum Masters, Product Owners, and team members to effectively implement Scrum in their organizations.",
      icon: <BookOpen className="h-6 w-6" />,
      link: "/services/scrum-training",
    },
    {
      title: "Agile Coaching",
      description: "Expert coaches work directly with your teams to improve their agile practices, solve challenges, and enhance performance.",
      icon: <Presentation className="h-6 w-6" />,
      link: "/services/agile-coaching",
    },
    {
      title: "Agile Assessment",
      description: "Evaluate your organization's agile maturity and identify opportunities for improvement with our comprehensive assessment framework.",
      icon: <FileText className="h-6 w-6" />,
      link: "/services/agile-assessment",
    },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide expert agile coaching and training services to help organizations
            transform their processes, improve team collaboration, and deliver customer value faster.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
