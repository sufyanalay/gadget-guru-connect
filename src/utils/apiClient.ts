import { getValidAccessToken } from '@/utils/tokenManager';

// Base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Helper function for authenticated API calls with automatic token refresh
 * 
 * @param url The API endpoint URL (relative to API_URL)
 * @param options Fetch options
 * @returns Promise with the JSON response
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
  // Get a valid access token (will refresh if needed)
  const token = await getValidAccessToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `API request failed with status ${response.status}`);
  }
  
  return response.json();
};

/**
 * Helper function for uploading files with authentication
 * 
 * @param url The API endpoint URL (relative to API_URL)
 * @param formData FormData object containing files and other form fields
 * @returns Promise with the JSON response
 */
export const uploadWithAuth = async (url: string, formData: FormData): Promise<any> => {
  // Get a valid access token (will refresh if needed)
  const token = await getValidAccessToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }
  
  const response = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Don't set Content-Type for FormData, the browser will set it with the correct boundary
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `API request failed with status ${response.status}`);
  }
  
  return response.json();
};

export default { fetchWithAuth, uploadWithAuth };
