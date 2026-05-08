import axiosInstance from '../../shared/api/axiosInstance';

const analyzeComplaint = async (text) => {
  const response = await axiosInstance.post('/ai/analyze', { text });
  return response.data;
};

const enhanceDescription = async (text) => {
  const response = await axiosInstance.post('/ai/enhance', { text });
  return response.data;
};

const suggestReplies = async (complaintId) => {
  const response = await axiosInstance.get(`/ai/suggest-replies/${complaintId}`);
  return response.data;
};

const getSummary = async () => {
  const response = await axiosInstance.get('/ai/summary');
  return response.data;
};

const chat = async (history, message) => {
  const response = await axiosInstance.post('/ai/chat', { history, message });
  return response.data;
};

const aiAPI = {
  analyzeComplaint,
  enhanceDescription,
  suggestReplies,
  getSummary,
  chat,
};

export default aiAPI;
