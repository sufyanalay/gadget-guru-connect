
import { Expert } from '@/types/expert';

// Base API URL - this would come from environment variables in a real app
const API_URL = 'http://localhost:8000/api';

// Helper function for API calls (same as in chatService)
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

// Experts API services
export const expertService = {
  // Get all experts
  getAllExperts: async (): Promise<Expert[]> => {
    return fetchWithAuth('/experts/');
  },
  
  // Get experts by role
  getExpertsByRole: async (role: string): Promise<Expert[]> => {
    return fetchWithAuth(`/experts/?role=${role}`);
  },
  
  // Get expert details
  getExpertById: async (id: string): Promise<Expert> => {
    return fetchWithAuth(`/experts/${id}/`);
  },
  
  // Rate an expert
  rateExpert: async (expertId: string, rating: number, comment?: string): Promise<void> => {
    return fetchWithAuth(`/experts/${id}/rate/`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },

  // Get experts by specialization
  getExpertsBySpecialization: async (specialization: string): Promise<Expert[]> => {
    return fetchWithAuth(`/experts/?specialization=${specialization}`);
  },

  // Get experts for assignment writing (with appropriate skills)
  getAssignmentWritingExperts: async (subjectArea?: string): Promise<Expert[]> => {
    const queryParam = subjectArea ? `?subject=${subjectArea}` : '';
    return fetchWithAuth(`/experts/assignment-writers${queryParam}`);
  },

  // Get expert's previous assignments
  getExpertAssignments: async (expertId: string): Promise<any[]> => {
    return fetchWithAuth(`/experts/${expertId}/assignments/`);
  },

  // Assign an expert to an assignment
  assignExpertToAssignment: async (expertId: string, assignmentId: string): Promise<void> => {
    return fetchWithAuth(`/assignments/${assignmentId}/assign/`, {
      method: 'POST',
      body: JSON.stringify({ expertId }),
    });
  },
};

export default expertService;
