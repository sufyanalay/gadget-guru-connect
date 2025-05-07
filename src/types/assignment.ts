
import { UserRole } from '@/contexts/AuthContext';

export interface AssignmentFile {
  id: string;
  name: string;
  url: string;
  size: number;
  contentType: string;
  uploadedAt: Date;
}

export interface AssignmentSolution {
  id: string;
  text: string;
  files: AssignmentFile[];
  submittedAt: Date;
  expertId: string;
  expertName: string;
}

export type AssignmentStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'rejected';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectArea: string;
  academicLevel: string;
  deadline: string;
  preferredExpertRole?: UserRole;
  additionalRequirements?: string;
  files: AssignmentFile[];
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expertId?: string;
  expertName?: string;
  solution?: AssignmentSolution;
  feedback?: string;
  price?: number;
}
