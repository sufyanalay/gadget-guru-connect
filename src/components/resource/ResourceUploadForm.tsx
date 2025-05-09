
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ResourceCategory } from "@/types/resource";
import resourceService from "@/services/resourceService";
import { File, Upload, Image, Video, X } from 'lucide-react';

interface ResourceUploadFormProps {
  onUploadComplete?: () => void;
  defaultCategory?: ResourceCategory;
}

const ResourceUploadForm: React.FC<ResourceUploadFormProps> = ({
  onUploadComplete,
  defaultCategory,
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ResourceCategory>(defaultCategory || 'general');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // File size validation (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview for images and videos
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreview(url);
    } else if (selectedFile.type.startsWith('video/')) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };
  
  const clearFile = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for the resource",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      await resourceService.uploadResource(
        file,
        category,
        title,
        description,
        tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      );
      
      toast({
        title: "Resource uploaded",
        description: "Your resource has been uploaded successfully",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      clearFile();
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred while uploading",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const getFileIcon = () => {
    if (!file) return <Upload className="h-16 w-16 text-muted-foreground" />;
    
    if (file.type.startsWith('image/')) {
      return <Image className="h-16 w-16 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-16 w-16 text-red-500" />;
    } else {
      return <File className="h-16 w-16 text-amber-500" />;
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* File Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          file ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          {filePreview && file?.type.startsWith('image/') ? (
            <img 
              src={filePreview} 
              alt="Preview" 
              className="max-h-40 object-contain rounded-md mb-2" 
            />
          ) : filePreview && file?.type.startsWith('video/') ? (
            <video 
              src={filePreview} 
              className="max-h-40 object-contain rounded-md mb-2" 
              controls 
            />
          ) : (
            getFileIcon()
          )}
          
          {file ? (
            <div className="text-sm">
              <p className="font-medium text-ellipsis overflow-hidden">{file.name}</p>
              <p className="text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <p>Click to upload or drag and drop</p>
              <p>Images, videos, documents (max 50MB)</p>
            </div>
          )}
          
          {file && (
            <Button 
              type="button" 
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="mt-2 text-xs"
            >
              <X className="mr-1 h-4 w-4" />
              Remove file
            </Button>
          )}
        </div>
      </div>
      
      {/* Form Fields */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your resource"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea 
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your resource"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as ResourceCategory)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="gadget-repair">Gadget Repair</SelectItem>
              <SelectItem value="assignment">Assignment</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="tags">Tags (comma separated, optional)</Label>
          <Input 
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. mathematics, algebra, equations"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isUploading || !file}
        >
          {isUploading ? "Uploading..." : "Upload Resource"}
        </Button>
      </div>
    </form>
  );
};

export default ResourceUploadForm;
