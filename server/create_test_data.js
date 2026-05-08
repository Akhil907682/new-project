const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Complaint = require('./features/complaints/complaint.model');
const Student = require('./features/auth/student.model');

const createTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const student = await Student.findOne({ email: 'testuser@gmail.com' });
    if (!student) {
      console.error('Student not found');
      process.exit(1);
    }

    // Create complaint WITH image
    await Complaint.create({
      userId: student._id,
      title: 'Test With Image',
      description: 'This complaint has an image.',
      category: 'Electrical',
      priority: 'Low',
      image: '/uploads/test_image_1.png'
    });
    console.log('Created complaint with image');

    // Create complaint WITHOUT image
    await Complaint.create({
      userId: student._id,
      title: 'Test Without Image',
      description: 'This complaint does NOT have an image.',
      category: 'Plumbing',
      priority: 'Low',
      image: ''
    });
    console.log('Created complaint without image');

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestData();
