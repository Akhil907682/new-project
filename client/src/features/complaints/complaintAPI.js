import axiosInstance from '../../shared/api/axiosInstance';

const createComplaint = async (formData) => {
  const response = await axiosInstance.post('/complaints', formData);
  return response.data;
};

const getComplaints = async () => {
  const response = await axiosInstance.get('/complaints');
  return response.data;
};

const getAllComplaintsAdmin = async () => {
  const response = await axiosInstance.get('/admin/complaints');
  return response.data;
};

const updateComplaintStatus = async (complaintId, status) => {
  const response = await axiosInstance.put(`/admin/complaints/${complaintId}`, { status });
  return response.data;
};

const getDashboardStats = async () => {
  const response = await axiosInstance.get('/admin/stats');
  return response.data;
};

const deleteComplaint = async (complaintId) => {
  const response = await axiosInstance.delete(`/admin/complaints/${complaintId}`);
  return response.data;
};

const sendMessage = async (complaintId, text) => {
  const response = await axiosInstance.post(`/complaints/${complaintId}/messages`, { text });
  return response.data;
};

const submitFeedback = async (complaintId, feedbackData) => {
  const response = await axiosInstance.patch(`/complaints/${complaintId}/feedback`, feedbackData);
  return response.data;
};

const getPublicFeedback = async (params = {}) => {
  const { page = 1, limit = 6, category = 'All', sort = 'latest' } = params;
  const queryString = `?page=${page}&limit=${limit}&category=${category}&sort=${sort}`;
  const response = await axiosInstance.get(`/complaints/public/feedback${queryString}`);
  return response.data;
};

const complaintAPI = {
  createComplaint,
  getComplaints,
  getAllComplaintsAdmin,
  updateComplaintStatus,
  getDashboardStats,
  deleteComplaint,
  sendMessage,
  submitFeedback,
  getPublicFeedback,
};

export default complaintAPI;
