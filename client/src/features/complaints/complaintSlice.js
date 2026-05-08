import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import complaintAPI from './complaintAPI';
import { markAllReadByComplaint } from '../notifications/notificationSlice';

const idleStatus = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

const initialState = {
  complaints: [],
  adminComplaints: [],
  publicFeedback: [],
  publicFeedbackPagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
  stats: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  createStatus: { ...idleStatus },
  messageStatus: { ...idleStatus },
};

const markComplaintMessagesRead = (complaint, userRole) => {
  const otherRole = userRole === 'admin' ? 'student' : 'admin';
  return {
    ...complaint,
    messages: (complaint.messages || []).map((message) =>
      message.senderRole === otherRole ? { ...message, isRead: true } : message
    ),
  };
};

// Create new complaint
export const createComplaint = createAsyncThunk(
  'complaints/create',
  async (complaintData, thunkAPI) => {
    try {
      return await complaintAPI.createComplaint(complaintData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user complaints
export const getComplaints = createAsyncThunk(
  'complaints/getAll',
  async (_, thunkAPI) => {
    try {
      return await complaintAPI.getComplaints();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all complaints (Admin)
export const getAllComplaintsAdmin = createAsyncThunk(
  'complaints/getAllAdmin',
  async (_, thunkAPI) => {
    try {
      return await complaintAPI.getAllComplaintsAdmin();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update complaint status (Admin)
export const updateStatus = createAsyncThunk(
  'complaints/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      return await complaintAPI.updateComplaintStatus(id, status);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete complaint (Admin)
export const deleteComplaint = createAsyncThunk(
  'complaints/delete',
  async (id, thunkAPI) => {
    try {
      await complaintAPI.deleteComplaint(id);
      return id;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get dashboard stats (Admin)
export const getStats = createAsyncThunk(
  'complaints/getStats',
  async (_, thunkAPI) => {
    try {
      return await complaintAPI.getDashboardStats();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add message to complaint
export const sendMessage = createAsyncThunk(
  'complaints/sendMessage',
  async ({ complaintId, text }, thunkAPI) => {
    try {
      return { complaintId, messages: await complaintAPI.sendMessage(complaintId, text) };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Submit feedback for a resolved complaint
export const submitFeedback = createAsyncThunk(
  'complaints/submitFeedback',
  async ({ complaintId, rating, comment }, thunkAPI) => {
    try {
      return await complaintAPI.submitFeedback(complaintId, { rating, comment });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get public testimonials
export const getPublicFeedback = createAsyncThunk(
  'complaints/getPublicFeedback',
  async (params, thunkAPI) => {
    try {
      return await complaintAPI.getPublicFeedback(params);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.createStatus = { ...idleStatus };
      state.messageStatus = { ...idleStatus };
      state.complaints = [];
      state.adminComplaints = [];
      state.publicFeedback = [];
      state.stats = null;
    },
    resetStatus: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.createStatus = { ...idleStatus };
      state.messageStatus = { ...idleStatus };
    },
    resetCreateStatus: (state) => {
      state.createStatus = { ...idleStatus };
    },
    resetMessageStatus: (state) => {
      state.messageStatus = { ...idleStatus };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createComplaint.pending, (state) => {
        state.isLoading = true;
        state.createStatus = { ...idleStatus, isLoading: true };
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.createStatus = { ...idleStatus, isSuccess: true };
        state.complaints.unshift(action.payload);
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.createStatus = {
          ...idleStatus,
          isError: true,
          message: action.payload || 'Failed to file complaint',
        };
      })
      .addCase(getComplaints.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComplaints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.complaints = action.payload;
      })
      .addCase(getComplaints.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllComplaintsAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllComplaintsAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminComplaints = action.payload;
      })
      .addCase(getAllComplaintsAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.adminComplaints = state.adminComplaints.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
        state.complaints = state.complaints.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })
      .addCase(deleteComplaint.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.adminComplaints = state.adminComplaints.filter(
          (c) => String(c._id) !== String(action.payload)
        );
        state.complaints = state.complaints.filter(
          (c) => String(c._id) !== String(action.payload)
        );
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.messageStatus = { ...idleStatus, isLoading: true };
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messageStatus = { ...idleStatus, isSuccess: true };
        const { complaintId, messages } = action.payload;
        
        state.complaints = state.complaints.map((c) =>
          String(c._id) === String(complaintId) ? { ...c, messages } : c
        );
        state.adminComplaints = state.adminComplaints.map((c) =>
          String(c._id) === String(complaintId) ? { ...c, messages } : c
        );
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.messageStatus = {
          ...idleStatus,
          isError: true,
          message: action.payload || 'Failed to send message',
        };
      })
      .addCase(submitFeedback.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.complaints = state.complaints.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
        state.adminComplaints = state.adminComplaints.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(markAllReadByComplaint.fulfilled, (state, action) => {
        const { complaintId, userRole } = action.payload;
        state.complaints = state.complaints.map((c) =>
          String(c._id) === String(complaintId) ? markComplaintMessagesRead(c, userRole) : c
        );
        state.adminComplaints = state.adminComplaints.map((c) =>
          String(c._id) === String(complaintId) ? markComplaintMessagesRead(c, userRole) : c
        );
      })
      .addCase(getPublicFeedback.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPublicFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicFeedback = Array.isArray(action.payload?.feedback) ? action.payload.feedback : [];
        state.publicFeedbackPagination = {
          total: action.payload?.total || 0,
          page: action.payload?.page || 1,
          pages: action.payload?.pages || 1,
        };
      })
      .addCase(getPublicFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetStatus, resetCreateStatus, resetMessageStatus } = complaintSlice.actions;
export default complaintSlice.reducer;
