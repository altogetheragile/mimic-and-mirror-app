
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader } from "lucide-react";

interface MediaUploaderProps {
  onComplete?: () => void;
}

export function MediaUploader({ onComplete }: MediaUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },
    maxSize: 10485760, // 10MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const newProgress = {} as Record<string, number>;
    files.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);
    
    try {
      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("You must be logged in to upload files");
      }
      
      // Create a bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('media');
      
      if (bucketError && bucketError.message.includes('does not exist')) {
        await supabase.storage.createBucket('media', {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
      }

      // Upload each file and create a media record
      const uploadPromises = files.map(async (file) => {
        try {
          // Create a unique file path
          const timestamp = Date.now();
          const fileExt = file.name.split('.').pop();
          const fileName = `${timestamp}_${file.name.replace(`.${fileExt}`, '')}`;
          const filePath = `uploads/${fileName}.${fileExt}`;
          
          // Upload file to storage
          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (uploadError) throw uploadError;
          
          // Get the public URL
          const { data: publicUrlData } = supabase.storage
            .from('media')
            .getPublicUrl(filePath);
          
          // Update progress
          newProgress[file.name] = 100;
          setUploadProgress({...newProgress});
          
          // Create media record in the database
          const { error: dbError } = await supabase
            .from('media_assets')
            .insert([
              {
                file_name: file.name,
                file_path: filePath,
                file_type: file.type,
                file_size: file.size,
                uploaded_by: userData.user.id,
                title: file.name
              }
            ]);
          
          if (dbError) throw dbError;
          
          return { success: true, file: file.name };
        } catch (error: any) {
          return { success: false, file: file.name, error };
        }
      });
      
      const results = await Promise.all(uploadPromises);
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      if (successful > 0 && failed === 0) {
        toast({
          title: "Upload complete",
          description: `Successfully uploaded ${successful} file${successful !== 1 ? 's' : ''}.`,
        });
        
        setFiles([]);
        if (onComplete) onComplete();
      } else if (successful > 0 && failed > 0) {
        toast({
          title: "Partial upload success",
          description: `Uploaded ${successful} file${successful !== 1 ? 's' : ''}, but ${failed} failed.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload failed",
          description: "Failed to upload files. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload error",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-sm">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="font-medium">Drag files here or click to browse</p>
          <p className="text-gray-500 mt-1">
            Upload images, documents, and other files for your content
          </p>
          <p className="text-xs text-gray-400 mt-2">Max file size: 10MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files</Label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
              >
                <div className="flex items-center">
                  <div className="text-xs bg-gray-200 text-gray-800 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                    {file.name.split('.').pop()?.toUpperCase().substring(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                {uploading ? (
                  <div className="w-16 text-center">
                    {uploadProgress[file.name] === 100 ? (
                      <span className="text-xs text-green-500">Done</span>
                    ) : (
                      <span className="text-xs">{uploadProgress[file.name]}%</span>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        type="button"
        className="w-full"
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
      >
        {uploading ? (
          <>
            <Loader className="h-4 w-4 animate-spin mr-2" />
            Uploading...
          </>
        ) : (
          "Upload Files"
        )}
      </Button>
    </div>
  );
}

export default MediaUploader;
