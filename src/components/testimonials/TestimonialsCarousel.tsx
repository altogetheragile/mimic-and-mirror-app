
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { getTestimonials, type Testimonial } from "@/services/testimonialService";
import { Loader } from "lucide-react";

type TestimonialsCarouselProps = {
  featured?: boolean;
  limit?: number;
};

const TestimonialsCarousel = ({ featured = true, limit = 3 }: TestimonialsCarouselProps) => {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials", featured, limit],
    queryFn: () => getTestimonials(featured, limit),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-muted">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Read testimonials from professionals who have benefited from our agile training and coaching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex flex-col flex-grow">
        <div className="mb-4 flex-grow">
          <blockquote className="text-lg italic">&ldquo;{testimonial.content}&rdquo;</blockquote>
        </div>
        
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 mr-4">
            {testimonial.image_url ? (
              <img 
                src={testimonial.image_url} 
                alt={testimonial.name}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary">
                {testimonial.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold">{testimonial.name}</div>
            {(testimonial.role || testimonial.company) && (
              <div className="text-sm text-muted-foreground">
                {testimonial.role && testimonial.company 
                  ? `${testimonial.role}, ${testimonial.company}`
                  : testimonial.role || testimonial.company}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsCarousel;
