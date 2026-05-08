const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Student = require('./features/auth/student.model');

const checkStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const students = await Student.find({});
    console.log(`Found ${students.length} students`);

    students.forEach((s, index) => {
      console.log(`${index + 1}. Name: ${s.name}, Email: ${s.email}`);
    });

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkStudents();
