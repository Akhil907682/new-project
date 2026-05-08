import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationAPI from './notificationAPI';

const initialState = {
  notifications: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get notifications
export const getNotifications = createAsyncThunk(
  'notifications/getAll',
  async (_, thunkAPI) => {
    try {
      return await notificationAPI.getNotifications();
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

// Mark as read
export const markAsRead = createAsyncThunk(
  'notifications/markRead',
  async (id, thunkAPI) => {
    try {
      return await notificationAPI.markAsRead(id);
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

// Mark all by complaint as read
export const markAllReadByComplaint = createAsyncThunk(
  'notifications/markAllComplaintRead',
  async (complaintId, thunkAPI) => {
    try {
      await notificationAPI.markAllReadByComplaint(complaintId);
      const userRole = thunkAPI.getState()?.auth?.user?.role;
      return { complaintId, userRole };
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

const getNotificationComplaintId = (notification) => {
  const complaintId = notification.complaintId;
  if (!complaintId) return '';
  return String(complaintId._id || complaintId);
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        if (Array.isArray(state.notifications)) {
          state.notifications = state.notifications.map((n) =>
            n._id === action.payload._id ? action.payload : n
          );
        }
      })
      .addCase(markAllReadByComplaint.fulfilled, (state, action) => {
        const complaintId = String(action.payload.complaintId);
        if (Array.isArray(state.notifications)) {
          state.notifications = state.notifications.map((n) =>
            getNotificationComplaintId(n) === complaintId
              ? { ...n, isRead: true }
              : n
          );
        }
      });
  },
});

export const { reset } = notificationSlice.actions;
export default notificationSlice.reducer;
