import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, Trash2, Download, FileText, Image as ImageIcon, Video, Music, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getListFilesQueryKey, useListFiles, useDeleteFile } from "@workspace/api-client-react";
import { format } from "date-fns";

export function FileUpload({ section, title = "Files" }: { section: string; title?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { data: files = [], isLoading } = useListFiles(
    { section },
    { query: { queryKey: getListFilesQueryKey({ section }) } }
  );

  const deleteFileMutation = useDeleteFile();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    setProgress(10);
    
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("section", section);
        
        setProgress(50);
        
        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
      }
      
      setProgress(100);
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${acceptedFiles.length} file(s).`,
      });
      
      queryClient.invalidateQueries({ queryKey: getListFilesQueryKey({ section }) });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, [section, queryClient, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = async (id: number) => {
    try {
      await deleteFileMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListFilesQueryKey({ section }) });
      toast({
        title: "File deleted",
        description: "The file has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete the file.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (mimeType.startsWith('video/')) return <Video className="w-8 h-8 text-purple-500" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-8 h-8 text-green-500" />;
    return <FileText className="w-8 h-8 text-orange-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-secondary/50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <UploadCloud className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isDragActive ? "Drop files here" : "Click or drag files to upload"}
            </p>
            <p className="text-xs text-muted-foreground">Any file type is supported</p>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : files.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="overflow-hidden hover-elevate group">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="shrink-0 p-2 rounded-lg bg-secondary/50">
                  {getFileIcon(file.mimeType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.fileSize / 1024 / 1024).toFixed(2)} MB • {format(new Date(file.uploadedAt), "MMM d, yyyy")}
                  </p>
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="h-8 text-xs" asChild>
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-3 h-3 mr-1" /> View
                      </a>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleDelete(file.id)}
                      disabled={deleteFileMutation.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-secondary/20 rounded-xl border border-border/50">
          <File className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
        </div>
      )}
    </div>
  );
}
