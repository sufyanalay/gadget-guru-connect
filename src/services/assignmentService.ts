
import { Assignment } from '@/types/assignment';
import { fetchWithAuth, uploadWithAuth } from '@/utils/apiClient';

// Base API URL for direct fetch calls
const API_URL = import.meta.env.VITE_API_URL;

// Assignment API services
export const assignmentService = {
  // Submit assignment
  submitAssignment: async (formData: FormData): Promise<Assignment> => {
    // Using our uploadWithAuth helper for file uploads
    return uploadWithAuth('/assignments/', formData);
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
    // Using our uploadWithAuth helper for file uploads
    return uploadWithAuth(`/assignments/${id}/solution/`, formData);
  },
};

export default assignmentService;
