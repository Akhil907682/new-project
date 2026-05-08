const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const loginAndFetch = async () => {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'testuser@gmail.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('Logged in successfully');

    const complaintsRes = await axios.get('http://localhost:5000/api/complaints', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(`Fetched ${complaintsRes.data.length} complaints`);
    complaintsRes.data.forEach((c, index) => {
      console.log(`${index + 1}. Title: ${c.title}, Image: "${c.image}"`);
    });

    process.exit();
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
};

loginAndFetch();
