
import { useState, useEffect } from 'react';
import { ResourceType, ResourceCategory, Resource } from '@/types/resource';
import ResourceCard from './ResourceCard';
import { useToast } from '@/components/ui/use-toast';
import resourceService from '@/services/resourceService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResourceListProps {
  category?: ResourceCategory;
  refreshTrigger?: number;
}

const ResourceList: React.FC<ResourceListProps> = ({ 
  category,
  refreshTrigger = 0
}) => {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ResourceType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<ResourceCategory | 'all'>(category || 'all');
  
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        
        // In a real app, we'd fetch from an API. For the demo, we'll use localStorage.
        const storedResources = localStorage.getItem('resources');
        let fetchedResources: Resource[] = [];
        
        if (storedResources) {
          fetchedResources = JSON.parse(storedResources).map((resource: any) => ({
            ...resource,
            createdAt: new Date(resource.createdAt)
          }));
        }
        
        setResources(fetchedResources);
        setError(null);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Failed to load resources. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [refreshTrigger]);
  
  const handleDeleteResource = async (id: string) => {
    try {
      await resourceService.deleteResource(id);
      
      // Update local state
      setResources(prev => prev.filter(resource => resource.id !== id));
      
      toast({
        title: "Resource deleted",
        description: "The resource has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the resource. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Filter resources based on active tab, search query, and category
  const filteredResources = resources.filter(resource => {
    // Filter by type (tab)
    if (activeTab !== 'all' && resource.type !== activeTab) {
      return false;
    }
    
    // Filter by category
    if (filterCategory !== 'all' && resource.category !== filterCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(query) ||
        (resource.description?.toLowerCase().includes(query) || false) ||
        resource.filename.toLowerCase().includes(query) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  if (error) {
    return <div className="p-4 text-destructive">{error}</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Input 
          placeholder="Search resources..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        
        <Select 
          value={filterCategory} 
          onValueChange={(value) => setFilterCategory(value as ResourceCategory | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="gadget-repair">Gadget Repair</SelectItem>
            <SelectItem value="assignment">Assignment</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as ResourceType | 'all')}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse">Loading resources...</div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No resources found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  onDelete={handleDeleteResource}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Duplicate content for other tabs for simplicity */}
        <TabsContent value="image" className="mt-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse">Loading resources...</div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No image resources found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  onDelete={handleDeleteResource}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="video" className="mt-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse">Loading resources...</div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No video resources found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  onDelete={handleDeleteResource}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="document" className="mt-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse">Loading resources...</div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No document resources found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(resource => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  onDelete={handleDeleteResource}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceList;
