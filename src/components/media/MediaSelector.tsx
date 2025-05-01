
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUploader } from "./MediaUploader";
import { mediaService } from "@/lib/api/supabase";

interface MediaSelectorProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export function MediaSelector({ onSelect, onClose }: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("browse");
  
  // Fetch media assets
  const { data: media = [], isLoading, refetch } = useQuery({
    queryKey: ["mediaSelector"],
    queryFn: async () => {
      const response = await mediaService.getMedia();
      if (response.error) throw response.error;
      return response.data || [];
    },
  });

  const filteredMedia = media.filter(item => {
    if (!searchTerm) return item.file_type.startsWith("image"); // Only images by default
    return (
      item.file_type.startsWith("image") && 
      (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       item.file_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleSelect = (item: any) => {
    const url = mediaService.getPublicUrl(item.file_path);
    onSelect(url);
    handleClose();
  };

  const handleUploadComplete = () => {
    setActiveTab("browse");
    refetch();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">Browse Media</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="pt-4">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p>Loading media...</p>
              </div>
            ) : filteredMedia.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto max-h-[50vh] p-1">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square relative bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                    onClick={() => handleSelect(item)}
                  >
                    <img
                      src={mediaService.getPublicUrl(item.file_path)}
                      alt={item.alt_text || item.title || item.file_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No images found. Upload some media or try a different search term.</p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("upload")}
                  className="mt-4"
                >
                  Upload Media
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="pt-4">
            <MediaUploader onComplete={handleUploadComplete} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
