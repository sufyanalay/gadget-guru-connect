
import { UserRole } from '@/contexts/AuthContext';

export interface ExpertRating {
  averageRating: number;
  totalReviews: number;
}

export interface ExpertSpecialization {
  id: string;
  name: string;
}

export interface Expert {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  bio: string;
  specializations: ExpertSpecialization[];
  rating: ExpertRating;
  hourlyRate: number;
  isOnline: boolean;
  experience: number; // in years
  location: string;
  languages: string[];
  education?: string;
  availability?: string;
}
