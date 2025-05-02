import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, ArrowRight } from "lucide-react";

const servicesData = {
  "agile-transformation": {
    title: "Agile Transformation",
    description: "Complete organizational transformation to adopt agile values, principles, and practices.",
    fullDescription: `Our Agile Transformation service provides a comprehensive approach to helping organizations 
    adopt agile methodologies and transform their way of working. We start with an assessment of your current state, 
    identifying areas where agile practices can deliver the most value. Our expert coaches then work with leadership 
    to develop a transformation roadmap tailored to your organization's specific needs and challenges.
    
    We help establish agile frameworks, train teams, and coach leaders to foster an environment where agile can thrive. 
    Our approach focuses on sustainable change, ensuring that agile values and principles become embedded in your 
    organizational culture.`,
    benefits: [
      "Increased organizational agility and responsiveness to market changes",
      "Improved collaboration and alignment across departments",
      "Enhanced ability to deliver value to customers quickly",
      "Greater transparency and predictability in projects",
      "More engaged and empowered teams"
    ],
    keyFeatures: [
      "Current state assessment and gap analysis",
      "Custom transformation roadmap",
      "Leadership coaching and training",
      "Team-level agile implementation",
      "Metrics establishment and progress tracking",
      "Long-term sustainability planning"
    ],
    imageUrl: "/placeholder.svg"
  },
  "scrum-training": {
    title: "Scrum Training",
    description: "Comprehensive training programs for all Scrum roles and team members.",
    fullDescription: `Our Scrum Training programs are designed to build a solid foundation of Scrum knowledge and 
    practical skills for Scrum Masters, Product Owners, development teams, and leadership. We offer a range of 
    certified courses as well as custom workshops tailored to your organization's specific context and challenges.
    
    Our experienced trainers combine theoretical knowledge with hands-on exercises, real-world examples, and 
    interactive discussions to ensure participants not only understand Scrum concepts but can apply them effectively 
    in their daily work.`,
    benefits: [
      "Build a solid foundation of Scrum knowledge across the organization",
      "Develop practical skills that can be immediately applied",
      "Create a common language and understanding of agile practices",
      "Prepare team members for certification exams",
      "Customize learning to address your specific organizational challenges"
    ],
    keyFeatures: [
      "Certified Scrum Master (CSM) courses",
      "Professional Scrum Product Owner (PSPO) training",
      "Agile leadership workshops",
      "Team-based Scrum simulations",
      "Role-specific skill development",
      "Ongoing learning and coaching support"
    ],
    imageUrl: "/placeholder.svg"
  },
  "agile-coaching": {
    title: "Agile Coaching",
    description: "Expert coaches work directly with your teams to improve agile practices.",
    fullDescription: `Our Agile Coaching service provides hands-on guidance from experienced agile practitioners who 
    work directly with your teams to improve their agile implementation. Unlike training alone, coaching offers 
    ongoing support as teams apply agile principles to real-world situations, helping them navigate challenges 
    and continuously improve their practices.
    
    We focus on building self-sufficient, high-performing teams by modeling effective behaviors, providing 
    constructive feedback, and gradually transferring knowledge and skills to team members and internal coaches.`,
    benefits: [
      "Hands-on support for implementing agile practices",
      "Guidance tailored to your team's specific context and challenges",
      "Rapid identification and resolution of impediments",
      "Development of internal coaching capabilities",
      "Sustainable improvement in team performance and outcomes"
    ],
    keyFeatures: [
      "Embedded coaching with agile teams",
      "Sprint planning and retrospective facilitation",
      "Real-time problem-solving support",
      "Agile practice refinement",
      "Metrics analysis and improvement planning",
      "Mentoring for Scrum Masters and emerging internal coaches"
    ],
    imageUrl: "/placeholder.svg"
  },
  "agile-assessment": {
    title: "Agile Assessment",
    description: "Evaluate your organization's agile maturity with our comprehensive framework.",
    fullDescription: `Our Agile Assessment service provides a thorough evaluation of your organization's agile 
    implementation and maturity. We use a comprehensive framework to assess practices across multiple dimensions, 
    including leadership, team dynamics, technical practices, and organizational enablers.
    
    Through interviews, observations, and data analysis, we identify strengths to build on and areas that need 
    improvement. The assessment provides clear, actionable insights that can guide your agile improvement efforts 
    and help you measure progress over time.`,
    benefits: [
      "Gain a clear understanding of your current agile maturity",
      "Identify specific strengths and improvement opportunities",
      "Establish a baseline for measuring progress",
      "Prioritize actions that will have the greatest impact",
      "Align leadership around a common understanding of agile effectiveness"
    ],
    keyFeatures: [
      "Multi-dimensional assessment framework",
      "Team-level and organizational-level evaluation",
      "Technical practices review",
      "Leadership alignment assessment",
      "Detailed findings report with recommendations",
      "Prioritized improvement roadmap"
    ],
    imageUrl: "/placeholder.svg"
  }
};

const ServiceDetail: React.FC = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const serviceData = serviceSlug ? servicesData[serviceSlug as keyof typeof servicesData] : null;

  if (!serviceData) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <p className="text-muted-foreground mb-8">
            The service you're looking for doesn't exist or may have been moved.
          </p>
          <Link to="/services">
            <Button>View All Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Breadcrumb className="mb-8">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/services">Services</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>{serviceData.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-6">{serviceData.title}</h1>

          <div className="prose max-w-none">
            <p className="text-xl text-muted-foreground mb-8">{serviceData.description}</p>

            {serviceData.fullDescription.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}

            <h2 className="text-2xl font-semibold mt-8 mb-4">Key Benefits</h2>
            <ul>
              {serviceData.benefits.map((benefit, index) => (
                <li key={index} className="mb-2">{benefit}</li>
              ))}
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">What's Included</h2>
            <ul>
              {serviceData.keyFeatures.map((feature, index) => (
                <li key={index} className="mb-2">{feature}</li>
              ))}
            </ul>
          </div>

          <div className="mt-12">
            <Link to="/contact">
              <Button size="lg">
                Contact Us About This Service <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <img 
                src={serviceData.imageUrl} 
                alt={serviceData.title} 
                className="w-full h-48 object-cover rounded-md mb-6" 
              />

              <h3 className="text-xl font-semibold mb-4">Ready to get started?</h3>
              <p className="mb-6">
                Contact our team to discuss how our {serviceData.title.toLowerCase()} 
                services can help your organization.
              </p>

              <div className="space-y-4">
                <Link to="/contact">
                  <Button className="w-full">Request Consultation</Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" className="w-full">Browse Related Courses</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
