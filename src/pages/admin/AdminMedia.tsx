
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const AdminMedia = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Media Management</h3>
          <p className="text-muted-foreground">
            This feature is coming soon. You'll be able to upload and manage media files here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminMedia;
