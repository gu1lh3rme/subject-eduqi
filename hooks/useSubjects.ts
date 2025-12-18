import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchSubjects,
  fetchSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  clearError,
  setSelectedSubject,
  clearSelectedSubject,
} from '@/store/slices/subjectSlice';
import { CreateSubjectRequest, UpdateSubjectRequest } from '@/types';

export const useSubjects = () => {
  const dispatch = useAppDispatch();
  const { subjects, selectedSubject, loading, error } = useAppSelector(
    (state) => state.subjects
  );

  const loadSubjects = useCallback(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const loadSubjectById = useCallback(
    (id: string) => {
      dispatch(fetchSubjectById(id));
    },
    [dispatch]
  );

  const createNewSubject = useCallback(
    (data: CreateSubjectRequest) => {
      return dispatch(createSubject(data));
    },
    [dispatch]
  );

  const updateExistingSubject = useCallback(
    (data: UpdateSubjectRequest) => {
      return dispatch(updateSubject(data));
    },
    [dispatch]
  );

  const deleteExistingSubject = useCallback(
    (id: string) => {
      return dispatch(deleteSubject(id));
    },
    [dispatch]
  );

  const selectSubject = useCallback(
    (subject: typeof selectedSubject) => {
      dispatch(setSelectedSubject(subject));
    },
    [dispatch]
  );

  const clearSelection = useCallback(() => {
    dispatch(clearSelectedSubject());
  }, [dispatch]);

  const clearSubjectError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    subjects,
    selectedSubject,
    loading,
    error,
    loadSubjects,
    loadSubjectById,
    createNewSubject,
    updateExistingSubject,
    deleteExistingSubject,
    selectSubject,
    clearSelection,
    clearSubjectError,
  };
};