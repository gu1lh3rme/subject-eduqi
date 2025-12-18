import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Subtopic, CreateSubtopicRequest, UpdateSubtopicRequest } from '@/types';
import { subtopicApi } from '@/services/subtopicService';

interface SubtopicState {
  subtopics: Subtopic[];
  subtopicsBySubject: { [subjectId: string]: Subtopic[] };
  selectedSubtopic: Subtopic | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubtopicState = {
  subtopics: [],
  subtopicsBySubject: {},
  selectedSubtopic: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchSubtopics = createAsyncThunk(
  'subtopics/fetchSubtopics',
  async (_, { rejectWithValue }) => {
    try {
      const subtopics = await subtopicApi.getAll();
      return subtopics;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subtopics');
    }
  }
);

export const fetchSubtopicsBySubjectId = createAsyncThunk(
  'subtopics/fetchSubtopicsBySubjectId',
  async (subjectId: string, { rejectWithValue }) => {
    try {
      const subtopics = await subtopicApi.getBySubjectId(subjectId);
      return { subjectId, subtopics };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subtopics');
    }
  }
);

export const fetchSubtopicById = createAsyncThunk(
  'subtopics/fetchSubtopicById',
  async (id: string, { rejectWithValue }) => {
    try {
      const subtopic = await subtopicApi.getById(id);
      return subtopic;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subtopic');
    }
  }
);

export const createSubtopic = createAsyncThunk(
  'subtopics/createSubtopic',
  async (data: CreateSubtopicRequest, { rejectWithValue }) => {
    try {
      const subtopic = await subtopicApi.create(data);
      return subtopic;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create subtopic');
    }
  }
);

export const updateSubtopic = createAsyncThunk(
  'subtopics/updateSubtopic',
  async (data: UpdateSubtopicRequest & { id: string }, { rejectWithValue }) => {
    try {
      const subtopic = await subtopicApi.update(data);
      return subtopic;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update subtopic');
    }
  }
);

export const deleteSubtopic = createAsyncThunk(
  'subtopics/deleteSubtopic',
  async (id: string, { rejectWithValue }) => {
    try {
      await subtopicApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete subtopic');
    }
  }
);

// Slice
const subtopicSlice = createSlice({
  name: 'subtopics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedSubtopic: (state, action: PayloadAction<Subtopic | null>) => {
      state.selectedSubtopic = action.payload;
    },
    clearSelectedSubtopic: (state) => {
      state.selectedSubtopic = null;
    },
    clearSubtopicsBySubject: (state, action: PayloadAction<string>) => {
      delete state.subtopicsBySubject[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all subtopics
      .addCase(fetchSubtopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubtopics.fulfilled, (state, action) => {
        state.loading = false;
        state.subtopics = action.payload;
      })
      .addCase(fetchSubtopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch subtopics by subject ID
      .addCase(fetchSubtopicsBySubjectId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubtopicsBySubjectId.fulfilled, (state, action) => {
        state.loading = false;
        state.subtopicsBySubject[action.payload.subjectId] = action.payload.subtopics;
      })
      .addCase(fetchSubtopicsBySubjectId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch subtopic by ID
      .addCase(fetchSubtopicById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubtopicById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubtopic = action.payload;
      })
      .addCase(fetchSubtopicById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create subtopic
      .addCase(createSubtopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubtopic.fulfilled, (state, action) => {
        state.loading = false;
        state.subtopics.push(action.payload);
        
        // Update subtopics by subject if it exists
        const subjectId = action.payload.subjectId;
        if (subjectId !== undefined && state.subtopicsBySubject[subjectId]) {
          state.subtopicsBySubject[subjectId].push(action.payload);
        }
      })
      .addCase(createSubtopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update subtopic
      .addCase(updateSubtopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubtopic.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subtopics.findIndex(subtopic => subtopic.id === action.payload.id);
        if (index !== -1) {
          state.subtopics[index] = action.payload;
        }
        
        // Update subtopics by subject if it exists
        const subjectId = action.payload.subjectId;
        if (subjectId !== undefined && state.subtopicsBySubject[subjectId]) {
          const subjectIndex = state.subtopicsBySubject[subjectId].findIndex(
            (subtopic: Subtopic) => subtopic.id === action.payload.id
          );
          if (subjectIndex !== -1) {
            state.subtopicsBySubject[subjectId][subjectIndex] = action.payload;
          }
        }
        
        if (state.selectedSubtopic?.id === action.payload.id) {
          state.selectedSubtopic = action.payload;
        }
      })
      .addCase(updateSubtopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete subtopic
      .addCase(deleteSubtopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubtopic.fulfilled, (state, action) => {
        state.loading = false;
        const subtopicToDelete = state.subtopics.find(s => s.id === action.payload);
        
        state.subtopics = state.subtopics.filter(subtopic => subtopic.id !== action.payload);
        
        // Update subtopics by subject if it exists
        if (subtopicToDelete) {
          const subjectId = subtopicToDelete.subjectId;
          if (subjectId !== undefined && state.subtopicsBySubject[subjectId]) {
            state.subtopicsBySubject[subjectId] = state.subtopicsBySubject[subjectId].filter(
              (subtopic: Subtopic) => subtopic.id !== action.payload
            );
          }
        }
        
        if (state.selectedSubtopic?.id === action.payload) {
          state.selectedSubtopic = null;
        }
      })
      .addCase(deleteSubtopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  setSelectedSubtopic, 
  clearSelectedSubtopic, 
  clearSubtopicsBySubject 
} = subtopicSlice.actions;
export default subtopicSlice.reducer;