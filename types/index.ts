export interface Subject {
  id: string;
  name: string;
  subtopics?: Subtopic[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Subtopic {
  id: string;
  name: string;
  subjectId?: string;
  parentId?: string;
  subtopics?: Subtopic[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubjectRequest {
  name: string;
}

export interface UpdateSubjectRequest {
  id: string;
  name: string;
}

export interface CreateSubtopicRequest {
  name: string;
  subjectId?: string;
  parentId?: string;
}

export interface UpdateSubtopicRequest {
  id: string;
  name: string;
  subjectId?: string;
  parentId?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface TreeNode {
  id: string;
  name: string;
  type: 'subject' | 'subtopic';
  children?: TreeNode[];
  subjectId?: string;
  parentId?: string;
}