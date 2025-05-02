
import React from "react";
import TestimonialDisplay from "@/components/testimonials/TestimonialDisplay";

const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-gray-50">
      <TestimonialDisplay 
        featured={true}
        limit={3}
        showRating={true}
        className="py-16"
      />
    </section>
  );
};

export default TestimonialsSection;
