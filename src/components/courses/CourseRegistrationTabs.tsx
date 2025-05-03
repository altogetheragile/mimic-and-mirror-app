
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseRegistrationForm } from "@/components/courses/CourseRegistrationForm";
import GroupRegistrationForm from "@/components/courses/GroupRegistrationForm";

interface CourseRegistrationTabsProps {
  courseId: string;
}

const CourseRegistrationTabs: React.FC<CourseRegistrationTabsProps> = ({ courseId }) => {
  const [activeTab, setActiveTab] = useState('individual');
  
  return (
    <Tabs defaultValue="individual" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="individual">Individual Registration</TabsTrigger>
        <TabsTrigger value="group">Group Registration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="individual">
        <CourseRegistrationForm courseId={courseId} />
      </TabsContent>
      
      <TabsContent value="group">
        <GroupRegistrationForm courseId={courseId} />
      </TabsContent>
    </Tabs>
  );
};

export default CourseRegistrationTabs;
