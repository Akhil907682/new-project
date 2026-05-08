import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiAPI from './aiAPI';

const initialState = {
  analysis: null,
  enhancedText: null,
  replySuggestions: [],
  summary: null,
  chatResponse: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const analyzeText = createAsyncThunk(
  'ai/analyze',
  async (text, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await aiAPI.analyzeComplaint(text, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const enhanceText = createAsyncThunk(
  'ai/enhance',
  async (text, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await aiAPI.enhanceDescription(text, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getReplySuggestions = createAsyncThunk(
  'ai/suggestReplies',
  async (complaintId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await aiAPI.suggestReplies(complaintId, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDashboardSummary = createAsyncThunk(
  'ai/summary',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await aiAPI.getSummary(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  'ai/chat',
  async ({ history, message }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await aiAPI.chat(history, message, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    resetAI: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
    clearAnalysis: (state) => {
      state.analysis = null;
    },
    clearEnhancedText: (state) => {
      state.enhancedText = null;
    },
    clearReplySuggestions: (state) => {
      state.replySuggestions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Analyze
      .addCase(analyzeText.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(analyzeText.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.analysis = action.payload;
      })
      .addCase(analyzeText.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Enhance
      .addCase(enhanceText.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(enhanceText.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.enhancedText = action.payload.enhancedText;
      })
      .addCase(enhanceText.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Suggest Replies
      .addCase(getReplySuggestions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReplySuggestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.replySuggestions = action.payload.suggestions;
      })
      .addCase(getReplySuggestions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Summary
      .addCase(getDashboardSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.summary = action.payload.summary;
      })
      .addCase(getDashboardSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Chat
      .addCase(sendChatMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.chatResponse = action.payload.reply;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetAI, clearAnalysis, clearEnhancedText, clearReplySuggestions } = aiSlice.actions;
export default aiSlice.reducer;
