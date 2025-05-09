
export type ResourceType = 'image' | 'video' | 'document';
export type ResourceCategory = 'academic' | 'gadget-repair' | 'assignment' | 'general';

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  category: ResourceCategory;
  url: string;
  filename: string;
  size: number;
  createdAt: Date;
  createdBy: string;
  tags?: string[];
}
