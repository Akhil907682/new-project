import axiosInstance from '../../shared/api/axiosInstance';

const getNotifications = async () => {
  const response = await axiosInstance.get('/notifications');
  return response.data;
};

const markAsRead = async (id) => {
  const response = await axiosInstance.put(`/notifications/${id}/read`);
  return response.data;
};

const markAllReadByComplaint = async (complaintId) => {
  const response = await axiosInstance.put(`/notifications/complaint/${complaintId}/read`);
  return response.data;
};

const notificationAPI = {
  getNotifications,
  markAsRead,
  markAllReadByComplaint,
};

export default notificationAPI;
