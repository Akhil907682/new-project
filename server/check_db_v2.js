const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Complaint = require('./features/complaints/complaint.model');

const checkComplaints = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const complaints = await Complaint.find({});
    console.log(`Found ${complaints.length} complaints`);

    complaints.forEach((c, index) => {
      console.log(`${index + 1}. Title: ${c.title}, Image: "${c.image}"`);
    });

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkComplaints();
