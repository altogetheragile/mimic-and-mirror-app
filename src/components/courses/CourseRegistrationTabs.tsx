
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseRegistrationForm from "@/components/courses/CourseRegistrationForm";
import GroupRegistrationForm from "@/components/courses/GroupRegistrationForm";

interface CourseRegistrationTabsProps {
  courseId: string;
  courseName: string;
  onSuccess?: () => void;
}

const CourseRegistrationTabs: React.FC<CourseRegistrationTabsProps> = ({ 
  courseId, 
  courseName,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState("individual");

  return (
    <Tabs defaultValue="individual" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="individual">Individual Registration</TabsTrigger>
        <TabsTrigger value="group">Group/Company Registration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="individual" className="pt-6">
        <CourseRegistrationForm 
          courseId={courseId}
          onSuccess={() => {
            if (onSuccess) onSuccess();
          }}
        />
      </TabsContent>
      
      <TabsContent value="group" className="pt-6">
        <GroupRegistrationForm 
          courseId={courseId}
          courseName={courseName}
          onSuccess={() => {
            if (onSuccess) onSuccess();
          }}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CourseRegistrationTabs;
