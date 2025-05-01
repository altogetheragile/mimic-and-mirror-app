
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mediaService } from "@/lib/api/supabase";

interface MediaUploaderProps {
  onComplete: () => void;
}

export function MediaUploader({ onComplete }: MediaUploaderProps) {
  const [files, setFiles] = useState<Array<{ file: File; progress: number; error: string | null; complete: boolean }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      error: null,
      complete: false,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Upload each file
    for (let i = 0; i < files.length; i++) {
      if (files[i].complete) continue;
      
      try {
        // Update progress to show upload started
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, progress: 10 } : f
        ));
        
        // Upload to Supabase
        const { error } = await mediaService.uploadMedia(files[i].file);
        
        if (error) throw error;
        
        // Mark upload as complete
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, progress: 100, complete: true } : f
        ));
      } catch (error: any) {
        // Handle error
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, error: error.message || "Upload failed", progress: 0 } : f
        ));
      }
    }
    
    setIsUploading(false);
    
    // Check if all files are uploaded
    const allUploaded = files.every(f => f.complete || f.error);
    if (allUploaded) {
      onComplete();
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-200 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <h3 className="text-lg font-medium">Drag files here or click to browse</h3>
          <p className="text-sm text-muted-foreground">
            Upload images, documents, and other files for your content
          </p>
        </div>
      </div>
      
      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-auto border rounded-md p-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {file.complete ? (
                  <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                ) : file.error ? (
                  <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="h-3 w-3 text-red-600" />
                  </div>
                ) : (
                  <div className="h-5 w-5 border border-gray-200 rounded-full" />
                )}
                <div className="truncate">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              
              <div className="ml-2 flex items-center space-x-2">
                {file.error ? (
                  <p className="text-xs text-red-600">{file.error}</p>
                ) : file.progress > 0 && !file.complete ? (
                  <div className="w-16">
                    <Progress value={file.progress} className="h-1" />
                  </div>
                ) : null}
                
                {!isUploading && !file.complete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload button */}
      <div className="flex justify-end space-x-2">
        <Button 
          disabled={files.length === 0 || isUploading || files.every(f => f.complete)}
          onClick={uploadFiles}
        >
          {isUploading ? "Uploading..." : "Upload Files"}
        </Button>
      </div>
    </div>
  );
}
