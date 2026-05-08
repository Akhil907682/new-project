import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import complaintReducer from '../../features/complaints/complaintSlice';
import aiReducer from '../../features/ai/aiSlice';
import notificationReducer from '../../features/notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaint: complaintReducer,
    ai: aiReducer,
    notification: notificationReducer,
  },
});
