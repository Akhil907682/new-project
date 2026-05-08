const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Admin = require('./features/auth/admin.model');
const bcrypt = require('bcryptjs');

const registerTestAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'testadmin@example.com';
    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await Admin.create({
      name: 'Test Admin',
      email,
      password: hashedPassword
    });

    console.log('Test admin created successfully');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

registerTestAdmin();
