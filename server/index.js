const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables immediately
dotenv.config();

const connectDB = require('./shared/config/db');
const { errorHandler } = require('./shared/middleware/errorMiddleware');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Route imports
const authRoutes = require('./features/auth/auth.routes');
const complaintRoutes = require('./features/complaints/complaint.routes');
const adminRoutes = require('./features/admin/admin.routes');
const aiRoutes = require('./features/ai/ai.routes');
const notificationRoutes = require('./features/notifications/notification.routes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Smart Complaint Campus System API is running...');
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('--------------------------------------------------');
  console.log(`🚀 COMPLAINT PATCH V2.1 ACTIVE [NOTIFICATIONS ENABLED]`);
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log('--------------------------------------------------');
});
