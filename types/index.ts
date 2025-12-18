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
  name: string;
}

export interface CreateSubtopicRequest {
  name: string;
  subjectId?: string;
  parentId?: string;
}

export interface UpdateSubtopicRequest {
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

export interface Question {
  id: string;
  statement: string;
  alternativeA: string;
  alternativeB: string;
  alternativeC: string;
  alternativeD: string;
  alternativeE: string;
  correctAlternative: 'A' | 'B' | 'C' | 'D' | 'E';
  subjectId: string;
  subtopicId?: string;
  difficulty: string;
  status: 'rascunho' | 'aprovado' | 'reprovado';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuestionRequest {
  statement: string;
  alternativeA: string;
  alternativeB: string;
  alternativeC: string;
  alternativeD: string;
  alternativeE: string;
  correctAlternative: 'A' | 'B' | 'C' | 'D' | 'E';
  subjectId: string;
  subtopicId?: string;
  difficulty: string;
  status: 'rascunho' | 'aprovado' | 'reprovado';
}

export interface UpdateQuestionRequest {
  statement?: string;
  alternativeA?: string;
  alternativeB?: string;
  alternativeC?: string;
  alternativeD?: string;
  alternativeE?: string;
  correctAlternative?: 'A' | 'B' | 'C' | 'D' | 'E';
  subjectId?: string;
  subtopicId?: string;
  difficulty?: string;
  status?: 'rascunho' | 'aprovado' | 'reprovado';
}