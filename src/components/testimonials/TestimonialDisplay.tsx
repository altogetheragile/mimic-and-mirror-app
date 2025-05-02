
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  image_url?: string;
}

interface TestimonialProps {
  testimonial: Testimonial;
  showRating?: boolean;
}

export const fetchTestimonials = async (featured: boolean = false, limit: number = 6): Promise<Testimonial[]> => {
  let query = supabase
    .from("testimonials")
    .select("*")
    .eq("published", true);
  
  if (featured) {
    query = query.eq("is_featured", true);
  }
  
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching testimonials:", error);
    throw error;
  }
  
  return data || [];
};

export const TestimonialCard: React.FC<TestimonialProps> = ({ testimonial, showRating = true }) => {
  const { name, role, company, content, rating = 5, image_url } = testimonial;
  
  return (
    <Card className="h-full">
      <CardContent className="pt-6 flex flex-col h-full">
        {showRating && rating && (
          <div className="mb-4 flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}
        
        <div className="mb-6 flex-grow">
          <p className="text-gray-700 italic">&ldquo;{content}&rdquo;</p>
        </div>
        
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={image_url} alt={name} />
            <AvatarFallback>
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-500">
              {role && company ? `${role}, ${company}` : role || company || ''}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface TestimonialDisplayProps {
  featured?: boolean;
  limit?: number;
  showTitle?: boolean;
  className?: string;
  showRating?: boolean;
}

const TestimonialDisplay: React.FC<TestimonialDisplayProps> = ({
  featured = false,
  limit = 6,
  showTitle = true,
  className = "",
  showRating = true
}) => {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials", featured, limit],
    queryFn: () => fetchTestimonials(featured, limit),
  });
  
  if (testimonials.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read about the experiences of organizations we've helped transform through our agile coaching services.
            </p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.id} 
                testimonial={testimonial}
                showRating={showRating} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialDisplay;
