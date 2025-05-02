
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, BookOpen, Presentation, ArrowRight } from "lucide-react";

const Services: React.FC = () => {
  const services = [
    {
      title: "Agile Transformation",
      description: "We help organizations adopt agile methodologies and transform their way of working to become more responsive, efficient, and customer-focused.",
      longDescription: "Our comprehensive transformation approach addresses culture, processes, and technology to create sustainable agile organizations that can adapt and thrive in today's fast-changing business environment.",
      icon: <Users className="h-10 w-10" />,
      slug: "agile-transformation",
    },
    {
      title: "Scrum Training",
      description: "Comprehensive training programs for Scrum Masters, Product Owners, and team members to effectively implement Scrum in their organizations.",
      longDescription: "Our certified trainers provide hands-on workshops and courses that combine theoretical knowledge with practical exercises to ensure participants can apply Scrum principles effectively in their daily work.",
      icon: <BookOpen className="h-10 w-10" />,
      slug: "scrum-training",
    },
    {
      title: "Agile Coaching",
      description: "Expert coaches work directly with your teams to improve their agile practices, solve challenges, and enhance performance.",
      longDescription: "Our experienced agile coaches provide ongoing guidance and support to help teams navigate real-world challenges, refine their practices, and continuously improve their effectiveness and outcomes.",
      icon: <Presentation className="h-10 w-10" />,
      slug: "agile-coaching",
    },
    {
      title: "Agile Assessment",
      description: "Evaluate your organization's agile maturity and identify opportunities for improvement with our comprehensive assessment framework.",
      longDescription: "Our in-depth assessment provides clear insights into your current agile capabilities across multiple dimensions, highlighting strengths to build upon and areas that need attention to maximize your agile benefits.",
      icon: <FileText className="h-10 w-10" />,
      slug: "agile-assessment",
    },
  ];

  return (
    <>
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Agile Coaching & Training Services</h1>
            <p className="text-xl opacity-90">
              We help organizations transform their way of working through expert agile coaching,
              training, and strategic guidance.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="h-full flex flex-col">
              <CardHeader>
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{service.longDescription}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/services/${service.slug}`}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-muted rounded-lg p-8 mt-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Need a Customized Solution?</h2>
            <p className="text-muted-foreground mb-8">
              Our team can design a tailored approach combining our services to address your
              organization's specific challenges and goals.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Contact Us for Custom Solutions</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
