
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ResourceUploadForm from '@/components/resource/ResourceUploadForm';
import ResourceList from '@/components/resource/ResourceList';
import { ResourceCategory } from '@/types/resource';
import { Upload, Book, Tablet, FileText, FileImage, FileVideo, File } from 'lucide-react';

const Resources = () => {
  const [activeTab, setActiveTab] = useState<ResourceCategory | 'all'>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleUploadComplete = () => {
    setIsUploadDialogOpen(false);
    // Trigger a refresh of the resource list
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resource Hub</h1>
            <p className="text-muted-foreground mt-1">
              Upload, manage, and access images, videos, and documents for your courses and projects
            </p>
          </div>
          
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Upload className="mr-2 h-4 w-4" />
                Upload Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Upload New Resource</DialogTitle>
              </DialogHeader>
              <ResourceUploadForm 
                onUploadComplete={handleUploadComplete} 
                defaultCategory={activeTab === 'all' ? undefined : activeTab}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as ResourceCategory | 'all')}
          className="w-full"
        >
          <div className="border-b">
            <TabsList className="w-full justify-start bg-transparent p-0">
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-transparent px-4">
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  All Resources
                </div>
              </TabsTrigger>
              
              <TabsTrigger value="academic" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-transparent px-4">
                <div className="flex items-center">
                  <Book className="h-4 w-4 mr-2" />
                  Academic
                </div>
              </TabsTrigger>
              
              <TabsTrigger value="gadget-repair" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-transparent px-4">
                <div className="flex items-center">
                  <Tablet className="h-4 w-4 mr-2" />
                  Gadget Repair
                </div>
              </TabsTrigger>
              
              <TabsTrigger value="assignment" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-transparent px-4">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Assignment
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-6">
            <ResourceList refreshTrigger={refreshTrigger} />
          </TabsContent>
          
          <TabsContent value="academic" className="mt-6">
            <ResourceList category="academic" refreshTrigger={refreshTrigger} />
          </TabsContent>
          
          <TabsContent value="gadget-repair" className="mt-6">
            <ResourceList category="gadget-repair" refreshTrigger={refreshTrigger} />
          </TabsContent>
          
          <TabsContent value="assignment" className="mt-6">
            <ResourceList category="assignment" refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Resources;
