const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Admin = require('./features/auth/admin.model');

const checkAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const admins = await Admin.find({});
    console.log(`Found ${admins.length} admins`);

    admins.forEach((a, index) => {
      console.log(`${index + 1}. Name: ${a.name}, Email: ${a.email}`);
    });

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAdmins();
