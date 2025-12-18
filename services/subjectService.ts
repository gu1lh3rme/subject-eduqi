import { api } from '@/lib/api';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '@/types';

export const subjectApi = {
  // Buscar todos os subjects
  getAll: async (): Promise<Subject[]> => {
    const response = await api.get<Subject[]>('/subjects');
    return response.data;
  },

  // Buscar subject por ID
  getById: async (id: string): Promise<Subject> => {
    const response = await api.get<Subject>(`/subjects/${id}`);
    return response.data;
  },

  // Criar novo subject
  create: async (data: CreateSubjectRequest): Promise<Subject> => {
    const response = await api.post<Subject>('/subjects', data);
    return response.data;
  },

  // Atualizar subject
  update: async (data: UpdateSubjectRequest): Promise<Subject> => {
    const response = await api.patch<Subject>(`/subjects/${data.id}`, data);
    return response.data;
  },

  // Deletar subject
  delete: async (id: string): Promise<void> => {
    await api.delete(`/subjects/${id}`);
  },
};