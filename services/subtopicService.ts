import { api } from '@/lib/api';
import { Subtopic, CreateSubtopicRequest, UpdateSubtopicRequest } from '@/types';

export const subtopicApi = {
  // Buscar todos os subtopics
  getAll: async (): Promise<Subtopic[]> => {
    const response = await api.get<Subtopic[]>('/subtopics');
    return response.data;
  },

  // Buscar subtopics por subject ID
  getBySubjectId: async (subjectId: string): Promise<Subtopic[]> => {
    const response = await api.get<Subtopic[]>(`/subtopics/subject/${subjectId}`);
    return response.data;
  },

  // Buscar subtopics por parent ID
  getByParentId: async (parentId: string): Promise<Subtopic[]> => {
    const response = await api.get<Subtopic[]>(`/subtopics/${parentId}/children`);
    return response.data;
  },

  // Buscar subtopic por ID
  getById: async (id: string): Promise<Subtopic> => {
    const response = await api.get<Subtopic>(`/subtopics/${id}`);
    return response.data;
  },

  // Criar novo subtopic
  create: async (data: CreateSubtopicRequest): Promise<Subtopic> => {
    const response = await api.post<Subtopic>('/subtopics', data);
    return response.data;
  },

  // Atualizar subtopic
  update: async ({ id, ...data }: UpdateSubtopicRequest & { id: string }): Promise<Subtopic> => {
    const response = await api.patch<Subtopic>(`/subtopics/${id}`, data);
    return response.data;
  },

  // Mover subtopic (drag & drop)
  move: async (id: string, newParentId?: string, newSubjectId?: string): Promise<Subtopic> => {
    const response = await api.put<Subtopic>(`/subtopics/${id}/move`, {
      parentId: newParentId,
      subjectId: newSubjectId,
    });
    return response.data;
  },

  // Deletar subtopic
  delete: async (id: string): Promise<void> => {
    await api.delete(`/subtopics/${id}`);
  },
};