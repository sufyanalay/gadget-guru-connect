
import { Resource, ResourceType, ResourceCategory } from '@/types/resource';

// Base API URL - this would come from environment variables in a real app
const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API calls
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Get auth token from localStorage
  const token = localStorage.getItem('authToken');
  
  const headers = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API request failed with status ${response.status}`);
  }
  
  return response.json();
};

// Resource API services
export const resourceService = {
  // Get all resources or filter by type/category
  getResources: async (type?: ResourceType, category?: ResourceCategory): Promise<Resource[]> => {
    let queryParams = '';
    
    if (type || category) {
      queryParams = '?';
      if (type) queryParams += `type=${type}&`;
      if (category) queryParams += `category=${category}`;
    }
    
    return fetchWithAuth(`/resources${queryParams}`);
  },
  
  // Get a specific resource by ID
  getResource: async (id: string): Promise<Resource> => {
    return fetchWithAuth(`/resources/${id}`);
  },
  
  // Upload a new resource
  uploadResource: async (
    file: File, 
    category: ResourceCategory,
    title: string,
    description?: string,
    tags?: string[]
  ): Promise<Resource> => {
    // For now, since we don't have a real backend, let's mock the upload
    // In a real implementation, we would use FormData to send the file
    
    // Determine resource type based on file mimetype
    let type: ResourceType = 'document';
    if (file.type.startsWith('image/')) {
      type = 'image';
    } else if (file.type.startsWith('video/')) {
      type = 'video';
    }
    
    // Create a mock object URL for demo purposes
    const url = URL.createObjectURL(file);
    
    // Create a mock resource
    const mockResource: Resource = {
      id: `resource-${Date.now()}`,
      title,
      description,
      type,
      category,
      url,
      filename: file.name,
      size: file.size,
      createdAt: new Date(),
      createdBy: 'current-user',
      tags,
    };
    
    // In a real app, we'd upload to the server
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('title', title);
    // formData.append('category', category);
    // if (description) formData.append('description', description);
    // if (tags) formData.append('tags', JSON.stringify(tags));
    
    // const response = await fetch(`${API_URL}/resources`, {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    //   },
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to upload resource');
    // }
    
    // Store in localStorage for persistence in demo
    const storedResources = localStorage.getItem('resources');
    const resources = storedResources ? JSON.parse(storedResources) : [];
    resources.push({
      ...mockResource,
      createdAt: mockResource.createdAt.toISOString(),
    });
    localStorage.setItem('resources', JSON.stringify(resources));
    
    return mockResource;
  },
  
  // Delete a resource
  deleteResource: async (id: string): Promise<void> => {
    // In a real app, we'd call the API
    // return fetchWithAuth(`/resources/${id}`, {
    //   method: 'DELETE',
    // });
    
    // For demo, we'll use localStorage
    const storedResources = localStorage.getItem('resources');
    if (storedResources) {
      const resources = JSON.parse(storedResources);
      const updatedResources = resources.filter((resource: any) => resource.id !== id);
      localStorage.setItem('resources', JSON.stringify(updatedResources));
    }
    
    // Remove from object URL if it exists
    if (localStorage.getItem(`resource_${id}_url`)) {
      URL.revokeObjectURL(localStorage.getItem(`resource_${id}_url`) as string);
      localStorage.removeItem(`resource_${id}_url`);
    }
  },
};

export default resourceService;
