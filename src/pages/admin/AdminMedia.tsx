
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload, Pencil, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mediaService } from "@/lib/api/supabase";
import { MediaUploader } from "@/components/media/MediaUploader";
import { MediaForm } from "@/components/media/MediaForm";

const AdminMedia = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<any>(null);
  
  // Fetch media assets
  const { data: media = [], isLoading, refetch } = useQuery({
    queryKey: ["adminMedia"],
    queryFn: async () => {
      const response = await mediaService.getMedia();
      if (response.error) throw response.error;
      return response.data || [];
    },
  });

  // Filter media by type
  const getFilteredMedia = () => {
    let filtered = [...media];
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.file_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedFilter) {
      filtered = filtered.filter(item => 
        item.file_type.startsWith(selectedFilter)
      );
    }
    
    return filtered;
  };

  // Get file types for filtering
  const fileTypes = React.useMemo(() => {
    const types = new Set<string>();
    media.forEach(item => {
      const mainType = item.file_type.split('/')[0];
      types.add(mainType);
    });
    return Array.from(types);
  }, [media]);

  // Handle edit media
  const handleUpdateMedia = async (mediaData: any) => {
    if (currentMedia?.id) {
      await mediaService.updateMedia(currentMedia.id, mediaData);
      setIsEditOpen(false);
      refetch();
    }
  };

  // Handle delete media
  const handleDeleteMedia = async () => {
    if (currentMedia?.id) {
      await mediaService.deleteMedia(currentMedia.id);
      setIsDeleteOpen(false);
      refetch();
    }
  };

  // Handle media upload completion
  const handleUploadComplete = () => {
    setIsUploadOpen(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
        <Button onClick={() => setIsUploadOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {selectedFilter ? `Filter: ${selectedFilter}` : "Filter"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedFilter(null)}>
              All Files
            </DropdownMenuItem>
            {fileTypes.map(type => (
              <DropdownMenuItem 
                key={type} 
                onClick={() => setSelectedFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="text-center py-10">Loading media...</div>
      ) : (
        <Tabs defaultValue="grid">
          <div className="flex justify-end mb-4">
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getFilteredMedia().map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square relative bg-gray-100">
                    {item.file_type.startsWith("image") ? (
                      <img
                        src={mediaService.getPublicUrl(item.file_path)}
                        alt={item.alt_text || item.title || item.file_name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <p className="text-lg font-medium">{item.file_type.split('/')[1]?.toUpperCase()}</p>
                          <p className="text-sm mt-1">{item.file_name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="truncate flex-1">
                        <p className="font-medium truncate">{item.title || item.file_name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {(item.file_size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {item.file_type.split('/')[1]}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 bg-gray-50">
                    <div className="flex justify-between w-full">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setCurrentMedia(item);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setCurrentMedia(item);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              {getFilteredMedia().length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No media files found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="rounded-md border">
              <table className="w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">File</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredMedia().map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {item.file_type.startsWith("image") ? (
                              <img 
                                src={mediaService.getPublicUrl(item.file_path)} 
                                className="h-10 w-10 object-cover" 
                                alt={item.title || item.file_name} 
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {item.file_type.split('/')[1]?.toUpperCase().slice(0, 3)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4 max-w-xs truncate">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {item.title || item.file_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {item.file_type}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {(item.file_size / 1024).toFixed(2)} KB
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="mr-2"
                          onClick={() => {
                            setCurrentMedia(item);
                            setIsEditOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setCurrentMedia(item);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  
                  {getFilteredMedia().length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                        No media files found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Upload Media Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>
              Upload new files to your media library.
            </DialogDescription>
          </DialogHeader>
          <MediaUploader onComplete={handleUploadComplete} />
        </DialogContent>
      </Dialog>

      {/* Edit Media Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>
              Update media information and metadata.
            </DialogDescription>
          </DialogHeader>
          {currentMedia && (
            <MediaForm onSubmit={handleUpdateMedia} initialData={currentMedia} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete this media file.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMedia}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMedia;
