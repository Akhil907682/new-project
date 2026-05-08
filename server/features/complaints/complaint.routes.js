const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getUserComplaints,
  getComplaint,
  addMessage,
  addFeedback,
  getPublicFeedbacks,
} = require('./complaint.controller');
const { protect } = require('../../shared/middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const uploadDir = path.join(__dirname, '../../uploads');

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
  },
});

// Public Routes
router.get('/public/feedback', getPublicFeedbacks);

// Protected Routes
router.route('/')
  .post(protect, upload.single('image'), createComplaint)
  .get(protect, getUserComplaints);

router.get('/:id', protect, getComplaint);
router.post('/:id/messages', protect, addMessage);
router.patch('/:id/feedback', protect, addFeedback);

module.exports = router;
