
import { Expert } from '@/types/expert';
import { fetchWithAuth, uploadWithAuth } from '@/utils/apiClient';

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
    return fetchWithAuth(`/experts/${expertId}/rate/`, {
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
