const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config(); // Loads .env from current directory (server root)

const Notification = require('./notification.model');
const connectDB = require('../../shared/config/db');

const checkDB = async () => {
  try {
    await connectDB();
    const count = await Notification.countDocuments();
    console.log('Total Notifications in DB:', count);
    const latest = await Notification.find().sort({ createdAt: -1 }).limit(1);
    console.log('Latest Notification:', JSON.stringify(latest, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('DB Check Failed:', err.message);
    process.exit(1);
  }
};

checkDB();
