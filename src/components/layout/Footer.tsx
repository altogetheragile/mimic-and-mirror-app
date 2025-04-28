
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Agile Coaching</h3>
          <p className="text-sm text-primary-foreground/80">
            Professional agile coaching and training solutions to transform your organization.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Services</h4>
          <ul className="space-y-2">
            <li><Link to="/services/coaching" className="hover:underline text-sm text-primary-foreground/80">Team Coaching</Link></li>
            <li><Link to="/services/training" className="hover:underline text-sm text-primary-foreground/80">Agile Training</Link></li>
            <li><Link to="/services/consulting" className="hover:underline text-sm text-primary-foreground/80">Agile Consulting</Link></li>
            <li><Link to="/services/transformation" className="hover:underline text-sm text-primary-foreground/80">Agile Transformation</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><Link to="/courses" className="hover:underline text-sm text-primary-foreground/80">Training Courses</Link></li>
            <li><Link to="/blog" className="hover:underline text-sm text-primary-foreground/80">Blog</Link></li>
            <li><Link to="/faq" className="hover:underline text-sm text-primary-foreground/80">FAQ</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Connect</h4>
          <ul className="space-y-2">
            <li><Link to="/contact" className="hover:underline text-sm text-primary-foreground/80">Contact Us</Link></li>
            <li><a href="https://linkedin.com" className="hover:underline text-sm text-primary-foreground/80" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="https://twitter.com" className="hover:underline text-sm text-primary-foreground/80" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-primary-foreground/20">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/70">
          <p>&copy; {currentYear} Agile Coaching. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
