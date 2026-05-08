const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const registerTestAdmin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register/admin', {
      name: 'Test Admin',
      email: 'testadmin@example.com',
      password: 'password123',
      adminSecretKey: 'campus_admin_123'
    });
    console.log('Test admin registered successfully:', response.data);
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message);
  }
};

registerTestAdmin();
