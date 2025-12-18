import { api } from '@/lib/api';
import { Question, CreateQuestionRequest, UpdateQuestionRequest } from '@/types';

export const questionApi = {
  // Buscar todas as questões
  getAll: async (): Promise<Question[]> => {
    const response = await api.get<Question[]>('/questions');
    return response.data;
  },

  // Buscar questão por ID
  getById: async (id: string): Promise<Question> => {
    const response = await api.get<Question>(`/questions/${id}`);
    return response.data;
  },

  // Buscar questões por subject
  getBySubject: async (subjectId: string): Promise<Question[]> => {
    const response = await api.get<Question[]>(`/questions/subject/${subjectId}`);
    return response.data;
  },

  // Buscar questões por subtopic
  getBySubtopic: async (subtopicId: string): Promise<Question[]> => {
    const response = await api.get<Question[]>(`/questions/subtopic/${subtopicId}`);
    return response.data;
  },

  // Criar nova questão
  create: async (data: CreateQuestionRequest): Promise<Question> => {
    const response = await api.post<Question>('/questions', data);
    return response.data;
  },

  // Atualizar questão
  update: async ({ id, ...data }: UpdateQuestionRequest & { id: string }): Promise<Question> => {
    const response = await api.patch<Question>(`/questions/${id}`, data);
    return response.data;
  },

  // Deletar questão
  delete: async (id: string): Promise<void> => {
    await api.delete(`/questions/${id}`);
  },
};