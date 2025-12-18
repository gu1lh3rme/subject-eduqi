import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Question, CreateQuestionRequest, UpdateQuestionRequest } from '@/types';
import { questionApi } from '@/services/questionService';

interface QuestionState {
  questions: Question[];
  selectedQuestion: Question | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  questions: [],
  selectedQuestion: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const questions = await questionApi.getAll();
      return questions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const fetchQuestionById = createAsyncThunk(
  'questions/fetchQuestionById',
  async (id: string, { rejectWithValue }) => {
    try {
      const question = await questionApi.getById(id);
      return question;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch question');
    }
  }
);

export const fetchQuestionsBySubject = createAsyncThunk(
  'questions/fetchQuestionsBySubject',
  async (subjectId: string, { rejectWithValue }) => {
    try {
      const questions = await questionApi.getBySubject(subjectId);
      return questions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions by subject');
    }
  }
);

export const fetchQuestionsBySubtopic = createAsyncThunk(
  'questions/fetchQuestionsBySubtopic',
  async (subtopicId: string, { rejectWithValue }) => {
    try {
      const questions = await questionApi.getBySubtopic(subtopicId);
      return questions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions by subtopic');
    }
  }
);

export const createQuestion = createAsyncThunk(
  'questions/createQuestion',
  async (data: CreateQuestionRequest, { rejectWithValue }) => {
    try {
      const question = await questionApi.create(data);
      return question;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create question');
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'questions/updateQuestion',
  async (data: UpdateQuestionRequest & { id: string }, { rejectWithValue }) => {
    try {
      const question = await questionApi.update(data);
      return question;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update question');
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'questions/deleteQuestion',
  async (id: string, { rejectWithValue }) => {
    try {
      await questionApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete question');
    }
  }
);

// Slice
const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setSelectedQuestion: (state, action: PayloadAction<Question | null>) => {
      state.selectedQuestion = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch all questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch question by ID
      .addCase(fetchQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuestion = action.payload;
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch questions by subject
      .addCase(fetchQuestionsBySubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsBySubject.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestionsBySubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch questions by subtopic
      .addCase(fetchQuestionsBySubtopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsBySubtopic.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestionsBySubtopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create question
      .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update question
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.questions.findIndex(q => q.id === action.payload.id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
        if (state.selectedQuestion?.id === action.payload.id) {
          state.selectedQuestion = action.payload;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete question
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.filter(q => q.id !== action.payload);
        if (state.selectedQuestion?.id === action.payload) {
          state.selectedQuestion = null;
        }
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedQuestion, clearError, resetState } = questionSlice.actions;
export default questionSlice.reducer;