
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Clock } from "lucide-react";

const DashboardExplanation: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Dashboard vs My Courses</CardTitle>
        <CardDescription>Understanding the difference between these sections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Your Dashboard provides an overview of all your account activity, including upcoming courses,
              recent registrations, course progress, notifications, and personalized recommendations.
              Think of it as your central hub for account management and information.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">My Courses</h3>
            <p className="text-sm text-muted-foreground">
              The My Courses section focuses specifically on courses you're registered for,
              showing your current courses, completed courses, and course materials.
              This is where you go to access course content and track your learning progress.
            </p>
          </div>
        </div>
        
        <div className="mt-2 text-sm">
          <p className="text-muted-foreground">
            <Clock className="h-4 w-4 inline mr-1" />
            Use the Dashboard for a broad overview, and My Courses when you want to focus specifically on your learning materials.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardExplanation;
