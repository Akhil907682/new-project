import axiosInstance from '../../shared/api/axiosInstance';

const register = async (userData) => {
  const endpoint = userData.role === 'admin' ? '/auth/register/admin' : '/auth/register/student';
  const response = await axiosInstance.post(endpoint, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};


const login = async (userData) => {
  const response = await axiosInstance.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const googleLogin = async (credential) => {
  const response = await axiosInstance.post('/auth/google', { credential });
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const authAPI = {
  register,
  login,
  googleLogin,
  logout,
};

export default authAPI;
