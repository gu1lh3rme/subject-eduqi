import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '@/types';
import { subjectApi } from '@/services/subjectService';

interface SubjectState {
  subjects: Subject[];
  selectedSubject: Subject | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubjectState = {
  subjects: [],
  selectedSubject: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const subjects = await subjectApi.getAll();
      return subjects;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subjects');
    }
  }
);

export const fetchSubjectById = createAsyncThunk(
  'subjects/fetchSubjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const subject = await subjectApi.getById(id);
      return subject;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subject');
    }
  }
);

export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async (data: CreateSubjectRequest, { rejectWithValue }) => {
    try {
      const subject = await subjectApi.create(data);
      return subject;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create subject');
    }
  }
);

export const updateSubject = createAsyncThunk(
  'subjects/updateSubject',
  async (data: UpdateSubjectRequest & { id: string }, { rejectWithValue }) => {
    try {
      const subject = await subjectApi.update(data);
      return subject;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update subject');
    }
  }
);

export const deleteSubject = createAsyncThunk(
  'subjects/deleteSubject',
  async (id: string, { rejectWithValue }) => {
    try {
      await subjectApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete subject');
    }
  }
);

// Slice
const subjectSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedSubject: (state, action: PayloadAction<Subject | null>) => {
      state.selectedSubject = action.payload;
    },
    clearSelectedSubject: (state) => {
      state.selectedSubject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch subject by ID
      .addCase(fetchSubjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubject = action.payload;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create subject
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects.push(action.payload);
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update subject
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subjects.findIndex(subject => subject.id === action.payload.id);
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
        if (state.selectedSubject?.id === action.payload.id) {
          state.selectedSubject = action.payload;
        }
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete subject
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = state.subjects.filter(subject => subject.id !== action.payload);
        if (state.selectedSubject?.id === action.payload) {
          state.selectedSubject = null;
        }
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedSubject, clearSelectedSubject } = subjectSlice.actions;
export default subjectSlice.reducer;