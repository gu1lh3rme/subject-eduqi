import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchSubtopics,
  fetchSubtopicsBySubjectId,
  fetchSubtopicById,
  createSubtopic,
  updateSubtopic,
  deleteSubtopic,
  clearError,
  setSelectedSubtopic,
  clearSelectedSubtopic,
  clearSubtopicsBySubject,
} from '@/store/slices/subtopicSlice';
import { CreateSubtopicRequest, UpdateSubtopicRequest } from '@/types';

export const useSubtopics = () => {
  const dispatch = useAppDispatch();
  const { subtopics, subtopicsBySubject, selectedSubtopic, loading, error } = useAppSelector(
    (state) => state.subtopics
  );

  const loadSubtopics = useCallback(() => {
    dispatch(fetchSubtopics());
  }, [dispatch]);

  const loadSubtopicsBySubjectId = useCallback(
    (subjectId: string) => {
      dispatch(fetchSubtopicsBySubjectId(subjectId));
    },
    [dispatch]
  );

  const loadSubtopicById = useCallback(
    (id: string) => {
      dispatch(fetchSubtopicById(id));
    },
    [dispatch]
  );

  const createNewSubtopic = useCallback(
    (data: CreateSubtopicRequest) => {
      return dispatch(createSubtopic(data));
    },
    [dispatch]
  );

  const updateExistingSubtopic = useCallback(
    (data: UpdateSubtopicRequest & { id: string }) => {
      return dispatch(updateSubtopic(data));
    },
    [dispatch]
  );

  const deleteExistingSubtopic = useCallback(
    (id: string) => {
      return dispatch(deleteSubtopic(id));
    },
    [dispatch]
  );

  const selectSubtopic = useCallback(
    (subtopic: typeof selectedSubtopic) => {
      dispatch(setSelectedSubtopic(subtopic));
    },
    [dispatch]
  );

  const clearSelection = useCallback(() => {
    dispatch(clearSelectedSubtopic());
  }, [dispatch]);

  const clearSubtopicError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearSubjectSubtopics = useCallback(
    (subjectId: string) => {
      dispatch(clearSubtopicsBySubject(subjectId));
    },
    [dispatch]
  );

  const getSubtopicsForSubject = useCallback(
    (subjectId: string) => {
      return subtopicsBySubject[subjectId] || [];
    },
    [subtopicsBySubject]
  );

  return {
    subtopics,
    subtopicsBySubject,
    selectedSubtopic,
    loading,
    error,
    loadSubtopics,
    loadSubtopicsBySubjectId,
    loadSubtopicById,
    createNewSubtopic,
    updateExistingSubtopic,
    deleteExistingSubtopic,
    selectSubtopic,
    clearSelection,
    clearSubtopicError,
    clearSubjectSubtopics,
    getSubtopicsForSubject,
  };
};