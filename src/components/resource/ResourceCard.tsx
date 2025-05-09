
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Resource } from "@/types/resource";
import { File, FileImage, FileVideo, FileText, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ResourceCardProps {
  resource: Resource;
  onDelete?: (id: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete }) => {
  const { id, title, description, type, category, url, filename, size, createdAt } = resource;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const getResourceIcon = () => {
    switch (type) {
      case 'image':
        return <FileImage className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <FileVideo className="h-5 w-5 text-red-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };
  
  const getCategoryColor = () => {
    switch (category) {
      case 'academic':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 'gadget-repair':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 'assignment':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };
  
  // Preview content based on resource type
  const renderPreview = () => {
    switch (type) {
      case 'image':
        return (
          <div className="flex justify-center">
            <img src={url} alt={title} className="max-h-96 object-contain" />
          </div>
        );
      case 'video':
        return (
          <div className="flex justify-center">
            <video src={url} controls className="max-h-96 max-w-full" />
          </div>
        );
      case 'document':
        // For documents, we could render a PDF viewer here if we had one
        return (
          <div className="flex flex-col items-center justify-center h-48 bg-muted rounded-md">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <p className="mt-2 text-sm">Preview not available for this document</p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getResourceIcon()}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Badge className={cn("text-xs", getCategoryColor())}>
            {category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        {type === 'image' && (
          <div className="aspect-video bg-muted mb-3 rounded-md overflow-hidden flex items-center justify-center">
            <img src={url} alt={title} className="max-h-[140px] max-w-full object-contain" />
          </div>
        )}
        
        {type === 'video' && (
          <div className="aspect-video bg-muted mb-3 rounded-md overflow-hidden flex items-center justify-center">
            <video src={url} className="max-h-[140px] max-w-full object-contain" />
          </div>
        )}
        
        {type === 'document' && (
          <div className="aspect-video bg-muted mb-3 rounded-md flex items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{description}</p>
        )}
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{filename}</span>
          <div className="flex items-center gap-2">
            <span>{formatSize(size)}</span>
            <span>•</span>
            <span>{formatDate(new Date(createdAt))}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">View</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getResourceIcon()}
                {title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              {renderPreview()}
              
              {description && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
              )}
              
              <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                <div>
                  <p>Filename: {filename}</p>
                  <p>Size: {formatSize(size)}</p>
                  <p>Uploaded: {formatDate(new Date(createdAt))}</p>
                </div>
                
                {resource.tags?.length ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {resource.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <a href={url} download={filename} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-1" />
              Download
            </a>
          </Button>
          
          {onDelete && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;

// Helper function to combine class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
