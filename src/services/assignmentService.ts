
import { Assignment } from '@/types/assignment';

// Base API URL - this would come from environment variables in a real app
const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API calls (same as in other services)
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Get auth token from localStorage
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
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

// Assignment API services
export const assignmentService = {
  // Submit assignment
  submitAssignment: async (formData: FormData): Promise<Assignment> => {
    // We use FormData for file uploads
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_URL}/assignments/`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API request failed with status ${response.status}`);
    }
    
    return response.json();
  },
  
  // Get user assignments
  getUserAssignments: async (): Promise<Assignment[]> => {
    return fetchWithAuth('/assignments/my-assignments/');
  },
  
  // Get assignment details
  getAssignmentById: async (id: string): Promise<Assignment> => {
    return fetchWithAuth(`/assignments/${id}/`);
  },
  
  // Update assignment status (for experts)
  updateAssignmentStatus: async (id: string, status: string, feedback?: string): Promise<Assignment> => {
    return fetchWithAuth(`/assignments/${id}/status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status, feedback }),
    });
  },
  
  // Submit assignment solution (for experts)
  submitSolution: async (id: string, formData: FormData): Promise<Assignment> => {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_URL}/assignments/${id}/solution/`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API request failed with status ${response.status}`);
    }
    
    return response.json();
  },
};

export default assignmentService;
