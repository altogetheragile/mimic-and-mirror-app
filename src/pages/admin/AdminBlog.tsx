
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminBlog = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Blog Management</h3>
          <p className="text-muted-foreground">
            This feature is coming soon. You'll be able to create and manage blog posts here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
