import { Resource, ResourceType, ResourceCategory } from '@/types/resource';
import { fetchWithAuth, uploadWithAuth } from '@/utils/apiClient';

// Base API URL for any direct fetch operations
const API_URL = import.meta.env.VITE_API_URL;

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
  
  // Upload a new resource (file)
  uploadResource: async (
    file: File,
    category: ResourceCategory,
    title: string,
    description?: string,
    tags?: string[]
  ): Promise<Resource> => {
    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    if (description) formData.append('description', description);
    if (tags) formData.append('tags', JSON.stringify(tags));
    
    // Use our uploadWithAuth helper for the file upload with authentication
    return uploadWithAuth('/resources/', formData);
  },
  
  // Delete a resource
  deleteResource: async (id: string): Promise<void> => {
    await fetchWithAuth(`/resources/${id}`, {
      method: 'DELETE',
    });
  },
};

export default resourceService;
