import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchQuestions,
  fetchQuestionById,
  fetchQuestionsBySubject,
  fetchQuestionsBySubtopic,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  setSelectedQuestion,
  clearError,
  resetState,
} from '@/store/slices/questionSlice';
import { CreateQuestionRequest, UpdateQuestionRequest } from '@/types';

export const useQuestions = () => {
  const dispatch = useAppDispatch();
  const {
    questions,
    selectedQuestion,
    loading,
    error
  } = useAppSelector((state) => state.questions);

  const handleFetchQuestions = useCallback(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const handleFetchQuestionById = useCallback((id: string) => {
    dispatch(fetchQuestionById(id));
  }, [dispatch]);

  const handleFetchQuestionsBySubject = useCallback((subjectId: string) => {
    dispatch(fetchQuestionsBySubject(subjectId));
  }, [dispatch]);

  const handleFetchQuestionsBySubtopic = useCallback((subtopicId: string) => {
    dispatch(fetchQuestionsBySubtopic(subtopicId));
  }, [dispatch]);

  const handleCreateQuestion = useCallback(async (data: CreateQuestionRequest) => {
    const result = await dispatch(createQuestion(data));
    return result;
  }, [dispatch]);

  const handleUpdateQuestion = useCallback(async (data: UpdateQuestionRequest & { id: string }) => {
    const result = await dispatch(updateQuestion(data));
    return result;
  }, [dispatch]);

  const handleDeleteQuestion = useCallback(async (id: string) => {
    const result = await dispatch(deleteQuestion(id));
    return result;
  }, [dispatch]);

  const handleSetSelectedQuestion = useCallback((question: any) => {
    dispatch(setSelectedQuestion(question));
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleResetState = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);

  return {
    questions,
    selectedQuestion,
    loading,
    error,
    fetchQuestions: handleFetchQuestions,
    fetchQuestionById: handleFetchQuestionById,
    fetchQuestionsBySubject: handleFetchQuestionsBySubject,
    fetchQuestionsBySubtopic: handleFetchQuestionsBySubtopic,
    createQuestion: handleCreateQuestion,
    updateQuestion: handleUpdateQuestion,
    deleteQuestion: handleDeleteQuestion,
    setSelectedQuestion: handleSetSelectedQuestion,
    clearError: handleClearError,
    resetState: handleResetState,
  };
};